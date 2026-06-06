import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationRepository } from '../../database/repositories/notification.repository';
import { UserPreferenceRepository } from '../../database/repositories/user-preference.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { EmailModule } from '../../integrations/email/email.module';
import { SmsModule } from '../../integrations/sms/sms.module';

@Module({
  imports: [EmailModule, SmsModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationRepository,
    UserPreferenceRepository,
    UserRepository,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
