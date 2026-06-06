import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedVehicleRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async save(userId: string, vehicleId: string) {
    return this.prisma.savedVehicle.upsert({
      where: {
        userId_vehicleId: { userId, vehicleId },
      },
      create: { userId, vehicleId },
      update: {},
    });
  }

  async unsave(userId: string, vehicleId: string) {
    return this.prisma.savedVehicle.delete({
      where: {
        userId_vehicleId: { userId, vehicleId },
      },
    }).catch(() => null);
  }

  async findByUser(userId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.savedVehicle.findMany({
      where: { userId },
      include: {
        vehicle: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            owner: { select: { id: true, firstName: true, lastName: true, rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: params?.skip,
      take: params?.take || 50,
    });
  }

  async isSaved(userId: string, vehicleId: string) {
    const count = await this.prisma.savedVehicle.count({
      where: { userId, vehicleId },
    });
    return count > 0;
  }

  async getSavedCount(userId: string) {
    return this.prisma.savedVehicle.count({
      where: { userId },
    });
  }

  async getVehicleSavers(vehicleId: string) {
    return this.prisma.savedVehicle.findMany({
      where: { vehicleId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }
}
