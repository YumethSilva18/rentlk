import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { VehicleRepository } from '../../database/repositories/vehicle.repository';
import { WalletRepository } from '../../database/repositories/wallet.repository';
import { PaymentsModule } from '../../integrations/payments/payments.module';
import { FraudModule } from '../../integrations/fraud/fraud.module';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  imports: [PaymentsModule, FraudModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingRepository, VehicleRepository, WalletRepository, PrismaService],
  exports: [BookingsService],
})
export class BookingsModule {}
