'use client'

import React from 'react'
import { PlusCircle, Car, MessageSquare, CreditCard, Settings, Star, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  variant?: 'default' | 'outline' | 'secondary'
  onClick?: () => void
  href?: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
  className?: string
}

const defaultActions: QuickAction[] = [
  { id: 'add-vehicle', label: 'Add Vehicle', icon: PlusCircle, variant: 'default' },
  { id: 'my-vehicles', label: 'My Vehicles', icon: Car, variant: 'outline' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, variant: 'outline' },
  { id: 'payments', label: 'Payments', icon: CreditCard, variant: 'outline' },
  { id: 'reviews', label: 'Reviews', icon: Star, variant: 'outline' },
  { id: 'settings', label: 'Settings', icon: Settings, variant: 'outline' },
]

export function QuickActions({ actions, className }: QuickActionsProps) {
  const displayActions = actions || defaultActions

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {displayActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                className="h-auto flex-col gap-2 py-4"
                onClick={action.onClick}
                asChild={!!action.href}
              >
                {action.href ? (
                  <a href={action.href}>
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </a>
                ) : (
                  <>
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
