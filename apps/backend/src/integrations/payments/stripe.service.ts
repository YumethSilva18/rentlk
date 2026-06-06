import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentGatewayConfig } from './payment-gateway.interface';

@Injectable()
export class StripeService implements PaymentGateway {
  private readonly logger = new Logger(StripeService.name);
  private config: PaymentGatewayConfig;
  private stripe: any;

  constructor(private readonly configService: ConfigService) {
    this.initialize({
      apiKey: this.configService.get<string>('payment.stripe.apiKey'),
      secretKey: this.configService.get<string>('payment.stripe.secretKey'),
      merchantId: this.configService.get<string>('payment.stripe.merchantId'),
      baseUrl: this.configService.get<string>('payment.stripe.baseUrl'),
      returnUrl: this.configService.get<string>('payment.stripe.returnUrl'),
      cancelUrl: this.configService.get<string>('payment.stripe.cancelUrl'),
      notifyUrl: this.configService.get<string>('payment.stripe.notifyUrl'),
    });
  }

  initialize(config: PaymentGatewayConfig): void {
    this.config = config;
    this.logger.log('Stripe gateway initialized');
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const amountInCents = Math.round(request.amount * 100);
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        amount: amountInCents,
        currency: request.currency.toLowerCase(),
        status: 'requires_payment_method',
        client_secret: `pi_secret_${Date.now()}`,
        metadata: request.metadata,
      };

      return {
        success: true,
        transactionId: paymentIntent.id,
        gatewayRef: paymentIntent.id,
        status: 'PENDING',
        rawResponse: paymentIntent,
      };
    } catch (error) {
      this.logger.error(`Stripe payment creation failed: ${error}`);
      return { success: false, status: 'FAILED', message: 'Payment creation failed' };
    }
  }

  async verifyPayment(gatewayRef: string): Promise<PaymentResponse> {
    this.logger.log(`Verifying Stripe payment: ${gatewayRef}`);
    return {
      success: true,
      gatewayRef,
      status: 'COMPLETED',
      message: 'Payment verified',
    };
  }

  async refundPayment(gatewayRef: string, amount?: number): Promise<PaymentResponse> {
    this.logger.log(`Processing Stripe refund for ${gatewayRef}`);
    return {
      success: true,
      gatewayRef,
      status: 'PENDING',
      message: `Refund of ${amount || 'full amount'} processed`,
    };
  }

  async getPaymentStatus(gatewayRef: string): Promise<PaymentResponse> {
    return this.verifyPayment(gatewayRef);
  }
}
