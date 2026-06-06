import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async create(data: Prisma.NotificationCreateInput) {
    return this.prisma.notification.create({ data });
  }

  async createMany(data: Prisma.NotificationCreateManyInput[]) {
    return this.prisma.notification.createMany({ data });
  }

  async findByUser(userId: string, params?: { skip?: number; take?: number; isRead?: boolean }) {
    const where: Prisma.NotificationWhereInput = { userId };
    if (params?.isRead !== undefined) {
      where.isRead = params.isRead;
    }
    return this.prisma.notification.findMany({
      where,
      skip: params?.skip,
      take: params?.take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async deleteOld(days: number = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return this.prisma.notification.deleteMany({
      where: { createdAt: { lt: cutoff }, isRead: true },
    });
  }

  async count(where?: Prisma.NotificationWhereInput) {
    return this.prisma.notification.count({ where });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }

  async deleteReadByUser(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId, isRead: true },
    });
    return result.count;
  }
}
