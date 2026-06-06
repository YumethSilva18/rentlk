'use client'

import React from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  onDismiss?: () => void
  className?: string
}

const alertIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const alertStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-red-50 border-red-200 text-red-900',
}

const alertIconColors = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
}

export function Alert({ type = 'info', title, children, onDismiss, className }: AlertProps) {
  const Icon = alertIcons[type]

  return (
    <div className={cn('border rounded-lg p-4', alertStyles[type], className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', alertIconColors[type])} />
        <div className="flex-1">
          {title && <p className="text-sm font-medium mb-1">{title}</p>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {onDismiss && (
          <button className="shrink-0 opacity-60 hover:opacity-100" onClick={onDismiss}>
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
