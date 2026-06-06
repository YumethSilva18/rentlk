// ============================================================================
// Wallet Types
// ============================================================================

export interface WalletBalance {
  available: number;
  pending: number;
  total: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  reference?: string;
  balance: number;
  createdAt: string;
}

export interface PayoutRequest {
  amount: number;
  method: PayoutMethod;
  bankAccount?: string;
  bankName?: string;
  accountHolder?: string;
  notes?: string;
  idempotencyKey: string;
}

export interface Payout {
  id: string;
  userId: string;
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
  bankAccount?: string;
  bankName?: string;
  accountHolder?: string;
  notes?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PayoutMethod = 'bank_transfer' | 'ezcash' | 'mobile_money';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
