'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Critical Error</h1>
            <p className="mb-2 text-gray-600">
              {error.message || 'A critical error occurred. Please refresh the page.'}
            </p>
            {error.digest && (
              <p className="mb-6 text-xs text-gray-400">Error ID: {error.digest}</p>
            )}
            <Button onClick={reset} variant="default">
              Refresh Page
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
