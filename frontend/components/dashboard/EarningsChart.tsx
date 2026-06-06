'use client'

import React from 'react'
import { TrendingUp, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface EarningsData {
  month: string
  amount: number
  bookings: number
}

interface EarningsChartProps {
  data: EarningsData[]
  totalEarnings: number
  isLoading?: boolean
  className?: string
}

export function EarningsChart({ data, totalEarnings, isLoading = false, className }: EarningsChartProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="flex items-end gap-2 h-32">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-muted rounded-t"
                style={{ height: `${20 + Math.random() * 80}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxAmount = Math.max(...data.map((d) => d.amount), 1)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Earnings Overview</CardTitle>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold text-primary">{formatCurrency(totalEarnings)}</p>
          <p className="text-sm text-muted-foreground">Total earnings this year</p>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <TrendingUp className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No earnings data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-end gap-1 h-32">
              {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(item.amount)}
                  </span>
                  <div
                    className="w-full bg-primary/20 rounded-t hover:bg-primary/40 transition-colors cursor-pointer relative group"
                    style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.month}: {formatCurrency(item.amount)}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.month.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total Bookings</p>
                <p className="text-lg font-bold">
                  {data.reduce((sum, d) => sum + d.bookings, 0)}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Avg. per Booking</p>
                <p className="text-lg font-bold">
                  {formatCurrency(
                    data.reduce((sum, d) => sum + d.bookings, 0) > 0
                      ? totalEarnings / data.reduce((sum, d) => sum + d.bookings, 0)
                      : 0
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
