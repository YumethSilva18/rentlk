// ============================================================================
// Notification Store
// ============================================================================

import { create } from 'zustand';
import { notificationService } from '@/services/notification.service';
import type { Notification, UnreadCount } from '@/types/notification.types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: UnreadCount;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: { total: 0, byType: {} },
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await notificationService.list();
      set({ notifications: response.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed' });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const count = await notificationService.getUnreadCount();
      set({ unreadCount: count });
    } catch {
      // Non-critical
    }
  },

  markRead: async (id: string) => {
    await notificationService.markRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: { ...state.unreadCount, total: Math.max(0, state.unreadCount.total - 1) },
    }));
  },

  markAllRead: async () => {
    await notificationService.markAllRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: { total: 0, byType: {} },
    }));
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: { ...state.unreadCount, total: state.unreadCount.total + 1 },
    }));
  },
}));
