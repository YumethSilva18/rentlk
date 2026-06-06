import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SesService {
  private readonly logger = new Logger(SesService.name);
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('email.fromEmail', 'noreply@rentlk.lk');
    this.fromName = this.configService.get<string>('email.fromName', 'RentLK');
  }

  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<boolean> {
    try {
      this.logger.log(`Sending email to ${params.to}: ${params.subject}`);

      const emailData = {
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: { ToAddresses: [params.to] },
        Message: {
          Subject: { Data: params.subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: params.html, Charset: 'UTF-8' },
            ...(params.text && { Text: { Data: params.text, Charset: 'UTF-8' } }),
          },
        },
      };

      this.logger.log(`Email sent to ${params.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${params.to}: ${error}`);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Welcome to RentLK!';
    const html = `<h1>Welcome ${firstName}!</h1><p>Thank you for joining RentLK, Sri Lanka's peer-to-peer vehicle rental platform.</p>`;
    await this.sendEmail({ to: email, subject, html });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const subject = 'Password Reset Request';
    const resetLink = `${this.configService.get('app.frontendUrl')}/reset-password?token=${resetToken}`;
    const html = `<h1>Password Reset</h1><p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`;
    await this.sendEmail({ to: email, subject, html });
  }

  async sendBookingConfirmationEmail(email: string, booking: any): Promise<void> {
    const subject = `Booking Confirmed - ${booking.vehicle?.title || 'Vehicle'}`;
    const html = `<h1>Booking Confirmed!</h1><p>Your booking for ${booking.vehicle?.title} has been confirmed. Booking ID: ${booking.id}</p>`;
    await this.sendEmail({ to: email, subject, html });
  }

  async sendReceiptEmail(email: string, payment: any): Promise<void> {
    const subject = 'Payment Receipt - RentLK';
    const html = `<h1>Payment Receipt</h1><p>Amount: Rs. ${payment.amount}</p><p>Transaction ID: ${payment.id}</p>`;
    await this.sendEmail({ to: email, subject, html });
  }
}
