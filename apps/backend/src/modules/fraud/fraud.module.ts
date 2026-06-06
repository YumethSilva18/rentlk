import { Module } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { FraudModule as IntegrationFraudModule } from '../../integrations/fraud/fraud.module';
import { PrismaService } from '../../database/prisma/prisma.service';

@Module({
  imports: [IntegrationFraudModule],
  providers: [FraudService, PrismaService],
  exports: [FraudService],
})
export class FraudModule {}
