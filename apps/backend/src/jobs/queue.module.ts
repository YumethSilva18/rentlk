import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentJobs } from './payment.jobs';
import { NotificationJobs } from './notification.jobs';
import { FraudJobs } from './fraud.jobs';
import { CleanupJobs } from './cleanup.jobs';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'payments' },
      { name: 'notifications' },
      { name: 'fraud' },
      { name: 'cleanup' },
    ),
  ],
  providers: [PaymentJobs, NotificationJobs, FraudJobs, CleanupJobs],
  exports: [BullModule],
})
export class QueueModule {}
