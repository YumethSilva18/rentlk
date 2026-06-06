// Payment method types
export type PaymentMethod = 'payhere' | 'stripe' | 'ezcash' | 'wallet'

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface PaymentTransaction {
  id: string
  bookingId: string
  userId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  description: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

export interface PaymentMethodInfo {
  id: string
  userId: string
  type: PaymentMethod
  isDefault: boolean
  lastFour?: string
  expiryDate?: string
  cardBrand?: string
  walletBalance?: number
  createdAt: string
}

export interface WalletTransaction {
  id: string
  userId: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  reference?: string
  balance: number
  createdAt: string
}

export interface PaymentRequest {
  bookingId: string
  amount: number
  method: PaymentMethod
  saveCard?: boolean
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  redirectUrl?: string
  error?: string
}
