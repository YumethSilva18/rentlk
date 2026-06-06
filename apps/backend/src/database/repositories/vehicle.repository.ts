import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehicleRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: true,
        features: true,
        owner: { select: { id: true, firstName: true, lastName: true, rating: true, phoneNumber: true } },
      },
    });
  }

  async create(data: Prisma.VehicleCreateInput) {
    return this.prisma.vehicle.create({
      data,
      include: { images: true, features: true },
    });
  }

  async update(id: string, data: Prisma.VehicleUpdateInput) {
    return this.prisma.vehicle.update({
      where: { id },
      data,
      include: { images: true, features: true },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.vehicle.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        owner: { select: { id: true, firstName: true, lastName: true, rating: true } },
      },
    });
  }

  async count(where?: Prisma.VehicleWhereInput) {
    return this.prisma.vehicle.count({ where });
  }

  async findByOwner(ownerId: string, params?: { status?: string; skip?: number; take?: number }) {
    const where: any = { ownerId };
    if (params?.status) where.status = params.status;
    return this.prisma.vehicle.findMany({
      where,
      skip: params?.skip,
      take: params?.take,
      include: { images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.vehicle.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async searchAvailable(params: {
    startDate: Date;
    endDate: Date;
    city?: string;
    type?: string;
    minRate?: number;
    maxRate?: number;
    seats?: number;
    transmission?: string;
    fuelType?: string;
    skip?: number;
    take?: number;
  }) {
    const { startDate, endDate, city, type, minRate, maxRate, seats, transmission, fuelType, skip, take } = params;

    const where: Prisma.VehicleWhereInput = {
      status: 'ACTIVE',
      ...(city && { city: { equals: city, mode: 'insensitive' } }),
      ...(type && { type: type as any }),
      ...(seats && { seats: { gte: seats } }),
      ...(transmission && { transmission: transmission as any }),
      ...(fuelType && { fuelType: fuelType as any }),
      ...(minRate !== undefined && { dailyRate: { gte: minRate } }),
      ...(maxRate !== undefined && { dailyRate: { lte: maxRate } }),
      NOT: {
        bookings: {
          some: {
            status: { in: ['CONFIRMED', 'ACTIVE'] },
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gt: startDate } },
            ],
          },
        },
      },
    };

    return this.prisma.vehicle.findMany({
      skip,
      take,
      where,
      orderBy: { rating: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        owner: { select: { id: true, firstName: true, lastName: true, rating: true } },
      },
    });
  }

  async addImage(vehicleId: string, data: Prisma.VehicleImageCreateInput) {
    return this.prisma.vehicleImage.create({
      data: { ...data, vehicleId },
    });
  }

  async addFeature(vehicleId: string, name: string) {
    return this.prisma.vehicleFeature.create({
      data: { vehicleId, name },
    });
  }

  async removeFeature(vehicleId: string, name: string) {
    return this.prisma.vehicleFeature.delete({
      where: { vehicleId_name: { vehicleId, name } },
    });
  }
}
