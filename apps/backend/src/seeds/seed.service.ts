import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole, VehicleType, TransmissionType, FuelType, VehicleStatus } from '@prisma/client';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.RUN_SEEDS === 'true') {
      await this.seed();
    }
  }

  async seed() {
    this.logger.log('Seeding database...');

    const adminUser = await this.seedAdminUser();
    const testOwner = await this.seedTestUser('owner', UserRole.OWNER);
    const testRenter = await this.seedTestUser('renter', UserRole.CUSTOMER);
    const vehicle = await this.seedTestVehicle(testOwner.id);

    this.logger.log('Seeding completed!');
    return { adminUser: adminUser.id, testOwner: testOwner.id, testRenter: testRenter.id, vehicle: vehicle.id };
  }

  private async seedAdminUser() {
    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      this.logger.log('Admin user already exists');
      return existingAdmin;
    }

    const passwordHash = await bcrypt.hash('Admin@123456', 10);
    const admin = await this.prisma.user.create({
      data: {
        phoneNumber: '0770000000',
        email: 'admin@rentlk.lk',
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isVerified: true,
        isActive: true,
        address: 'Colombo 01',
        city: 'Colombo',
        district: 'Colombo',
      },
    });

    this.logger.log(`Admin user created: ${admin.id}`);
    return admin;
  }

  private async seedTestUser(type: string, role: UserRole) {
    const phoneNumber = type === 'owner' ? '0771111111' : '0772222222';
    const existing = await this.prisma.user.findFirst({ where: { phoneNumber } });

    if (existing) {
      this.logger.log(`Test ${type} user already exists`);
      return existing;
    }

    const passwordHash = await bcrypt.hash('Test@123456', 10);
    const user = await this.prisma.user.create({
      data: {
        phoneNumber,
        email: `${type}@rentlk.lk`,
        passwordHash,
        firstName: type === 'owner' ? 'Vehicle' : 'Renter',
        lastName: 'User',
        role,
        isVerified: true,
        isActive: true,
        address: '123 Main Street',
        city: 'Colombo',
        district: 'Colombo',
      },
    });

    // Create wallet for owner
    if (role === UserRole.OWNER) {
      await this.prisma.wallet.create({
        data: { userId: user.id, balance: 0 },
      });
    }

    this.logger.log(`Test ${type} user created: ${user.id}`);
    return user;
  }

  private async seedTestVehicle(ownerId: string) {
    const existing = await this.prisma.vehicle.findFirst({
      where: { ownerId },
    });

    if (existing) {
      this.logger.log('Test vehicle already exists');
      return existing;
    }

    const vehicle = await this.prisma.vehicle.create({
      data: {
        ownerId,
        title: 'Toyota Prius 2019 - Well Maintained',
        description: 'A reliable and fuel-efficient hybrid car. Perfect for city driving and long trips. Well maintained with full service history.',
        type: VehicleType.CAR,
        make: 'Toyota',
        model: 'Prius',
        year: 2019,
        licensePlate: 'WP-ABC-1234',
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.HYBRID,
        seats: 5,
        doors: 4,
        hasAC: true,
        hasGPS: true,
        mileage: 45000,
        color: 'Pearl White',
        dailyRate: 6500,
        weeklyDiscount: 5,
        monthlyDiscount: 15,
        securityDeposit: 25000,
        status: VehicleStatus.ACTIVE,
        city: 'Colombo',
        district: 'Colombo',
        latitude: 6.9271,
        longitude: 79.8612,
      },
    });

    // Add vehicle images
    await this.prisma.vehicleImage.createMany({
      data: [
        { vehicleId: vehicle.id, url: 'https://example.com/images/prius-1.jpg', isPrimary: true, order: 0 },
        { vehicleId: vehicle.id, url: 'https://example.com/images/prius-2.jpg', order: 1 },
        { vehicleId: vehicle.id, url: 'https://example.com/images/prius-3.jpg', order: 2 },
      ],
    });

    // Add vehicle features
    await this.prisma.vehicleFeature.createMany({
      data: [
        { vehicleId: vehicle.id, name: 'Bluetooth' },
        { vehicleId: vehicle.id, name: 'Reverse Camera' },
        { vehicleId: vehicle.id, name: 'USB Charging' },
        { vehicleId: vehicle.id, name: 'Sunroof' },
      ],
    });

    this.logger.log(`Test vehicle created: ${vehicle.id}`);
    return vehicle;
  }
}
