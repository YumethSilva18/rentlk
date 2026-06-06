'use client'

import React from 'react'
import { AlertTriangle, Shield, UserX, CreditCard, FileWarning, Users, ExternalLink, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatDateTime } from '@/lib/utils'
import type { FraudAlert } from '@/types'

interface FraudAlertsListProps {
  alerts: FraudAlert[]
  onInvestigate?: (alertId: string) => void
  onResolve?: (alertId: string) => void
  onDismiss?: (alertId: string) => void
  isLoading?: boolean
  className?: string
}

const severityIcons: Record<string, React.ElementType> = {
  critical: AlertTriangle,
  high: Shield,
  medium: FileWarning,
  low: CreditCard,
}

const severityColors: Record<string, string> = {
  critical: 'text-red-600 bg-red-100',
  high: 'text-orange-600 bg-orange-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-blue-600 bg-blue-100',
}

const severityVariants: Record<string, 'destructive' | 'warning' | 'secondary' | 'default'> = {
  critical: 'destructive',
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
}

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  resolved: 'success',
  investigating: 'warning',
  open: 'destructive',
  dismissed: 'secondary',
}

const typeLabels: Record<string, string> = {
  suspicious_kyc: 'Suspicious KYC',
  payment_fraud: 'Payment Fraud',
  booking_fraud: 'Booking Fraud',
  review_fraud: 'Review Fraud',
  multiple_accounts: 'Multiple Accounts',
}

export function FraudAlertsList({
  alerts,
  onInvestigate,
  onResolve,
  onDismiss,
  isLoading = false,
  className,
}: FraudAlertsListProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>Fraud Alerts</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Fraud Alerts</CardTitle>
          <Badge variant="destructive">{alerts.filter(a => a.status === 'open').length} active</Badge>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search alerts..." className="pl-8 h-9 w-60" />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detected</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <Shield className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No fraud alerts detected
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => {
                const SeverityIcon = severityIcons[alert.severity] || AlertTriangle
                return (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge variant="outline">{typeLabels[alert.type] || alert.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className={cn('flex h-6 w-6 items-center justify-center rounded-full', severityColors[alert.severity])}>
                          <SeverityIcon className="h-3.5 w-3.5" />
                        </div>
                        <span className={cn('text-xs font-medium capitalize', {
                          'text-red-600': alert.severity === 'critical',
                          'text-orange-600': alert.severity === 'high',
                          'text-yellow-600': alert.severity === 'medium',
                          'text-blue-600': alert.severity === 'low',
                        })}>{alert.severity}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{alert.userName || alert.userId || 'Unknown'}</TableCell>
                    <TableCell className="text-sm max-w-[250px] truncate">{alert.description}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[alert.status] || 'secondary'}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(alert.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {alert.status === 'open' && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onInvestigate?.(alert.id)}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDismiss?.(alert.id)}>
                              <UserX className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {alert.status === 'investigating' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => onResolve?.(alert.id)}>
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
