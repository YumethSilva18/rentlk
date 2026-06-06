'use client'

import * as React from 'react'
import { useUIStore } from '@/store'
import { Toast } from '@/components/ui/toast'

export function Toaster() {
  const { toasts, removeToast } = useUIStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.message}
          variant={toast.type === 'error' ? 'destructive' : toast.type === 'success' ? 'success' : toast.type === 'warning' ? 'warning' : 'default'}
          onDismiss={removeToast}
          duration={toast.duration}
        />
      ))}
    </div>
  )
}
