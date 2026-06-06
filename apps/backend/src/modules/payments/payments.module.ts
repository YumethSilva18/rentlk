import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { WalletRepository } from '../../database/repositories/wallet.repository';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository, BookingRepository, WalletRepository, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
