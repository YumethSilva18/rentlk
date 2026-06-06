'use client'

import React from 'react'
import { ArrowDownRight, ArrowUpRight, Filter, Download, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatDateTime } from '@/lib/utils'
import type { PaymentTransaction, WalletTransaction } from '@/types'

interface PaymentHistoryProps {
  transactions: (PaymentTransaction | WalletTransaction)[]
  onFilter?: () => void
  onDownload?: () => void
  onViewDetails?: (id: string) => void
  isLoading?: boolean
  className?: string
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  processing: 'default',
  completed: 'success',
  failed: 'destructive',
  refunded: 'secondary',
  credit: 'success',
  debit: 'default',
}

export function PaymentHistory({
  transactions,
  onFilter,
  onDownload,
  onViewDetails,
  isLoading = false,
  className,
}: PaymentHistoryProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment History</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onFilter}>
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isPayment = 'status' in tx
              const isDebit = 'type' in tx && tx.type === 'debit'
              const status = isPayment
                ? (tx as PaymentTransaction).status
                : (tx as WalletTransaction).type

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onViewDetails?.(tx.id)}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      isDebit ? 'bg-red-100' : 'bg-green-100'
                    )}
                  >
                    {isDebit ? (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-green-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(tx.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        isDebit ? 'text-red-600' : 'text-green-600'
                      )}
                    >
                      {isDebit ? '-' : '+'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <Badge
                      variant={statusVariants[status] || 'default'}
                      className="text-xs mt-1"
                    >
                      {status}
                    </Badge>
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
