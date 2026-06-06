'use client'

import React, { useState } from 'react'
import { Smartphone, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'

interface EZCashPaymentProps {
  amount: number
  onPay: (data: { phoneNumber: string; pin: string }) => void
  isProcessing?: boolean
  className?: string
}

export function EZCashPayment({ amount, onPay, isProcessing = false, className }: EZCashPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPay({ phoneNumber, pin })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-orange-500" />
          <CardTitle>EZ Cash Payment</CardTitle>
        </div>
        <CardDescription>Pay with your EZ Cash mobile wallet. Fast and convenient.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ezPhone">Mobile Number</Label>
            <Input
              id="ezPhone"
              placeholder="077 123 4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ezPin">EZ Cash PIN</Label>
            <Input
              id="ezPin"
              type="password"
              placeholder="Enter your 5-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={5}
            />
            <p className="text-xs text-muted-foreground">
              You will receive a confirmation SMS after payment.
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount)} via EZ Cash`}
          </Button>

          <div className="rounded-lg bg-orange-50 p-3 text-xs text-orange-700">
            <p className="font-medium mb-1">How to pay with EZ Cash:</p>
            <ol className="list-decimal pl-4 space-y-0.5">
              <li>Enter your EZ Cash registered mobile number</li>
              <li>Enter your 5-digit EZ Cash PIN</li>
              <li>You will receive an SMS to confirm the payment</li>
            </ol>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
