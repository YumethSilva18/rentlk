import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.trackingSession.findUnique({
      where: { id },
      include: { locations: { orderBy: { timestamp: 'desc' }, take: 100 } },
    });
  }

  async create(data: Prisma.TrackingSessionCreateInput) {
    return this.prisma.trackingSession.create({ data });
  }

  async update(id: string, data: Prisma.TrackingSessionUpdateInput) {
    return this.prisma.trackingSession.update({ where: { id }, data });
  }

  async findByBooking(bookingId: string) {
    return this.prisma.trackingSession.findMany({
      where: { bookingId },
      orderBy: { startTime: 'desc' },
    });
  }

  async findActiveByVehicle(vehicleId: string) {
    return this.prisma.trackingSession.findFirst({
      where: { vehicleId, status: 'ACTIVE' },
      include: { locations: { orderBy: { timestamp: 'desc' }, take: 1 } },
    });
  }

  async addLocation(data: Prisma.TrackingLocationCreateInput) {
    return this.prisma.trackingLocation.create({ data });
  }

  async addLocations(data: Prisma.TrackingLocationCreateManyInput[]) {
    return this.prisma.trackingLocation.createMany({ data });
  }

  async getLocations(sessionId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.trackingLocation.findMany({
      where: { sessionId },
      skip: params?.skip,
      take: params?.take || 1000,
      orderBy: { timestamp: 'asc' },
    });
  }

  async endSession(id: string, data: { endTime: Date; distanceKm?: number; avgSpeed?: number; maxSpeed?: number }) {
    return this.prisma.trackingSession.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endTime: data.endTime,
        distanceKm: data.distanceKm,
        avgSpeed: data.avgSpeed,
        maxSpeed: data.maxSpeed,
      },
    });
  }

  async getActiveSessions() {
    return this.prisma.trackingSession.findMany({
      where: { status: 'ACTIVE' },
      include: {
        booking: { select: { id: true, renterId: true, ownerId: true } },
      },
    });
  }
}
