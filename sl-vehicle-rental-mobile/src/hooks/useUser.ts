// ============================================================================
// useUser Hook
// ============================================================================

import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/user.store';
import type { UserProfile } from '@/types/user.types';

export const useUser = () => {
  const store = useUserStore();

  const refreshProfile = useCallback(() => {
    return store.fetchProfile();
  }, [store]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    return store.updateProfile(data);
  }, [store]);

  return {
    profile: store.profile,
    isLoading: store.isLoading,
    error: store.error,
    refreshProfile,
    updateProfile,
  };
};
