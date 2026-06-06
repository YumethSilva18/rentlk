import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        vehicle: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        renter: { select: { id: true, firstName: true, lastName: true, phoneNumber: true, rating: true } },
        owner: { select: { id: true, firstName: true, lastName: true, phoneNumber: true, rating: true } },
        payments: true,
        reviews: true,
      },
    });
  }

  async create(data: Prisma.BookingCreateInput) {
    return this.prisma.booking.create({ data });
  }

  async update(id: string, data: Prisma.BookingUpdateInput) {
    return this.prisma.booking.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async updateStatusWithHistory(
    id: string,
    toStatus: string,
    changedBy: string,
    reason?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new Error('Booking not found');

    const fromStatus = booking.status;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: toStatus as any },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          fromStatus: fromStatus as string,
          toStatus,
          changedBy,
          reason,
        },
      });

      return updated;
    });
  }

  async getStatusHistory(bookingId: string) {
    return this.prisma.bookingStatusHistory.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async completeBooking(bookingId: string, changedBy: string) {
    return this.updateStatusWithHistory(bookingId, 'COMPLETED', changedBy, 'Booking completed');
  }

  async disputeBooking(bookingId: string, changedBy: string, reason: string) {
    return this.updateStatusWithHistory(bookingId, 'DISPUTED', changedBy, reason);
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput;
    include?: Prisma.BookingInclude;
  }) {
    const { skip, take, where, orderBy, include } = params;
    return this.prisma.booking.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: include || { vehicle: true },
    });
  }

  async count(where?: Prisma.BookingWhereInput) {
    return this.prisma.booking.count({ where });
  }

  async findByRenter(renterId: string, status?: string) {
    return this.prisma.booking.findMany({
      where: {
        renterId,
        ...(status && { status: status as any }),
      },
      include: {
        vehicle: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        owner: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOwner(ownerId: string, status?: string) {
    return this.prisma.booking.findMany({
      where: {
        ownerId,
        ...(status && { status: status as any }),
      },
      include: {
        vehicle: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        renter: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkOverlap(vehicleId: string, startDate: Date, endDate: Date, excludeBookingId?: string) {
    return this.prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { in: ['CONFIRMED', 'ACTIVE'] },
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
        ],
      },
    });
  }

  async cancelBooking(id: string, cancelledById: string, reason: string) {
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledById,
        cancelReason: reason,
      },
    });
  }
}
