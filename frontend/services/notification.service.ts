import { api } from './api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface Notification {
  id: string
  userId: string
  type: 'booking' | 'message' | 'payment' | 'kyc' | 'system' | 'review' | 'reminder'
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

export const notificationService = {
  getAll: (params?: { page?: number; pageSize?: number; isRead?: boolean }) =>
    api.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params }),

  getUnreadCount: () =>
    api.get<ApiResponse<{ total: number }>>('/notifications/unread-count'),

  markAsRead: (notificationId: string) =>
    api.put<ApiResponse<null>>(`/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    api.put<ApiResponse<null>>('/notifications/read-all'),

  delete: (notificationId: string) =>
    api.delete<ApiResponse<null>>(`/notifications/${notificationId}`),

  getPreferences: () =>
    api.get<ApiResponse<Record<string, boolean>>>('/notifications/preferences'),

  updatePreferences: (preferences: Record<string, boolean>) =>
    api.put<ApiResponse<null>>('/notifications/preferences', { preferences }),
}
