import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

export const NOTIFICATION_JOBS = {
  SEND_EMAIL: 'send-email',
  SEND_SMS: 'send-sms',
  SEND_PUSH: 'send-push',
  SEND_BULK: 'send-bulk',
};

@Injectable()
@Processor('notifications')
export class NotificationJobs extends WorkerHost {
  private readonly logger = new Logger(NotificationJobs.name);

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case NOTIFICATION_JOBS.SEND_EMAIL:
        return this.sendEmail(job.data);
      case NOTIFICATION_JOBS.SEND_SMS:
        return this.sendSms(job.data);
      case NOTIFICATION_JOBS.SEND_PUSH:
        return this.sendPush(job.data);
      case NOTIFICATION_JOBS.SEND_BULK:
        return this.sendBulk(job.data);
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
        return null;
    }
  }

  private async sendEmail(data: any) {
    this.logger.log(`Sending email to: ${data.to}, subject: ${data.subject}`);
    return { success: true, type: 'email' };
  }

  private async sendSms(data: any) {
    this.logger.log(`Sending SMS to: ${data.phoneNumber}`);
    return { success: true, type: 'sms' };
  }

  private async sendPush(data: any) {
    this.logger.log(`Sending push notification to user: ${data.userId}`);
    return { success: true, type: 'push' };
  }

  private async sendBulk(data: any) {
    this.logger.log(`Sending bulk notifications: ${data.count} recipients`);
    return { success: true, type: 'bulk', count: data.count };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Notification job ${job.id} completed: ${job.name}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Notification job ${job.id} failed: ${error.message}`);
  }
}
