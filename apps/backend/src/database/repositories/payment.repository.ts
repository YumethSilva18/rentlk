import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true, user: true },
    });
  }

  async create(data: Prisma.PaymentCreateInput) {
    return this.prisma.payment.create({ data });
  }

  async update(id: string, data: Prisma.PaymentUpdateInput) {
    return this.prisma.payment.update({ where: { id }, data });
  }

  async findByBooking(bookingId: string) {
    return this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.payment.findMany({
      where: { userId },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
      include: { booking: { select: { id: true, vehicle: { select: { title: true } } } } },
    });
  }

  async findByIdempotencyKey(key: string) {
    return this.prisma.payment.findUnique({
      where: { idempotencyKey: key },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.payment.findMany({
      where: { status: status as any },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getTotalRevenue(startDate?: Date, endDate?: Date) {
    const where: Prisma.PaymentWhereInput = {
      status: 'COMPLETED',
      ...(startDate && endDate && {
        createdAt: { gte: startDate, lte: endDate },
      }),
    };

    const result = await this.prisma.payment.aggregate({
      where,
      _sum: { amount: true, refundedAmount: true },
    });

    return {
      totalRevenue: result._sum.amount || 0,
      totalRefunded: result._sum.refundedAmount || 0,
    };
  }

  async count(where?: Prisma.PaymentWhereInput) {
    return this.prisma.payment.count({ where });
  }
}
