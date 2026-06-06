import { create } from 'zustand'
import type { User, UserProfile } from '@/types'

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null

  // Actions
  setProfile: (profile: UserProfile | null) => void
  updateProfile: (data: Partial<UserProfile>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clear: () => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile }),

  updateProfile: (data) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clear: () => set({ profile: null, error: null }),
}))
