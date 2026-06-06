'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  onDismiss?: (id: string) => void
  duration?: number
}

export function Toast({ id, title, description, variant = 'default', onDismiss, duration = 5000 }: ToastProps) {
  React.useEffect(() => {
    if (duration > 0 && onDismiss) {
      const timer = setTimeout(() => onDismiss(id), duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all',
        {
          'bg-background text-foreground': variant === 'default',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
          'bg-success text-white': variant === 'success',
          'bg-warning text-white': variant === 'warning',
        }
      )}
    >
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      {onDismiss && (
        <button onClick={() => onDismiss(id)} className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
