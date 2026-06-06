import { Module } from '@nestjs/common';
import { PayoutsController } from './payouts.controller';
import { PayoutsService } from './payouts.service';
import { PayoutRepository } from '../../database/repositories/payout.repository';
import { WalletRepository } from '../../database/repositories/wallet.repository';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  controllers: [PayoutsController],
  providers: [PayoutsService, PayoutRepository, WalletRepository, PrismaService],
  exports: [PayoutsService],
})
export class PayoutsModule {}
