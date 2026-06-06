'use client'

import React from 'react'
import { ShieldCheck, Award, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isVerified?: boolean
  isOnline?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-24 w-24 text-3xl',
}

const onlineDotSizes = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
}

export function UserAvatar({ src, name, size = 'md', isVerified = false, isOnline = false, className }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold overflow-hidden',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {isVerified && (
        <ShieldCheck
          className={cn('absolute -bottom-0.5 -right-0.5 text-blue-500 bg-background rounded-full', {
            'h-3 w-3': size === 'sm',
            'h-4 w-4': size === 'md',
            'h-5 w-5': size === 'lg',
            'h-6 w-6': size === 'xl',
          })}
        />
      )}
      {isOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background bg-green-500',
            onlineDotSizes[size]
          )}
        />
      )}
    </div>
  )
}

interface UserRatingProps {
  rating: number
  totalReviews: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserRating({ rating, totalReviews, showCount = true, size = 'md', className }: UserRatingProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const starSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('flex items-center gap-1', sizeClasses[size], className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize[size],
              i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            )}
          />
        ))}
      </div>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {showCount && (
        <span className="text-muted-foreground">({totalReviews})</span>
      )}
    </div>
  )
}

interface UserBadgesProps {
  badges: string[]
  className?: string
}

export function UserBadges({ badges, className }: UserBadgesProps) {
  if (badges.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {badges.map((badge) => (
        <span
          key={badge}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          <Award className="h-3 w-3" />
          {badge}
        </span>
      ))}
    </div>
  )
}
