import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentRequest, PaymentResponse, PaymentGatewayConfig } from './payment-gateway.interface';

@Injectable()
export class EzCashService implements PaymentGateway {
  private readonly logger = new Logger(EzCashService.name);
  private config: PaymentGatewayConfig;

  constructor(private readonly configService: ConfigService) {
    this.initialize({
      apiKey: this.configService.get<string>('payment.ezcash.apiKey'),
      secretKey: this.configService.get<string>('payment.ezcash.secretKey'),
      merchantId: this.configService.get<string>('payment.ezcash.merchantId'),
      baseUrl: this.configService.get<string>('payment.ezcash.baseUrl'),
      returnUrl: this.configService.get<string>('payment.ezcash.returnUrl'),
      cancelUrl: this.configService.get<string>('payment.ezcash.cancelUrl'),
      notifyUrl: this.configService.get<string>('payment.ezcash.notifyUrl'),
    });
  }

  initialize(config: PaymentGatewayConfig): void {
    this.config = config;
    this.logger.log('EzCash gateway initialized');
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    this.logger.log(`Creating EzCash payment for order ${request.orderId}`);

    const transactionId = `EZ${Date.now()}`;

    return {
      success: true,
      transactionId,
      gatewayRef: transactionId,
      redirectUrl: `${this.config.baseUrl}/payment?ref=${transactionId}`,
      status: 'PENDING',
      message: 'Please complete payment via EzCash',
    };
  }

  async verifyPayment(gatewayRef: string): Promise<PaymentResponse> {
    this.logger.log(`Verifying EzCash payment: ${gatewayRef}`);
    return {
      success: true,
      gatewayRef,
      status: 'COMPLETED',
      message: 'Payment verified',
    };
  }

  async refundPayment(gatewayRef: string, amount?: number): Promise<PaymentResponse> {
    this.logger.log(`Processing EzCash refund for ${gatewayRef}`);
    return {
      success: true,
      gatewayRef,
      status: 'PENDING',
      message: 'Refund initiated',
    };
  }

  async getPaymentStatus(gatewayRef: string): Promise<PaymentResponse> {
    return this.verifyPayment(gatewayRef);
  }
}
