'use client'

import React from 'react'
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'

interface WalletBalanceProps {
  balance: number
  currency?: string
  pendingAmount?: number
  onTopUp?: () => void
  onViewHistory?: () => void
  isLoading?: boolean
  className?: string
}

export function WalletBalance({
  balance,
  currency = 'LKR',
  pendingAmount = 0,
  onTopUp,
  onViewHistory,
  isLoading = false,
  className,
}: WalletBalanceProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse space-y-3">
            <div className="h-10 w-32 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="flex gap-2">
              <div className="h-9 flex-1 bg-muted rounded" />
              <div className="h-9 flex-1 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(balance)}</p>
            <p className="text-xs text-muted-foreground mt-1">{currency}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>

        {pendingAmount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
            {formatCurrency(pendingAmount)} pending
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1" size="sm" onClick={onTopUp}>
            <Plus className="mr-1 h-4 w-4" />
            Top Up
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onViewHistory}>
            <History className="mr-1 h-4 w-4" />
            History
          </Button>
        </div>
      </div>
    </Card>
  )
}
