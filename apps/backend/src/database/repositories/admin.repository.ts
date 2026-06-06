import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async logAction(data: { adminId: string; action: string; entity: string; entityId?: string; details?: any; ipAddress?: string }) {
    return this.prisma.adminLog.create({
      data: {
        adminId: data.adminId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details as any,
        ipAddress: data.ipAddress,
      },
    });
  }

  async getLogs(params: {
    skip?: number;
    take?: number;
    adminId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: Prisma.AdminLogWhereInput = {};
    if (params.adminId) where.adminId = params.adminId;
    if (params.action) where.action = params.action;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = params.startDate;
      if (params.endDate) where.createdAt.lte = params.endDate;
    }

    return this.prisma.adminLog.findMany({
      where,
      skip: params.skip,
      take: params.take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countLogs(where?: Prisma.AdminLogWhereInput) {
    return this.prisma.adminLog.count({ where });
  }

  async getDashboardStats() {
    const [totalUsers, totalVehicles, totalBookings, totalRevenue] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.vehicle.count({ where: { status: 'ACTIVE' } }),
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalUsers,
      totalVehicles,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }

  async getFraudAlerts(params: { skip?: number; take?: number; isResolved?: boolean; severity?: string }) {
    const where: Prisma.FraudAlertWhereInput = {};
    if (params.isResolved !== undefined) where.isResolved = params.isResolved;
    if (params.severity) where.severity = params.severity;

    return this.prisma.fraudAlert.findMany({
      where,
      skip: params.skip,
      take: params.take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveFraudAlert(id: string, resolvedBy: string) {
    return this.prisma.fraudAlert.update({
      where: { id },
      data: { isResolved: true, resolvedBy },
    });
  }

  async createFraudAlert(data: Prisma.FraudAlertCreateInput) {
    return this.prisma.fraudAlert.create({ data });
  }

  async paginate(model: string, params: { where?: any; skip?: number; take?: number; orderBy?: any; include?: any }) {
    const [data, total] = await Promise.all([
      (this.prisma as any)[model].findMany({
        where: params.where,
        skip: params.skip,
        take: params.take || 20,
        orderBy: params.orderBy,
        include: params.include,
      }),
      (this.prisma as any)[model].count({ where: params.where }),
    ]);
    return { data, total, skip: params.skip || 0, take: params.take || 20 };
  }
}
