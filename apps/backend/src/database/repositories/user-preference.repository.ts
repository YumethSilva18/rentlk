import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPreferenceRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findByUserId(userId: string) {
    return this.prisma.userPreference.findUnique({
      where: { userId },
    });
  }

  async create(data: Prisma.UserPreferenceCreateInput) {
    return this.prisma.userPreference.create({ data });
  }

  async upsert(userId: string, data: Partial<Prisma.UserPreferenceCreateInput>) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      create: { ...data, user: { connect: { id: userId } } } as Prisma.UserPreferenceCreateInput,
      update: data,
    });
  }

  async update(userId: string, data: Prisma.UserPreferenceUpdateInput) {
    return this.prisma.userPreference.update({
      where: { userId },
      data,
    });
  }

  async getNotificationPreferences(userId: string) {
    const prefs = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    return {
      emailNotifications: prefs?.emailNotifications ?? true,
      smsNotifications: prefs?.smsNotifications ?? true,
      pushNotifications: prefs?.pushNotifications ?? true,
      bookingAlerts: prefs?.bookingAlerts ?? true,
      paymentAlerts: prefs?.paymentAlerts ?? true,
      marketingAlerts: prefs?.marketingAlerts ?? false,
    };
  }

  async updateNotificationPreferences(userId: string, prefs: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    bookingAlerts?: boolean;
    paymentAlerts?: boolean;
    marketingAlerts?: boolean;
  }) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      create: {
        user: { connect: { id: userId } },
        ...prefs,
      },
      update: prefs,
    });
  }

  async shouldNotify(userId: string, type: string): Promise<boolean> {
    const prefs = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!prefs) return true; // Default: all notifications on

    switch (type) {
      case 'BOOKING_REQUEST':
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_CANCELLED':
        return prefs.bookingAlerts;
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_FAILED':
        return prefs.paymentAlerts;
      case 'SYSTEM':
        return true; // System notifications always on
      default:
        return true;
    }
  }
}
