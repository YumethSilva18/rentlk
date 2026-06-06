'use client'

import React from 'react'
import { Users, Car, CreditCard, Shield, FileText, Download, Settings, BarChart3, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface AdminQuickAction {
  label: string
  icon: React.ElementType
  href?: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'secondary'
  color?: string
}

interface AdminActionsProps {
  className?: string
}

export function AdminActions({ className }: AdminActionsProps) {
  const quickActions: AdminQuickAction[] = [
    { label: 'View Users', icon: Users, href: '/admin/users', color: 'text-blue-600' },
    { label: 'Manage Vehicles', icon: Car, href: '/admin/vehicles', color: 'text-green-600' },
    { label: 'Review Bookings', icon: CreditCard, href: '/admin/bookings', color: 'text-purple-600' },
    { label: 'KYC Reviews', icon: Shield, href: '/admin/kyc-reviews', color: 'text-orange-600' },
    { label: 'Transactions', icon: CreditCard, href: '/admin/transactions', color: 'text-indigo-600' },
    { label: 'Fraud Alerts', icon: AlertTriangle, href: '/admin/fraud-alerts', color: 'text-red-600' },
    { label: 'Reports', icon: BarChart3, href: '/admin/reports', color: 'text-teal-600' },
    { label: 'Settings', icon: Settings, href: '/admin/settings', color: 'text-gray-600' },
  ]

  const reportActions: AdminQuickAction[] = [
    { label: 'Export Users Report', icon: Download, onClick: () => {}, color: 'text-blue-600' },
    { label: 'Export Revenue Report', icon: Download, onClick: () => {}, color: 'text-green-600' },
    { label: 'Export Bookings Report', icon: Download, onClick: () => {}, color: 'text-purple-600' },
    { label: 'Export KYC Report', icon: FileText, onClick: () => {}, color: 'text-orange-600' },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              const content = (
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 py-4 justify-start items-center w-full"
                  onClick={action.onClick}
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <Link href={action.href}>
                      <Icon className={cn('h-6 w-6', action.color)} />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Link>
                  ) : (
                    <>
                      <Icon className={cn('h-6 w-6', action.color)} />
                      <span className="text-xs font-medium">{action.label}</span>
                    </>
                  )}
                </Button>
              )
              return content
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reportActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={action.onClick}
                >
                  <Icon className={cn('h-4 w-4', action.color)} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
