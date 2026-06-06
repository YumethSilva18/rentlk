import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  dialog: {
    apiKey: process.env.DIALOG_SMS_API_KEY || '',
    senderId: process.env.DIALOG_SMS_SENDER_ID || 'SLRental',
    apiUrl: process.env.DIALOG_SMS_API_URL || 'https://api.dialog.lk/sms/send',
  },
  otpLength: parseInt(process.env.OTP_LENGTH || '6', 10),
  otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
}));
