'use client'

import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Breadcrumb {
  label: string
  href?: string
  icon?: React.ElementType
}

interface BreadcrumbsProps {
  items: Breadcrumb[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const Icon = item.icon

        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3.5 w-3.5" />
            {isLast || !item.href ? (
              <span className={cn('truncate max-w-[200px]', isLast && 'text-foreground font-medium')}>
                {Icon && <Icon className="h-3.5 w-3.5 inline mr-1" />}
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-foreground transition-colors truncate max-w-[200px]">
                {Icon && <Icon className="h-3.5 w-3.5 inline mr-1" />}
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
