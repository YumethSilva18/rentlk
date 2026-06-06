import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: { reviewer: true, reviewee: true, booking: true },
    });
  }

  async create(data: Prisma.ReviewCreateInput) {
    return this.prisma.review.create({ data });
  }

  async findByBooking(bookingId: string) {
    return this.prisma.review.findUnique({ where: { bookingId } });
  }

  async findByUser(userId: string, as: 'reviewer' | 'reviewee') {
    const where = as === 'reviewer' ? { reviewerId: userId } : { revieweeId: userId };
    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        reviewee: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        vehicle: { select: { id: true, title: true } },
      },
    });
  }

  async findByVehicle(vehicleId: string) {
    return this.prisma.review.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
      },
    });
  }

  async getAverageRating(userId: string) {
    const result = await this.prisma.review.aggregate({
      where: { revieweeId: userId, isPublic: true },
      _avg: { rating: true },
      _count: true,
    });
    return {
      average: result._avg.rating || 0,
      count: result._count,
    };
  }

  async getVehicleAverageRating(vehicleId: string) {
    const result = await this.prisma.review.aggregate({
      where: { vehicleId, isPublic: true },
      _avg: { rating: true },
      _count: true,
    });
    return {
      average: result._avg.rating || 0,
      count: result._count,
    };
  }

  async update(id: string, data: Prisma.ReviewUpdateInput) {
    return this.prisma.review.update({ where: { id }, data });
  }

  async getRatingDistribution(userId: string) {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId, isPublic: true },
      select: { rating: true },
    });
    for (const r of reviews) {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    }
    return distribution;
  }
}
