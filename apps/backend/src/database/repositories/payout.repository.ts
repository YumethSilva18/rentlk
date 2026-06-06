import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.payout.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } },
        wallet: { select: { id: true, balance: true } },
      },
    });
  }

  async create(data: Prisma.PayoutCreateInput) {
    return this.prisma.payout.create({ data });
  }

  async update(id: string, data: Prisma.PayoutUpdateInput) {
    return this.prisma.payout.update({ where: { id }, data });
  }

  async findByUser(userId: string, params?: { status?: string; skip?: number; take?: number }) {
    return this.prisma.payout.findMany({
      where: {
        userId,
        ...(params?.status && { status: params.status as any }),
      },
      orderBy: { createdAt: 'desc' },
      skip: params?.skip,
      take: params?.take || 50,
      include: {
        wallet: { select: { id: true, balance: true } },
      },
    });
  }

  async findByStatus(status: string, params?: { skip?: number; take?: number }) {
    return this.prisma.payout.findMany({
      where: { status: status as any },
      orderBy: { createdAt: 'asc' },
      skip: params?.skip,
      take: params?.take || 50,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } },
        wallet: { select: { id: true, balance: true } },
      },
    });
  }

  async findPending(params?: { skip?: number; take?: number }) {
    return this.findByStatus('PENDING', params);
  }

  async findApproved(params?: { skip?: number; take?: number }) {
    return this.findByStatus('APPROVED', params);
  }

  async approve(payoutId: string, adminId: string) {
    return this.prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: 'APPROVED',
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });
  }

  async markProcessing(payoutId: string) {
    return this.prisma.payout.update({
      where: { id: payoutId },
      data: { status: 'PROCESSING' },
    });
  }

  async markCompleted(payoutId: string, reference: string) {
    return this.prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        reference,
      },
    });
  }

  async markFailed(payoutId: string, reason: string) {
    return this.prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: 'FAILED',
        failedReason: reason,
      },
    });
  }

  async cancel(payoutId: string) {
    return this.prisma.payout.update({
      where: { id: payoutId },
      data: { status: 'CANCELLED' },
    });
  }

  async getPendingTotal() {
    const result = await this.prisma.payout.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true },
      _count: true,
    });
    return {
      total: Number(result._sum.amount || 0),
      count: result._count,
    };
  }

  async getUserPayoutTotal(userId: string) {
    const [totalEarned, totalPending, totalPaid] = await Promise.all([
      this.prisma.payout.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      this.prisma.payout.aggregate({
        where: { userId, status: { in: ['PENDING', 'APPROVED', 'PROCESSING'] } },
        _sum: { amount: true },
      }),
      this.prisma.payout.aggregate({
        where: { userId, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalRequested: Number(totalEarned._sum.amount || 0),
      pendingAmount: Number(totalPending._sum.amount || 0),
      totalPaid: Number(totalPaid._sum.amount || 0),
    };
  }

  async hasPendingPayout(userId: string) {
    const count = await this.prisma.payout.count({
      where: {
        userId,
        status: { in: ['PENDING', 'APPROVED', 'PROCESSING'] },
      },
    });
    return count > 0;
  }
}
