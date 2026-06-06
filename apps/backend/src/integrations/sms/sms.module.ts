import { Module } from '@nestjs/common';
import { DialogSmsService } from './dialog-sms.service';
import { OtpSmsService } from './otp-sms.service';

@Module({
  providers: [DialogSmsService, OtpSmsService],
  exports: [DialogSmsService, OtpSmsService],
})
export class SmsModule {}
