'use client'

import React from 'react'
import { Star, StarHalf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
}

export function RatingStars({ rating, maxRating = 5, size = 'md', interactive = false, onChange, className }: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const half = !filled && i < rating
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            {half ? (
              <StarHalf className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} />
            ) : (
              <Star
                className={cn(
                  sizeClasses[size],
                  filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                )}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

interface RatingSummaryProps {
  rating: number
  totalReviews: number
  distribution: { rating: number; count: number; percentage: number }[]
  className?: string
}

export function RatingSummary({ rating, totalReviews, distribution, className }: RatingSummaryProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold">{rating.toFixed(1)}</p>
          <RatingStars rating={rating} size="sm" />
          <p className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {distribution.map((item) => (
            <div key={item.rating} className="flex items-center gap-2">
              <span className="text-xs w-4">{item.rating}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
