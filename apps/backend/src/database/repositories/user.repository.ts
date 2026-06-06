import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { wallet: true, kycDocuments: true },
    });
  }

  async findByPhone(phoneNumber: string) {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
      include: { wallet: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where: { ...where, isActive: true },
      orderBy: orderBy || { createdAt: 'desc' },
      include: { wallet: true },
    });
  }

  async count(where?: Prisma.UserWhereInput) {
    return this.prisma.user.count({ where: { ...where, isActive: true } });
  }

  async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async findByReferralCode(code: string) {
    return this.prisma.user.findUnique({ where: { referralCode: code } });
  }

  async incrementLoginAttempts(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { loginAttempts: { increment: 1 } },
    });
  }

  async resetLoginAttempts(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { loginAttempts: 0, lockedUntil: null },
    });
  }

  async lockAccount(id: string, lockoutMinutes: number = 30) {
    const lockedUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
    return this.prisma.user.update({
      where: { id },
      data: { lockedUntil },
    });
  }

  async isLocked(id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { lockedUntil: true },
    });
    if (!user?.lockedUntil) return false;
    return new Date() < user.lockedUntil;
  }

  async suspend(userId: string, reason: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true, suspendedReason: reason, isActive: false },
    });
  }

  async reinstate(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended: false, suspendedReason: null, isActive: true },
    });
  }
}
