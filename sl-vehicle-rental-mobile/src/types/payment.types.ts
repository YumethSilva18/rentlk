// ============================================================================
// Payment Types - Ported from web frontend
// ============================================================================

export type PaymentMethod = 'payhere' | 'stripe' | 'ezcash' | 'wallet';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentMethodInfo {
  id: string;
  userId: string;
  type: PaymentMethod;
  isDefault: boolean;
  lastFour?: string;
  expiryDate?: string;
  cardBrand?: string;
  walletBalance?: number;
  createdAt: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  saveCard?: boolean;
  idempotencyKey?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
}

export interface PayHereCallback {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
  status_message: string;
  method?: string;
  card_no?: string;
  card_expiry?: string;
}
