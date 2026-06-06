'use client'

import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import type { MonthlyRevenue } from '@/types'

interface RevenueChartProps {
  data: MonthlyRevenue[]
  isLoading?: boolean
  className?: string
}

export function RevenueChart({ data, isLoading = false, className }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-64 bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="text-sm text-muted-foreground">No revenue data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalCommission = data.reduce((sum, d) => sum + d.commission, 0)
  const totalBookings = data.reduce((sum, d) => sum + d.bookings, 0)
  const lastMonth = data[data.length - 1]
  const prevMonth = data[data.length - 2]
  const revenueChange = prevMonth ? ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100 : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Monthly</Button>
            <Button variant="ghost" size="sm">Yearly</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" /> Revenue
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalRevenue)}</p>
            {revenueChange !== 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                {revenueChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn('text-xs', revenueChange > 0 ? 'text-green-600' : 'text-red-600')}>
                  {revenueChange > 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" /> Commission
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalCommission)}</p>
          </div>
          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <BarChart3 className="h-3 w-3" /> Bookings
            </div>
            <p className="text-lg font-bold">{totalBookings.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-end gap-[2px] h-48">
            {data.map((item, i) => {
              const heightPct = (item.revenue / maxRevenue) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div className="w-full bg-muted rounded-t opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium whitespace-nowrap z-10">
                    {formatCurrency(item.revenue)}
                  </div>
                  <div
                    className={cn('w-full rounded-t transition-all cursor-pointer', {
                      'bg-blue-500 hover:bg-blue-600': true,
                    })}
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                    title={`${item.month}: ${formatCurrency(item.revenue)}`}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex items-center pt-2">
            {data.map((item, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[10px] text-muted-foreground">{item.month.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
