'use client'

import React from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatDateTime } from '@/lib/utils'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'payment' | 'message' | 'system'
  read: boolean
  createdAt: string
  link?: string
}

interface NotificationBellProps {
  unreadCount?: number
  onClick?: () => void
  className?: string
}

export function NotificationBell({ unreadCount = 0, onClick, className }: NotificationBellProps) {
  return (
    <Button variant="ghost" size="icon" className={cn('relative h-9 w-9', className)} onClick={onClick} aria-label="Notifications">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  )
}

const notificationTypeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  error: 'bg-red-100 text-red-600',
  booking: 'bg-purple-100 text-purple-600',
  payment: 'bg-indigo-100 text-indigo-600',
  message: 'bg-teal-100 text-teal-600',
  system: 'bg-gray-100 text-gray-600',
}

interface NotificationDropdownProps {
  notifications: NotificationItem[]
  onMarkAsRead?: (id: string) => void
  onMarkAllRead?: () => void
  onNotificationClick?: (notification: NotificationItem) => void
  isLoading?: boolean
  className?: string
}

export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onNotificationClick,
  isLoading = false,
  className,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  if (isLoading) {
    return (
      <div className={cn('w-80 bg-popover border rounded-lg shadow-lg p-4', className)}>
        <div className="animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-80 bg-popover border rounded-lg shadow-lg', className)}>
      <div className="flex items-center justify-between p-3 border-b">
        <h4 className="font-semibold text-sm">Notifications</h4>
        {unreadCount > 0 && onMarkAllRead && (
          <button className="text-xs text-primary hover:underline" onClick={onMarkAllRead}>
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground opacity-50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              className={cn(
                'w-full text-left p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0',
                !notification.read && 'bg-muted/20'
              )}
              onClick={() => {
                onNotificationClick?.(notification)
                if (!notification.read) onMarkAsRead?.(notification.id)
              }}
            >
              <div className="flex gap-3">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', notificationTypeColors[notification.type] || notificationTypeColors.info)}>
                  <span className="text-[10px] font-bold uppercase">{notification.type.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{notification.title}</p>
                    {!notification.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatDateTime(notification.createdAt)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
