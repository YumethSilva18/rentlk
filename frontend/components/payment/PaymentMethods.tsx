'use client'

import React, { useState } from 'react'
import { CreditCard, Wallet, Smartphone, Plus, MoreVertical, Star, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatCurrency } from '@/lib/utils'
import type { PaymentMethodInfo } from '@/types'

interface PaymentMethodsProps {
  methods: PaymentMethodInfo[]
  onSetDefault?: (id: string) => void
  onRemove?: (id: string) => void
  onAdd?: () => void
  className?: string
}

const methodIcons: Record<string, React.ElementType> = {
  payhere: CreditCard,
  stripe: CreditCard,
  ezcash: Smartphone,
  wallet: Wallet,
}

const methodLabels: Record<string, string> = {
  payhere: 'PayHere',
  stripe: 'Stripe',
  ezcash: 'EZ Cash',
  wallet: 'Wallet',
}

export function PaymentMethods({ methods, onSetDefault, onRemove, onAdd, className }: PaymentMethodsProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Methods</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add New
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {methods.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <CreditCard className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No payment methods saved</p>
            <Button variant="link" size="sm" onClick={onAdd} className="mt-1">
              Add your first payment method
            </Button>
          </div>
        ) : (
          methods.map((method) => {
            const Icon = methodIcons[method.type] || CreditCard
            return (
              <div
                key={method.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3',
                  method.isDefault && 'border-primary bg-primary/5'
                )}
              >
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{methodLabels[method.type] || method.type}</p>
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {method.type === 'wallet'
                      ? `Balance: ${formatCurrency(method.walletBalance || 0)}`
                      : method.lastFour
                        ? `${method.cardBrand || 'Card'} ****${method.lastFour}`
                        : 'No card details'}
                    {method.expiryDate && ` · Expires ${method.expiryDate}`}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!method.isDefault && (
                      <DropdownMenuItem onClick={() => onSetDefault?.(method.id)}>
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onRemove?.(method.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
