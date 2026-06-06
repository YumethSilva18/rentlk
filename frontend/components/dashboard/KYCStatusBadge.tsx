'use client'

import React from 'react'
import { CheckCircle, Clock, AlertTriangle, XCircle, Upload, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface KYCStatusBadgeProps {
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  completeness?: number
  onStartKYC?: () => void
  onContinueKYC?: () => void
  className?: string
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; variant: 'warning' | 'default' | 'success' | 'destructive'; color: string; bgColor: string }> = {
  not_submitted: { icon: Upload, label: 'Not Submitted', variant: 'warning', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  pending: { icon: Clock, label: 'Under Review', variant: 'default', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  approved: { icon: CheckCircle, label: 'Verified', variant: 'success', color: 'text-green-600', bgColor: 'bg-green-100' },
  rejected: { icon: XCircle, label: 'Rejected', variant: 'destructive', color: 'text-red-600', bgColor: 'bg-red-100' },
}

export function KYCStatusBadge({
  status,
  rejectionReason,
  completeness = 0,
  onStartKYC,
  onContinueKYC,
  className,
}: KYCStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className={cn('border-l-4', className, {
      'border-l-orange-400': status === 'not_submitted',
      'border-l-blue-400': status === 'pending',
      'border-l-green-400': status === 'approved',
      'border-l-red-400': status === 'rejected',
    })}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.bgColor)}>
              <Icon className={cn('h-5 w-5', config.color)} />
            </div>
            <div>
              <CardTitle className="text-base">KYC Verification</CardTitle>
              <CardDescription>
                <Badge variant={config.variant} className="mt-1">
                  {config.label}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {status === 'not_submitted' && (
          <>
            <p className="text-sm text-muted-foreground">
              Complete your KYC to unlock all features including vehicle rentals and listings.
            </p>
            <Button onClick={onStartKYC} size="sm" className="w-full">
              Start Verification
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Verification progress</span>
                <span>{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your documents are being reviewed. This usually takes 24-48 hours.
            </p>
            {completeness < 100 && (
              <Button onClick={onContinueKYC} size="sm" variant="outline" className="w-full">
                Continue Verification
              </Button>
            )}
          </>
        )}

        {status === 'approved' && (
          <p className="text-sm text-muted-foreground">
            Your identity has been verified. You have full access to all platform features.
          </p>
        )}

        {status === 'rejected' && (
          <>
            <div className="rounded-lg bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700">Verification Rejected</p>
                  {rejectionReason && (
                    <p className="text-xs text-red-600 mt-1">{rejectionReason}</p>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={onStartKYC} size="sm" className="w-full">
              Resubmit Documents
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
