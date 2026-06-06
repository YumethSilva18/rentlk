'use client'

import React from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  id: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  onDismiss?: (id: string) => void
  duration?: number
  className?: string
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastColors = {
  success: 'border-green-500 bg-green-50 text-green-900',
  error: 'border-red-500 bg-red-50 text-red-900',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-900',
  info: 'border-blue-500 bg-blue-50 text-blue-900',
}

const toastIconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

export function Toast({ id, type = 'info', title, message, onDismiss, duration = 5000, className }: ToastProps) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss?.(id), duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  const Icon = toastIcons[type]

  return (
    <div className={cn('border-l-4 rounded-lg p-4 shadow-lg animate-in slide-in-from-right', toastColors[type], className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', toastIconColors[type])} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {message && <p className="text-sm opacity-80 mt-0.5">{message}</p>}
        </div>
        <button className="shrink-0 opacity-60 hover:opacity-100" onClick={() => onDismiss?.(id)}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

interface ToastItem {
  id: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss?: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
}

export function ToastContainer({ toasts, onDismiss, position = 'top-right', className }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className={cn('fixed z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]', positionClasses[position], className)}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
