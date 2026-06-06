'use client'

import React from 'react'
import { Clock, User, Car, CreditCard, Shield, FileText, Edit, Trash2, CheckCircle, XCircle, LogIn, Settings, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatDateTime } from '@/lib/utils'
import type { AdminLogEntry } from '@/types'

interface ActivityLogProps {
  entries: AdminLogEntry[]
  isLoading?: boolean
  className?: string
}

const actionIcons: Record<string, React.ElementType> = {
  user_create: User,
  user_suspend: User,
  user_delete: Trash2,
  user_edit: Edit,
  vehicle_approve: Car,
  vehicle_suspend: Car,
  kyc_approve: Shield,
  kyc_reject: XCircle,
  booking_cancel: XCircle,
  payment_refund: CreditCard,
  login: LogIn,
  settings_change: Settings,
  report_generate: FileText,
}

const actionColors: Record<string, string> = {
  user_create: 'text-green-600 bg-green-100',
  user_suspend: 'text-red-600 bg-red-100',
  user_delete: 'text-red-600 bg-red-100',
  user_edit: 'text-blue-600 bg-blue-100',
  vehicle_approve: 'text-green-600 bg-green-100',
  vehicle_suspend: 'text-red-600 bg-red-100',
  kyc_approve: 'text-green-600 bg-green-100',
  kyc_reject: 'text-red-600 bg-red-100',
  booking_cancel: 'text-orange-600 bg-orange-100',
  payment_refund: 'text-purple-600 bg-purple-100',
  login: 'text-blue-600 bg-blue-100',
  settings_change: 'text-gray-600 bg-gray-100',
  report_generate: 'text-indigo-600 bg-indigo-100',
}

export function ActivityLog({ entries, isLoading = false, className }: ActivityLogProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>Activity Log</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
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
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <ScrollArea className="h-[480px]">
            <div className="space-y-0">
              {entries.map((entry, index) => {
                const Icon = actionIcons[entry.action] || FileText
                const colorClass = actionColors[entry.action] || 'text-gray-600 bg-gray-100'

                return (
                  <div key={entry.id}>
                    <div className="flex gap-3 py-3">
                      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', colorClass)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{entry.adminName}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                            {entry.action.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {entry.target}: {entry.targetId.slice(0, 8)}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formatDateTime(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                    {index < entries.length - 1 && <div className="border-b ml-11" />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
