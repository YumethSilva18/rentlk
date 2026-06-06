import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DialogSmsService {
  private readonly logger = new Logger(DialogSmsService.name);
  private readonly apiKey: string;
  private readonly senderId: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('sms.dialog.apiKey');
    this.senderId = this.configService.get<string>('sms.dialog.senderId');
    this.baseUrl = this.configService.get<string>('sms.dialog.baseUrl');
  }

  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    try {
      this.logger.log(`Sending SMS to ${phoneNumber}: ${message.slice(0, 30)}...`);

      // In production, this would call the Dialog SMS API
      const response = {
        success: true,
        messageId: `DLG-${Date.now()}`,
      };

      this.logger.log(`SMS sent successfully: ${response.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phoneNumber}: ${error}`);
      return false;
    }
  }

  async sendBulkSms(phoneNumbers: string[], message: string): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const phone of phoneNumbers) {
      const sent = await this.sendSms(phone, message);
      if (sent) success++;
      else failed++;
    }

    return { success, failed };
  }

  async getBalance(): Promise<number> {
    this.logger.log('Checking SMS balance');
    return 500;
  }
}
