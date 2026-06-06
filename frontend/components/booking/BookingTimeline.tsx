'use client'

import React from 'react'
import { CheckCircle, Circle, Clock } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'

interface TimelineStep {
  label: string
  description: string
  timestamp?: string
  status: 'completed' | 'active' | 'pending'
  icon?: React.ElementType
}

interface BookingTimelineProps {
  steps: TimelineStep[]
  className?: string
}

const defaultIcons: Record<string, React.ElementType> = {
  completed: CheckCircle,
  active: Clock,
  pending: Circle,
}

export function BookingTimeline({ steps, className }: BookingTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {steps.map((step, i) => {
        const Icon = step.icon || defaultIcons[step.status]
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2',
                  step.status === 'completed' && 'border-green-500 bg-green-500 text-white',
                  step.status === 'active' && 'border-primary bg-primary text-primary-foreground',
                  step.status === 'pending' && 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {step.status === 'active' ? (
                  <Icon className="h-4 w-4 animate-pulse" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'h-full min-h-[24px] w-0.5',
                    step.status === 'completed' ? 'bg-green-500' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
            <div className={cn('pb-4', step.status === 'pending' && 'opacity-50')}>
              <p className="font-medium text-sm">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              {step.timestamp && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDateTime(step.timestamp)}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
