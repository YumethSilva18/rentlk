import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { WalletRepository } from '../../database/repositories/wallet.repository';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, WalletRepository],
  exports: [WalletsService],
})
export class WalletsModule {}
