import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { phoneNumber: '0770000000' },
    update: {},
    create: {
      phoneNumber: '0770000000',
      email: 'admin@rentlk.lk',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      address: 'Colombo 01',
      city: 'Colombo',
      district: 'Colombo',
    },
  });
  console.log(`✅ Admin user: ${admin.id}`);

  // Create test owner
  const ownerPassword = await bcrypt.hash('Test@123456', 10);
  const owner = await prisma.user.upsert({
    where: { phoneNumber: '0771111111' },
    update: {},
    create: {
      phoneNumber: '0771111111',
      email: 'owner@rentlk.lk',
      passwordHash: ownerPassword,
      firstName: 'Vehicle',
      lastName: 'Owner',
      role: 'OWNER',
      isVerified: true,
      isActive: true,
      city: 'Colombo',
      district: 'Colombo',
    },
  });
  console.log(`✅ Owner user: ${owner.id}`);

  // Create wallet for owner
  await prisma.wallet.upsert({
    where: { userId: owner.id },
    update: {},
    create: { userId: owner.id, balance: 0 },
  });

  // Create test renter
  const renter = await prisma.user.upsert({
    where: { phoneNumber: '0772222222' },
    update: {},
    create: {
      phoneNumber: '0772222222',
      email: 'renter@rentlk.lk',
      passwordHash: ownerPassword,
      firstName: 'Renter',
      lastName: 'User',
      role: 'CUSTOMER',
      isVerified: true,
      isActive: true,
      city: 'Colombo',
      district: 'Colombo',
    },
  });
  console.log(`✅ Renter user: ${renter.id}`);

  // Create test vehicle
  const vehicle = await prisma.vehicle.create({
    data: {
      ownerId: owner.id,
      title: 'Toyota Prius 2019 - Well Maintained',
      description: 'A reliable and fuel-efficient hybrid car.',
      type: 'CAR',
      make: 'Toyota',
      model: 'Prius',
      year: 2019,
      licensePlate: 'WP-ABC-1234',
      transmission: 'AUTOMATIC',
      fuelType: 'HYBRID',
      seats: 5,
      doors: 4,
      hasAC: true,
      hasGPS: true,
      mileage: 45000,
      color: 'Pearl White',
      dailyRate: 6500,
      securityDeposit: 25000,
      status: 'ACTIVE',
      city: 'Colombo',
      district: 'Colombo',
      latitude: 6.9271,
      longitude: 79.8612,
    },
  });
  console.log(`✅ Test vehicle: ${vehicle.id}`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
