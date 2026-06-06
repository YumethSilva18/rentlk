// ============================================================================
// Wallet Store
// ============================================================================

import { create } from 'zustand';
import { walletService } from '@/services/wallet.service';
import type { WalletBalance, WalletTransaction, Payout } from '@/types/wallet.types';

interface WalletState {
  balance: WalletBalance | null;
  transactions: WalletTransaction[];
  payouts: Payout[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchPayouts: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: null,
  transactions: [],
  payouts: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      const balance = await walletService.getBalance();
      set({ balance });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load balance' });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const response = await walletService.getTransactions();
      set({ transactions: response.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed' });
    }
  },

  fetchPayouts: async () => {
    set({ isLoading: true });
    try {
      const response = await walletService.getPayouts();
      set({ payouts: response.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed' });
    }
  },
}));
