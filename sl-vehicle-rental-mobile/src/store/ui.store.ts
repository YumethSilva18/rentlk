// ============================================================================
// UI Store - Global UI state (toasts, modals, loading)
// ============================================================================

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UIState {
  isLoading: boolean;
  loadingMessage: string | null;
  toasts: Toast[];
  bottomSheetVisible: boolean;

  setLoading: (loading: boolean, message?: string) => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
  setBottomSheetVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  loadingMessage: null,
  toasts: [],
  bottomSheetVisible: false,

  setLoading: (loading, message) => {
    set({ isLoading: loading, loadingMessage: message || null });
  },

  showToast: (message, type = 'info', duration = 3000) => {
    const id = `toast_${Date.now()}`;
    const toast: Toast = { id, message, type, duration };
    set((state) => ({ toasts: [...state.toasts, toast] }));

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  setBottomSheetVisible: (visible) => set({ bottomSheetVisible: visible }),
}));
