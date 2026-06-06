'use client'

import { useNotificationStore } from '@/store'
import { notificationService } from '@/services/notification.service'
import { useCallback } from 'react'
import type { AppNotification } from '@/store/notification.store'

export function useNotifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    setUnreadCount,
    setLoading,
    setError,
  } = useNotificationStore()

  const fetchNotifications = useCallback(
    async (params?: { page?: number; pageSize?: number; isRead?: boolean }) => {
      setLoading(true)
      try {
        const response = await notificationService.getAll(params)
        const data = response.data.data
        if (data) {
          setNotifications(data.data as AppNotification[])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setNotifications, setError]
  )

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.data.data?.total ?? 0)
    } catch {
      // silently fail
    }
  }, [setUnreadCount])

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await notificationService.markAsRead(id)
        markAsRead(id)
      } catch {
        // silently fail
      }
    },
    [markAsRead]
  )

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      markAllAsRead()
    } catch {
      // silently fail
    }
  }, [markAllAsRead])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    removeNotification,
  }
}
