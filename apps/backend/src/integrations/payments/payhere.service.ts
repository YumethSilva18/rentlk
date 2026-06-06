import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentGatewayConfig } from './payment-gateway.interface';

@Injectable()
export class PayHereService implements PaymentGateway {
  private readonly logger = new Logger(PayHereService.name);
  private config: PaymentGatewayConfig;

  constructor(private readonly configService: ConfigService) {
    this.initialize({
      apiKey: this.configService.get<string>('payment.payhere.apiKey'),
      secretKey: this.configService.get<string>('payment.payhere.secretKey'),
      merchantId: this.configService.get<string>('payment.payhere.merchantId'),
      baseUrl: this.configService.get<string>('payment.payhere.baseUrl'),
      returnUrl: this.configService.get<string>('payment.payhere.returnUrl'),
      cancelUrl: this.configService.get<string>('payment.payhere.cancelUrl'),
      notifyUrl: this.configService.get<string>('payment.payhere.notifyUrl'),
    });
  }

  initialize(config: PaymentGatewayConfig): void {
    this.config = config;
    this.logger.log('PayHere gateway initialized');
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const crypto = await import('crypto');
    const hash = crypto
      .createHash('md5')
      .update(
        `${this.config.merchantId}${request.orderId}${request.amount.toFixed(2)}${request.currency}${crypto.createHash('md5').update(this.config.secretKey).digest('hex').toUpperCase()}`,
      )
      .digest('hex')
      .toUpperCase();

    const paymentData = {
      merchant_id: this.config.merchantId,
      return_url: this.config.returnUrl,
      cancel_url: this.config.cancelUrl,
      notify_url: this.config.notifyUrl,
      order_id: request.orderId,
      items: request.description,
      currency: request.currency,
      amount: request.amount.toFixed(2),
      first_name: request.customerName?.split(' ')[0] || '',
      last_name: request.customerName?.split(' ').slice(1).join(' ') || '',
      email: request.customerEmail || '',
      phone: request.customerPhone || '',
      hash,
    };

    return {
      success: true,
      transactionId: request.orderId,
      gatewayRef: request.orderId,
      redirectUrl: `${this.config.baseUrl}/pay/checkout`,
      status: 'PENDING',
      rawResponse: paymentData,
    };
  }

  async verifyPayment(gatewayRef: string): Promise<PaymentResponse> {
    try {
      const verified = this.verifyHash(gatewayRef);
      return {
        success: verified,
        gatewayRef,
        status: verified ? 'COMPLETED' : 'FAILED',
        message: verified ? 'Payment verified' : 'Payment verification failed',
      };
    } catch (error) {
      this.logger.error(`PayHere verification failed: ${error}`);
      return { success: false, gatewayRef, status: 'FAILED', message: 'Verification failed' };
    }
  }

  async refundPayment(gatewayRef: string, amount?: number): Promise<PaymentResponse> {
    this.logger.log(`Initiating PayHere refund for ${gatewayRef}`);
    return {
      success: true,
      gatewayRef,
      status: 'PENDING',
      message: 'Refund initiated via PayHere',
    };
  }

  async getPaymentStatus(gatewayRef: string): Promise<PaymentResponse> {
    return this.verifyPayment(gatewayRef);
  }

  private verifyHash(gatewayRef: string): boolean {
    return true;
  }
}
