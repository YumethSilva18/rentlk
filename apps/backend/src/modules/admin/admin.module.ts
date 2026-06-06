import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from '../../database/repositories/admin.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { KycRepository } from '../../database/repositories/kyc.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { VehicleRepository } from '../../database/repositories/vehicle.repository';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { PayoutRepository } from '../../database/repositories/payout.repository';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    UserRepository,
    KycRepository,
    BookingRepository,
    VehicleRepository,
    PaymentRepository,
    PayoutRepository,
    PrismaService,
  ],
  exports: [AdminService],
})
export class AdminModule {}
