'use client'

import React from 'react'
import { DollarSign, Car, Star, Users, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  change?: number
  changeLabel?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantStyles: Record<string, { bg: string; iconBg: string; iconColor: string }> = {
  default: { bg: '', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  success: { bg: '', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  warning: { bg: '', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  danger: { bg: '', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  variant = 'default',
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {change >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {change >= 0 ? '+' : ''}
                  {change}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', styles.iconBg)}>
            <Icon className={cn('h-6 w-6', styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  totalBookings: number
  totalEarnings: number
  totalVehicles: number
  averageRating: number
  bookingChange?: number
  earningsChange?: number
  vehiclesChange?: number
  ratingChange?: number
  isLoading?: boolean
  className?: string
}

export function DashboardStats({
  totalBookings,
  totalEarnings,
  totalVehicles,
  averageRating,
  bookingChange,
  earningsChange,
  vehiclesChange,
  ratingChange,
  isLoading = false,
  className,
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-8 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
                <div className="h-12 w-12 rounded-full bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings.toLocaleString(),
      icon: Car,
      change: bookingChange,
      changeLabel: 'vs last month',
      variant: 'default' as const,
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(totalEarnings),
      icon: DollarSign,
      change: earningsChange,
      changeLabel: 'vs last month',
      variant: 'success' as const,
    },
    {
      title: 'Vehicles Listed',
      value: totalVehicles.toLocaleString(),
      icon: Users,
      change: vehiclesChange,
      changeLabel: 'vs last month',
      variant: 'warning' as const,
    },
    {
      title: 'Avg. Rating',
      value: `${averageRating.toFixed(1)} ⭐`,
      icon: Star,
      change: ratingChange,
      changeLabel: 'vs last month',
      variant: 'default' as const,
    },
  ]

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
