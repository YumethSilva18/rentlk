'use client'

import React, { useState } from 'react'
import { Star, ThumbsUp, Flag, MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RatingStars } from './RatingStars'
import { cn, formatDate } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  onHelpful?: (id: string) => void
  onReport?: (id: string) => void
  className?: string
}

export function ReviewCard({ review, onHelpful, onReport, className }: ReviewCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {review.reviewerAvatar ? (
                <img src={review.reviewerAvatar} alt={review.reviewerName} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                review.reviewerName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{review.reviewerName}</p>
              <div className="flex items-center gap-2">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {review.title && (
          <h4 className="text-sm font-semibold mt-3">{review.title}</h4>
        )}
        <p className="text-sm text-muted-foreground mt-1">{review.comment || 'No comment provided.'}</p>

        {review.categories && review.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {review.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mt-3">
            {review.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Review image ${i + 1}`}
                className="h-20 w-20 rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => onHelpful?.(review.id)}
          >
            <ThumbsUp className="mr-1 h-3 w-3" />
            Helpful ({review.helpfulCount || 0})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 text-muted-foreground"
            onClick={() => onReport?.(review.id)}
          >
            <Flag className="mr-1 h-3 w-3" />
            Report
          </Button>
          {review.isVerified && (
            <span className="ml-auto text-xs text-green-600 font-medium">✓ Verified Booking</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ReviewListProps {
  reviews: Review[]
  isLoading?: boolean
  onHelpful?: (id: string) => void
  onReport?: (id: string) => void
  onLoadMore?: () => void
  hasMore?: boolean
  className?: string
}

export function ReviewList({ reviews, isLoading = false, onHelpful, onReport, onLoadMore, hasMore = false, className }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className || ''}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {reviews.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <Star className="mx-auto h-10 w-10 mb-2 opacity-30" />
          <p className="text-sm">No reviews yet</p>
        </div>
      ) : (
        <>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={onHelpful}
              onReport={onReport}
            />
          ))}
          {hasMore && (
            <div className="text-center">
              <Button variant="outline" size="sm" onClick={onLoadMore}>
                Load More Reviews
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
