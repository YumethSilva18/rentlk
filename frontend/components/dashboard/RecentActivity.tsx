'use client'

import React from 'react'
import { Clock, CheckCircle, XCircle, MessageSquare, Star, Car } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatDateTime } from '@/lib/utils'

interface Activity {
  id: string
  type: 'booking' | 'payment' | 'review' | 'message' | 'vehicle' | 'kyc'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'warning' | 'error' | 'info'
}

interface RecentActivityProps {
  activities: Activity[]
  isLoading?: boolean
  className?: string
}

const activityIcons: Record<string, React.ElementType> = {
  booking: Car,
  payment: CheckCircle,
  review: Star,
  message: MessageSquare,
  vehicle: Car,
  kyc: CheckCircle,
}

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-600',
  warning: 'bg-orange-100 text-orange-600',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
}

export function RecentActivity({ activities, isLoading = false, className }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Clock className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type] || Clock
              return (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      activity.status ? statusColors[activity.status] : 'bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
