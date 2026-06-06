import { api } from './api'
import type { ApiResponse, PaymentMethodInfo, PaymentTransaction, WalletTransaction } from '@/types'

export const paymentService = {
  getPaymentMethods: () =>
    api.get<ApiResponse<PaymentMethodInfo[]>>('/payments/methods'),

  addPaymentMethod: (data: { type: string; cardDetails?: Record<string, string> }) =>
    api.post<ApiResponse<PaymentMethodInfo>>('/payments/methods', data),

  removePaymentMethod: (id: string) =>
    api.delete<ApiResponse<null>>(`/payments/methods/${id}`),

  setDefaultMethod: (id: string) =>
    api.put<ApiResponse<null>>(`/payments/methods/${id}/default`),

  createTransaction: (data: { bookingId: string; amount: number; method: string }) =>
    api.post<ApiResponse<PaymentTransaction>>('/payments/transactions', data),

  getTransactionHistory: (params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaymentTransaction[]>>('/payments/transactions', { params }),

  getTransaction: (id: string) =>
    api.get<ApiResponse<PaymentTransaction>>(`/payments/transactions/${id}`),

  // Wallet
  getWalletBalance: () =>
    api.get<ApiResponse<{ balance: number; currency: string }>>('/payments/wallet/balance'),

  getWalletTransactions: (params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<WalletTransaction[]>>('/payments/wallet/transactions', { params }),

  addFundsToWallet: (amount: number, method: string) =>
    api.post<ApiResponse<PaymentTransaction>>('/payments/wallet/add-funds', { amount, method }),

  withdrawFunds: (amount: number, bankDetails: Record<string, string>) =>
    api.post<ApiResponse<PaymentTransaction>>('/payments/wallet/withdraw', { amount, bankDetails }),
}
