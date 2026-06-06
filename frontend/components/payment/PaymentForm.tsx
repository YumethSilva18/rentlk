'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Wallet, Smartphone, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '@/lib/utils'
import type { PaymentMethod } from '@/types'

const paymentSchema = z.object({
  method: z.enum(['payhere', 'stripe', 'ezcash', 'wallet']),
  saveCard: z.boolean().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  amount: number
  bookingId: string
  walletBalance?: number
  onSubmit: (data: PaymentFormValues) => void
  isProcessing?: boolean
  className?: string
}

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'payhere', label: 'PayHere', icon: CreditCard, description: 'Pay with credit/debit card via PayHere' },
  { value: 'stripe', label: 'Stripe', icon: Building2, description: 'Pay with international cards via Stripe' },
  { value: 'ezcash', label: 'EZ Cash', icon: Smartphone, description: 'Pay with your mobile wallet' },
  { value: 'wallet', label: 'Wallet', icon: Wallet, description: 'Pay with your rental wallet balance' },
]

export function PaymentForm({ amount, bookingId, walletBalance = 0, onSubmit, isProcessing = false, className }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: walletBalance >= amount ? 'wallet' : 'payhere' },
  })

  const selectedMethod = watch('method')

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <p className="text-sm text-muted-foreground">Booking #{bookingId.slice(0, 8)}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(amount)}</span>
            </div>
            {walletBalance > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Wallet balance: {formatCurrency(walletBalance)}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Select Payment Method</Label>
            <RadioGroup
              value={selectedMethod}
              onValueChange={(v) => setValue('method', v as PaymentMethod)}
              className="grid gap-2"
            >
              {paymentMethods.map((pm) => {
                const Icon = pm.icon
                const isDisabled = pm.value === 'wallet' && walletBalance < amount
                return (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent ${
                      selectedMethod === pm.value ? 'border-primary bg-primary/5' : ''
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <RadioGroupItem value={pm.value} disabled={isDisabled} />
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pm.label}</p>
                      <p className="text-xs text-muted-foreground">{pm.description}</p>
                    </div>
                    {isDisabled && (
                      <span className="text-xs text-destructive">Insufficient balance</span>
                    )}
                  </label>
                )
              })}
            </RadioGroup>
            {errors.method && (
              <p className="text-xs text-destructive">{errors.method.message}</p>
            )}
          </div>

          <input type="hidden" {...register('method')} />

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>Pay {formatCurrency(amount)}</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
