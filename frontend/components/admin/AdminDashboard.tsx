'use client'

import React from 'react'
import { Shield, Users, Car, CreditCard, AlertTriangle, TrendingUp, Activity, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatDateTime } from '@/lib/utils'
import { AdminStats } from './AdminStats'
import { ActivityLog } from './ActivityLog'
import { RevenueChart } from './RevenueChart'
import { AdminActions } from './AdminActions'
import type { AdminStats as AdminStatsType, MonthlyRevenue, AdminLogEntry, FraudAlert } from '@/types'

interface AdminDashboardProps {
  stats: AdminStatsType
  revenueData: MonthlyRevenue[]
  recentActivity: AdminLogEntry[]
  fraudAlerts: FraudAlert[]
  isLoading?: boolean
  className?: string
}

export function AdminDashboard({
  stats,
  revenueData,
  recentActivity,
  fraudAlerts,
  isLoading = false,
  className,
}: AdminDashboardProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <AdminStats
          totalUsers={0}
          totalVehicles={0}
          totalRevenue={0}
          pendingKYC={0}
          isLoading
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 animate-pulse">
                <div className="h-64 bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
          <ActivityLog entries={[]} isLoading />
        </div>
      </div>
    )
  }

  const statsAlerts = [
    { label: 'Active Bookings', value: stats.activeBookings, icon: Car, color: 'text-green-600 bg-green-100' },
    { label: 'Pending KYC', value: stats.pendingKYC, icon: Shield, color: 'text-orange-600 bg-orange-100' },
    { label: 'Fraud Alerts', value: stats.fraudAlerts, icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
    { label: 'Last Activity', value: recentActivity[0]?.action?.replace('_', ' ') || 'None', icon: Activity, color: 'text-blue-600 bg-blue-100', isText: true },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      <AdminStats
        totalUsers={stats.totalUsers}
        totalVehicles={stats.totalVehicles}
        totalRevenue={stats.totalRevenue}
        pendingKYC={stats.pendingKYC}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsAlerts.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', item.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold">{(item as any).isText ? item.value : (item.value as number).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart data={revenueData} />
        </div>
        <div className="space-y-6">
          <ActivityLog entries={recentActivity} />
          <AdminActions />
        </div>
      </div>
    </div>
  )
}
