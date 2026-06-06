// ============================================================================
// useAuth Hook
// ============================================================================

import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import type { LoginRequest, RegisterRequest } from '@/types/api.types';

export const useAuth = () => {
  const store = useAuthStore();

  const login = useCallback(async (data: LoginRequest) => {
    return store.login(data);
  }, [store]);

  const register = useCallback(async (data: RegisterRequest) => {
    return store.register(data);
  }, [store]);

  const logout = useCallback(async () => {
    return store.logout();
  }, [store]);

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    error: store.error,
    login,
    register,
    logout,
    clearError: store.clearError,
    isAdmin: store.user?.role === 'admin',
  };
};
