'use client'

import React, { useState } from 'react'
import { CreditCard, Lock, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/utils'

interface PayHerePaymentProps {
  amount: number
  onPay: (data: { cardNumber: string; expiry: string; cvv: string; saveCard: boolean }) => void
  isProcessing?: boolean
  className?: string
}

export function PayHerePayment({ amount, onPay, isProcessing = false, className }: PayHerePaymentProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [saveCard, setSaveCard] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPay({ cardNumber, expiry, cvv, saveCard })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          <CardTitle>PayHere Payment</CardTitle>
        </div>
        <CardDescription>Secure payment via PayHere. Your card details are encrypted.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="pl-9"
                maxLength={19}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="pl-9"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="saveCard"
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked === true)}
            />
            <Label htmlFor="saveCard" className="text-sm cursor-pointer">
              Save card for future payments
            </Label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount)} via PayHere`}
          </Button>

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Secured by PayHere SSL encryption</span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
