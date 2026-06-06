import { Module } from '@nestjs/common';
import { PayHereService } from './payhere.service';
import { StripeService } from './stripe.service';
import { EzCashService } from './ezcash.service';
import { WebhookService } from './webhook.service';
import { PayoutService } from './payout.service';
import { IdempotencyService } from './idempotency.service';

@Module({
  providers: [
    PayHereService,
    StripeService,
    EzCashService,
    WebhookService,
    PayoutService,
    IdempotencyService,
  ],
  exports: [
    PayHereService,
    StripeService,
    EzCashService,
    WebhookService,
    PayoutService,
    IdempotencyService,
  ],
})
export class PaymentsModule {}
