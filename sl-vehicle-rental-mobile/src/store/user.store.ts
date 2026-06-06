// ============================================================================
// User Store
// ============================================================================

import { create } from 'zustand';
import { userService } from '@/services/user.service';
import type { UserProfile } from '@/types/user.types';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userService.getProfile();
      set({ profile, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load profile' });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userService.updateProfile(data);
      set({ profile, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to update profile' });
      throw err;
    }
  },

  clearProfile: () => set({ profile: null }),
}));
