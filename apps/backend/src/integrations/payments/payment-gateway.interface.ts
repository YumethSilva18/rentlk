export interface PaymentGatewayConfig {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  baseUrl: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  gatewayRef?: string;
  redirectUrl?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  message?: string;
  rawResponse?: any;
}

export interface PaymentGateway {
  initialize(config: PaymentGatewayConfig): void;
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(gatewayRef: string): Promise<PaymentResponse>;
  refundPayment(gatewayRef: string, amount?: number): Promise<PaymentResponse>;
  getPaymentStatus(gatewayRef: string): Promise<PaymentResponse>;
}

export interface WebhookPayload {
  gateway: string;
  event: string;
  data: Record<string, any>;
  signature: string;
  rawBody: string;
}
