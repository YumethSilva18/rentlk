// ============================================================================
// Wallet Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { WalletBalance, WalletTransaction, PayoutRequest, Payout } from '@/types/wallet.types';

class WalletService {
  async getBalance(): Promise<WalletBalance> {
    const response = await api.get<ApiResponse<WalletBalance>>(apiConfig.endpoints.wallet.balance);
    return response.data!;
  }

  async getTransactions(params?: PaginationParams): Promise<PaginatedResponse<WalletTransaction>> {
    return api.get<PaginatedResponse<WalletTransaction>>(
      apiConfig.endpoints.wallet.transactions,
      { params }
    );
  }

  async getLedger(params?: PaginationParams): Promise<PaginatedResponse<WalletTransaction>> {
    return api.get<PaginatedResponse<WalletTransaction>>(
      apiConfig.endpoints.wallet.ledger,
      { params }
    );
  }

  async deposit(data: { amount: number; method: string }): Promise<WalletTransaction> {
    const response = await api.post<ApiResponse<WalletTransaction>>(
      apiConfig.endpoints.wallet.deposit,
      data
    );
    return response.data!;
  }

  // Payouts
  async getPayouts(params?: PaginationParams): Promise<PaginatedResponse<Payout>> {
    return api.get<PaginatedResponse<Payout>>(apiConfig.endpoints.payouts.list, { params });
  }

  async createPayout(data: PayoutRequest): Promise<Payout> {
    const response = await api.post<ApiResponse<Payout>>(apiConfig.endpoints.payouts.create, data);
    return response.data!;
  }

  async getPayoutDetail(id: string): Promise<Payout> {
    const response = await api.get<ApiResponse<Payout>>(apiConfig.endpoints.payouts.detail(id));
    return response.data!;
  }

  async cancelPayout(id: string): Promise<void> {
    await api.post(apiConfig.endpoints.payouts.cancel(id));
  }
}

export const walletService = new WalletService();
