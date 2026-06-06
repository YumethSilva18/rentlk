'use client'

import React from 'react'
import { Inbox, Search, FileText, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'document' | 'list'
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const iconMap = {
  inbox: Inbox,
  search: Search,
  document: FileText,
  list: ClipboardList,
}

export function EmptyState({
  icon = 'inbox',
  title = 'No data found',
  description = 'There are no items to display at this time.',
  action,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon]

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface NotFoundProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function NotFound({
  title = 'Not Found',
  description = 'The resource you are looking for could not be found.',
  action,
  className,
}: NotFoundProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-[50vh] py-16 px-4 text-center', className)}>
      <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
