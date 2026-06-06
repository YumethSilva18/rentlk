import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PayHereService } from './payhere.service';
import { StripeService } from './stripe.service';
import { EzCashService } from './ezcash.service';
import { WebhookPayload } from './payment-gateway.interface';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly payhere: PayHereService,
    private readonly stripe: StripeService,
    private readonly ezcash: EzCashService,
  ) {}

  async handleWebhook(gateway: string, payload: WebhookPayload): Promise<void> {
    this.logger.log(`Handling ${gateway} webhook: ${payload.event}`);

    switch (gateway.toUpperCase()) {
      case 'PAYHERE':
        await this.handlePayHereWebhook(payload);
        break;
      case 'STRIPE':
        await this.handleStripeWebhook(payload);
        break;
      case 'EZCASH':
        await this.handleEzCashWebhook(payload);
        break;
      default:
        throw new BadRequestException(`Unknown payment gateway: ${gateway}`);
    }
  }

  private async handlePayHereWebhook(payload: WebhookPayload): Promise<void> {
    const { data } = payload;
    this.logger.log(`PayHere webhook: order ${data.order_id}, status ${data.status_code}`);

    switch (data.status_code) {
      case '2':
        this.logger.log(`Payment completed for order ${data.order_id}`);
        break;
      case '0':
        this.logger.log(`Payment pending for order ${data.order_id}`);
        break;
      case '-1':
        this.logger.warn(`Payment cancelled for order ${data.order_id}`);
        break;
      case '-2':
        this.logger.error(`Payment failed for order ${data.order_id}`);
        break;
    }
  }

  private async handleStripeWebhook(payload: WebhookPayload): Promise<void> {
    const { event, data } = payload;
    this.logger.log(`Stripe webhook: ${event}`);

    switch (event) {
      case 'payment_intent.succeeded':
        this.logger.log(`Stripe payment succeeded: ${data.id}`);
        break;
      case 'payment_intent.payment_failed':
        this.logger.warn(`Stripe payment failed: ${data.id}`);
        break;
      case 'charge.refunded':
        this.logger.log(`Stripe charge refunded: ${data.id}`);
        break;
    }
  }

  private async handleEzCashWebhook(payload: WebhookPayload): Promise<void> {
    const { event, data } = payload;
    this.logger.log(`EzCash webhook: ${event}`);

    switch (event) {
      case 'payment.success':
        this.logger.log(`EzCash payment success: ${data.transactionId}`);
        break;
      case 'payment.failure':
        this.logger.warn(`EzCash payment failure: ${data.transactionId}`);
        break;
    }
  }
}
