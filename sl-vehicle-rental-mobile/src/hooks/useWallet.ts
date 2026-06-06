// ============================================================================
// useWallet Hook
// ============================================================================

import { useCallback } from 'react';
import { useWalletStore } from '@/store/wallet.store';
import { walletService } from '@/services/wallet.service';
import type { PayoutRequest } from '@/types/wallet.types';

export const useWallet = () => {
  const store = useWalletStore();

  const createPayout = useCallback(async (data: PayoutRequest) => {
    return walletService.createPayout(data);
  }, []);

  return {
    balance: store.balance,
    transactions: store.transactions,
    payouts: store.payouts,
    isLoading: store.isLoading,
    error: store.error,
    fetchBalance: store.fetchBalance,
    fetchTransactions: store.fetchTransactions,
    fetchPayouts: store.fetchPayouts,
    createPayout,
  };
};
