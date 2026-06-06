import { Injectable, Logger } from '@nestjs/common';
import { DialogSmsService } from './dialog-sms.service';
import { OtpUtil } from '../../common/utils/otp.util';

@Injectable()
export class OtpSmsService {
  private readonly logger = new Logger(OtpSmsService.name);

  constructor(
    private readonly dialogSms: DialogSmsService,
    private readonly otpUtil: OtpUtil,
  ) {}

  async sendOtp(phoneNumber: string): Promise<{ code: string; expiresAt: Date }> {
    const code = this.otpUtil.generateOtp(6);
    const expiresAt = this.otpUtil.getOtpExpiry(5);
    const message = `Your RentLK verification code is: ${code}. Valid for 5 minutes.`;

    const sent = await this.dialogSms.sendSms(phoneNumber, message);
    if (!sent) {
      throw new Error('Failed to send OTP');
    }

    this.logger.log(`OTP sent to ${phoneNumber}`);
    return { code, expiresAt };
  }

  async sendBookingConfirmation(phoneNumber: string, bookingId: string, vehicleName: string): Promise<void> {
    const message = `Your booking #${bookingId.slice(0, 8)} for ${vehicleName} has been confirmed. Track your booking in the RentLK app.`;
    await this.dialogSms.sendSms(phoneNumber, message);
  }

  async sendPaymentConfirmation(phoneNumber: string, amount: number, bookingId: string): Promise<void> {
    const message = `Payment of Rs. ${amount.toFixed(2)} received for booking #${bookingId.slice(0, 8)}. Thank you for using RentLK.`;
    await this.dialogSms.sendSms(phoneNumber, message);
  }

  async sendKycStatusUpdate(phoneNumber: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    const message = status === 'APPROVED'
      ? 'Your KYC verification has been approved. You can now list and book vehicles on RentLK.'
      : 'Your KYC verification was rejected. Please check the app for more details.';
    await this.dialogSms.sendSms(phoneNumber, message);
  }
}
