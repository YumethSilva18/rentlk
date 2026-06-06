import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycRepository } from '../../database/repositories/kyc.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { WalletRepository } from '../../database/repositories/wallet.repository';

@Module({
  controllers: [KycController],
  providers: [KycService, KycRepository, UserRepository, WalletRepository],
  exports: [KycService],
})
export class KycModule {}
