import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { QueueModule } from '@/jobs/queue.module';
import { HealthModule } from '@/health/health.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { VehiclesModule } from '@/modules/vehicles/vehicles.module';
import { BookingsModule } from '@/modules/bookings/bookings.module';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { WalletsModule } from '@/modules/wallets/wallets.module';
import { KycModule } from '@/modules/kyc/kyc.module';
import { MessagesModule } from '@/modules/messages/messages.module';
import { ReviewsModule } from '@/modules/reviews/reviews.module';
import { TrackingModule } from '@/modules/tracking/tracking.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { PayoutsModule } from '@/modules/payouts/payouts.module';
import { FraudModule as DomainFraudModule } from '@/modules/fraud/fraud.module';
import { EventBusService } from '@/events/event-bus.service';
import { EventHandlerService } from '@/events/event-handler.service';
import { PaymentsIntegrationModule } from '@/integrations/payments/payments.module';
import { SmsModule } from '@/integrations/sms/sms.module';
import { EmailModule } from '@/integrations/email/email.module';
import { StorageModule } from '@/integrations/storage/storage.module';
import { MapsModule } from '@/integrations/maps/maps.module';
import { WebsocketModule } from '@/integrations/websocket/websocket.module';
import { FraudModule } from '@/integrations/fraud/fraud.module';
import { environmentValidation } from '@/config/env/environment.validation';
import appConfig from '@/config/env/app.config';
import databaseConfig from '@/config/env/database.config';
import redisConfig from '@/config/env/redis.config';
import jwtConfig from '@/config/env/jwt.config';
import awsConfig from '@/config/env/aws.config';
import paymentConfig from '@/config/env/payment.config';
import smsConfig from '@/config/env/sms.config';
import emailConfig from '@/config/env/email.config';
import mapsConfig from '@/config/env/maps.config';
import websocketConfig from '@/config/env/websocket.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.production'],
      validationSchema: environmentValidation,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        jwtConfig,
        awsConfig,
        paymentConfig,
        smsConfig,
        emailConfig,
        mapsConfig,
        websocketConfig,
      ],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    QueueModule,
    HealthModule,
    // Feature modules
    AuthModule,
    UsersModule,
    VehiclesModule,
    BookingsModule,
    PaymentsModule,
    WalletsModule,
    KycModule,
    MessagesModule,
    ReviewsModule,
    TrackingModule,
    NotificationsModule,
    AdminModule,
    PayoutsModule,
    DomainFraudModule,
    // Integration modules
    PaymentsIntegrationModule,
    SmsModule,
    EmailModule,
    StorageModule,
    MapsModule,
    WebsocketModule,
    FraudModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventBusService,
    EventHandlerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
