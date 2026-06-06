'use client'

import React from 'react'
import { Users, Car, Banknote, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface AdminStat {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  description?: string
}

interface AdminStatsProps {
  totalUsers: number
  totalVehicles: number
  totalRevenue: number
  pendingKYC: number
  userChange?: number
  vehicleChange?: number
  revenueChange?: number
  isLoading?: boolean
  className?: string
}

export function AdminStats({
  totalUsers,
  totalVehicles,
  totalRevenue,
  pendingKYC,
  userChange,
  vehicleChange,
  revenueChange,
  isLoading = false,
  className,
}: AdminStatsProps) {
  const stats: AdminStat[] = [
    { title: 'Total Users', value: totalUsers.toLocaleString(), change: userChange, icon: Users },
    { title: 'Total Vehicles', value: totalVehicles.toLocaleString(), change: vehicleChange, icon: Car },
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), change: revenueChange, icon: Banknote },
    { title: 'Pending KYC', value: pendingKYC, icon: AlertTriangle, description: 'requires review' },
  ]

  if (isLoading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-8 w-16 bg-muted rounded" />
                </div>
                <div className="h-10 w-10 rounded-full bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  {stat.change !== undefined ? (
                    <div className="flex items-center gap-1 mt-1">
                      {stat.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={cn('text-xs', stat.change >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {stat.change >= 0 ? '+' : ''}{stat.change}%
                      </span>
                    </div>
                  ) : stat.description ? (
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  ) : null}
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', {
                  'bg-blue-100 text-blue-600': stat.title === 'Total Users',
                  'bg-green-100 text-green-600': stat.title === 'Total Vehicles',
                  'bg-purple-100 text-purple-600': stat.title === 'Total Revenue',
                  'bg-orange-100 text-orange-600': stat.title === 'Pending KYC',
                })}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
