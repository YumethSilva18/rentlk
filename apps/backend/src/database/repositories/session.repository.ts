import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.userSession.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.userSession.findFirst({
      where: { token, status: 'ACTIVE' },
    });
  }

  async create(data: Prisma.UserSessionCreateInput) {
    return this.prisma.userSession.create({ data });
  }

  async createSession(params: {
    userId: string;
    token: string;
    ipAddress?: string;
    userAgent?: string;
    deviceInfo?: any;
    expiresAt: Date;
  }) {
    return this.prisma.userSession.create({
      data: {
        userId: params.userId,
        token: params.token,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        deviceInfo: params.deviceInfo,
        expiresAt: params.expiresAt,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy: { lastActiveAt: 'desc' },
    });
  }

  async updateLastActive(sessionId: string) {
    return this.prisma.userSession.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    });
  }

  async revoke(sessionId: string) {
    return this.prisma.userSession.update({
      where: { id: sessionId },
      data: { status: 'REVOKED' },
    });
  }

  async revokeAll(userId: string) {
    return this.prisma.userSession.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'REVOKED' },
    });
  }

  async revokeByToken(token: string) {
    return this.prisma.userSession.updateMany({
      where: { token, status: 'ACTIVE' },
      data: { status: 'REVOKED' },
    });
  }

  async cleanupExpired() {
    return this.prisma.userSession.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    });
  }

  async getActiveSessionCount(userId: string) {
    return this.prisma.userSession.count({
      where: { userId, status: 'ACTIVE' },
    });
  }

  async detectAnomaly(userId: string, ipAddress: string) {
    // Check if this IP has been seen before for this user
    const knownSessions = await this.prisma.userSession.findMany({
      where: { userId },
      select: { ipAddress: true },
    });

    const knownIps = new Set(knownSessions.map((s: any) => s.ipAddress));
    const isNewIp = knownIps.size > 0 && !knownIps.has(ipAddress);

    return { isNewIp, knownIpCount: knownIps.size };
  }
}
