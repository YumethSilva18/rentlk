'use client'

import React, { useState } from 'react'
import { CreditCard, Building2, Lock, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'

interface StripePaymentProps {
  amount: number
  onPay: (data: { cardNumber: string; expiry: string; cvc: string; name: string }) => void
  isProcessing?: boolean
  className?: string
}

export function StripePayment({ amount, onPay, isProcessing = false, className }: StripePaymentProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPay({ cardNumber, expiry, cvc, name })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <CardTitle>Stripe Payment</CardTitle>
        </div>
        <CardDescription>Pay with international cards via Stripe. Secure and fast.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeCardNumber">Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="stripeCardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="pl-9"
                maxLength={19}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripeExpiry">Expiry</Label>
              <Input
                id="stripeExpiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripeCvc">CVC</Label>
              <Input
                id="stripeCvc"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                maxLength={4}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount)} via Stripe`}
          </Button>

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>Powered by Stripe · International payments supported</span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
