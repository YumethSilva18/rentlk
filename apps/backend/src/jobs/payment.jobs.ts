import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue, Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';

export const PAYMENT_JOBS = {
  PROCESS_PAYMENT: 'process-payment',
  REFUND_PAYMENT: 'refund-payment',
  VERIFY_PAYMENT: 'verify-payment',
  PAYOUT: 'payout',
};

@Injectable()
@Processor('payments')
export class PaymentJobs extends WorkerHost {
  private readonly logger = new Logger(PaymentJobs.name);

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case PAYMENT_JOBS.PROCESS_PAYMENT:
        return this.processPayment(job.data);
      case PAYMENT_JOBS.REFUND_PAYMENT:
        return this.refundPayment(job.data);
      case PAYMENT_JOBS.VERIFY_PAYMENT:
        return this.verifyPayment(job.data);
      case PAYMENT_JOBS.PAYOUT:
        return this.processPayout(job.data);
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
        return null;
    }
  }

  private async processPayment(data: any) {
    this.logger.log(`Processing payment for booking: ${data.bookingId}`);
    // Actual payment processing logic via payment gateway
    return { success: true, paymentId: data.paymentId };
  }

  private async refundPayment(data: any) {
    this.logger.log(`Refunding payment: ${data.paymentId}`);
    return { success: true, refunded: data.amount };
  }

  private async verifyPayment(data: any) {
    this.logger.log(`Verifying payment: ${data.paymentId}`);
    return { success: true, verified: true };
  }

  private async processPayout(data: any) {
    this.logger.log(`Processing payout for wallet: ${data.walletId}, amount: ${data.amount}`);
    return { success: true };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed: ${job.name}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${job.name} - ${error.message}`);
  }
}
