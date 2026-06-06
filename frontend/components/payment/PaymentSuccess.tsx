'use client'

import React from 'react'
import { CheckCircle, ArrowRight, Download, Share2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatDateTime } from '@/lib/utils'

interface PaymentSuccessProps {
  transactionId: string
  bookingId: string
  amount: number
  method: string
  date?: string
  onViewBooking?: () => void
  onDownloadReceipt?: () => void
  className?: string
}

export function PaymentSuccess({
  transactionId,
  bookingId,
  amount,
  method,
  date,
  onViewBooking,
  onDownloadReceipt,
  className,
}: PaymentSuccessProps) {
  return (
    <Card className={cn('text-center', className)}>
      <CardContent className="pt-8 pb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Your payment has been processed successfully.
        </p>

        <div className="mx-auto max-w-xs rounded-lg bg-muted/50 p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Amount Paid</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Method</span>
            <Badge variant="secondary">{method}</Badge>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Transaction ID</span>
            <span className="text-xs font-mono">{transactionId.slice(0, 12)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Booking ID</span>
            <span className="text-xs font-mono">#{bookingId.slice(0, 8)}</span>
          </div>
          {date && (
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-xs">{formatDateTime(date)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onViewBooking}>
            View Booking
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onDownloadReceipt}>
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
