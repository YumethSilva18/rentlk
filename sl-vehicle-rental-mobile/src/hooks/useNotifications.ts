// ============================================================================
// useNotifications Hook
// ============================================================================

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notification.store';
import { webSocketService } from '@/services/websocket.service';
import type { Notification } from '@/types/notification.types';

export const useNotifications = () => {
  const store = useNotificationStore();

  useEffect(() => {
    const unsub = webSocketService.onNotification((notification: Notification) => {
      store.addNotification(notification);
    });
    return unsub;
  }, [store]);

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    isLoading: store.isLoading,
    fetchNotifications: store.fetchNotifications,
    fetchUnreadCount: store.fetchUnreadCount,
    markRead: store.markRead,
    markAllRead: store.markAllRead,
  };
};
