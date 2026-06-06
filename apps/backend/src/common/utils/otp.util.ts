import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpUtil {
  generateOtp(length: number = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  async hashOtp(otp: string): Promise<string> {
    const { createHash } = await import('crypto');
    return createHash('sha256').update(otp).digest('hex');
  }

  async verifyOtp(otp: string, hashedOtp: string): Promise<boolean> {
    const hash = await this.hashOtp(otp);
    return hash === hashedOtp;
  }

  getOtpExpiry(minutes: number = 5): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  isOtpExpired(expiry: Date): boolean {
    return new Date() > expiry;
  }

  generateVerificationCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
