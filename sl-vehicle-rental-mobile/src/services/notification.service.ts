// ============================================================================
// Notification Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { Notification, NotificationPreferences, UnreadCount } from '@/types/notification.types';

class NotificationService {
  async list(params?: PaginationParams): Promise<PaginatedResponse<Notification>> {
    return api.get<PaginatedResponse<Notification>>(
      apiConfig.endpoints.notifications.list,
      { params }
    );
  }

  async markRead(id: string): Promise<void> {
    await api.post(apiConfig.endpoints.notifications.markRead(id));
  }

  async markAllRead(): Promise<void> {
    await api.post(apiConfig.endpoints.notifications.markAllRead);
  }

  async getUnreadCount(): Promise<UnreadCount> {
    const response = await api.get<ApiResponse<UnreadCount>>(
      apiConfig.endpoints.notifications.unread
    );
    return response.data!;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await api.get<ApiResponse<NotificationPreferences>>(
      apiConfig.endpoints.notifications.preferences
    );
    return response.data!;
  }

  async updatePreferences(prefs: Partial<NotificationPreferences>): Promise<void> {
    await api.put(apiConfig.endpoints.notifications.preferences, prefs);
  }
}

export const notificationService = new NotificationService();
