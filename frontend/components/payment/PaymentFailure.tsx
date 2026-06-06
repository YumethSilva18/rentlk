
'use client'




import React from 'react'
import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'

interface PaymentFailureProps {
  amount: number
  error?: string
  onRetry?: () => void
  onTryAnotherMethod?: () => void
  onContactSupport?: () => void
  className?: string
}

export function PaymentFailure({
  amount,
  error = 'Your payment could not be processed. Please try again.',
  onRetry,
  onTryAnotherMethod,
  onContactSupport,
  className,
}: PaymentFailureProps) {
  return (
    <Card className={cn('text-center', className)}>
      <CardContent className="pt-8 pb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
        <p className="text-muted-foreground mb-2">{error}</p>
        <p className="text-sm text-muted-foreground mb-6">
          Amount: <span className="font-medium">{formatCurrency(amount)}</span> was not charged.
        </p>

        <div className="space-y-3 max-w-xs mx-auto">
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={onTryAnotherMethod} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Choose Another Method
          </Button>
          <Button variant="ghost" onClick={onContactSupport} className="w-full">
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
