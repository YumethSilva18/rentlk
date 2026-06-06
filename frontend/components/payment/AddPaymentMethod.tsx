'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Wallet, Smartphone, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import type { PaymentMethod } from '@/types'

const addPaymentSchema = z.object({
  type: z.enum(['payhere', 'stripe', 'ezcash']),
  cardNumber: z.string().min(13, 'Card number is too short').max(19).optional(),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Use MM/YY format').optional(),
  cvv: z.string().min(3).max(4).optional(),
  cardholderName: z.string().optional(),
  phoneNumber: z.string().optional(),
  isDefault: z.boolean().optional(),
})

type AddPaymentFormValues = z.infer<typeof addPaymentSchema>

interface AddPaymentMethodProps {
  onAdd: (data: AddPaymentFormValues) => void
  onCancel: () => void
  isProcessing?: boolean
  className?: string
}

export function AddPaymentMethod({ onAdd, onCancel, isProcessing = false, className }: AddPaymentMethodProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddPaymentFormValues>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: { type: 'payhere' },
  })

  const selectedType = watch('type')
  const isCard = selectedType === 'payhere' || selectedType === 'stripe'

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Add Payment Method</CardTitle>
          <CardDescription>Enter your payment details below.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <RadioGroup
              value={selectedType}
              onValueChange={(v) => setValue('type', v as 'payhere' | 'stripe' | 'ezcash')}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { value: 'payhere' as const, label: 'PayHere', icon: CreditCard },
                { value: 'stripe' as const, label: 'Stripe', icon: CreditCard },
                { value: 'ezcash' as const, label: 'EZ Cash', icon: Smartphone },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent ${
                    selectedType === opt.value ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <RadioGroupItem value={opt.value} className="sr-only" />
                  <opt.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {isCard && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input id="cardholderName" placeholder="John Doe" {...register('cardholderName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  {...register('cardNumber')}
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-xs text-destructive">{errors.cardNumber.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" {...register('expiry')} maxLength={5} />
                  {errors.expiry && (
                    <p className="text-xs text-destructive">{errors.expiry.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" type="password" placeholder="123" {...register('cvv')} maxLength={4} />
                  {errors.cvv && (
                    <p className="text-xs text-destructive">{errors.cvv.message}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {selectedType === 'ezcash' && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">EZ Cash Mobile Number</Label>
              <Input id="phoneNumber" placeholder="077 123 4567" {...register('phoneNumber')} />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox id="isDefault" {...register('isDefault')} />
            <Label htmlFor="isDefault" className="text-sm cursor-pointer">
              Set as default payment method
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={isProcessing}>
              {isProcessing ? 'Adding...' : 'Add Method'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
