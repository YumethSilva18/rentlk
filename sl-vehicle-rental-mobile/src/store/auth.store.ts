// ============================================================================
// Auth Store - Authentication state with secure token management
// ============================================================================

import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { StorageUtils, StorageKeys } from '@/utils/storage';
import { webSocketService } from '@/services/websocket.service';
import { pushNotificationService } from '@/services/push-notification.service';
import type { User, UserProfile } from '@/types/user.types';
import type { LoginRequest, RegisterRequest } from '@/types/api.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        const user = await authService.getMe();
        set({ user, isAuthenticated: true, isInitialized: true });

        // Connect real-time services
        await webSocketService.connect();
        await pushNotificationService.initialize();
      } else {
        set({ user: null, isAuthenticated: false, isInitialized: true });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        phone: '',
        kycStatus: response.user.kycStatus as User['kycStatus'],
        isVerified: false,
        role: response.user.role as User['role'],
        joinedAt: new Date().toISOString(),
      };

      // Cache user profile in MMKV
      StorageUtils.setObject(StorageKeys.USER_PROFILE, user);

      set({ user, isAuthenticated: true, isLoading: false, error: null });

      // Connect real-time services
      await webSocketService.connect();
      await pushNotificationService.initialize();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        phone: '',
        kycStatus: 'not_started',
        isVerified: false,
        role: response.user.role as User['role'],
        joinedAt: new Date().toISOString(),
      };

      StorageUtils.setObject(StorageKeys.USER_PROFILE, user);
      set({ user, isAuthenticated: true, isLoading: false, error: null });

      await webSocketService.connect();
      await pushNotificationService.initialize();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    webSocketService.disconnect();
    await pushNotificationService.unregister();
    await authService.logout();
    StorageUtils.clear();
    set({ user: null, isAuthenticated: false, error: null });
  },

  setUser: (user: User) => {
    StorageUtils.setObject(StorageKeys.USER_PROFILE, user);
    set({ user });
  },

  updateUser: (updates: Partial<User>) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...updates };
      StorageUtils.setObject(StorageKeys.USER_PROFILE, updated);
      set({ user: updated });
    }
  },

  clearError: () => set({ error: null }),
}));
