'use client'

import React from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import type { Review } from '@/types'

interface UserReviewsProps {
  reviews: Review[]
  isLoading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  className?: string
}

export function UserReviews({ reviews, isLoading = false, onLoadMore, hasMore = false, className }: UserReviewsProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Star className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {review.reviewerAvatar ? (
                        <img src={review.reviewerAvatar} alt={review.reviewerName} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        review.reviewerName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.reviewerName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-3 w-3',
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <p className="text-sm font-medium mb-1">{review.title}</p>
                )}
                <p className="text-sm text-muted-foreground">{review.comment || 'No comment'}</p>
                <div className="flex items-center gap-4 mt-2">
                  {review.helpfulCount !== undefined && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="h-3 w-3" />
                      {review.helpfulCount} helpful
                    </span>
                  )}
                  {review.isVerified && (
                    <span className="text-xs text-green-600 font-medium">Verified Booking</span>
                  )}
                </div>
                {review.response && (
                  <div className="mt-2 ml-8 rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium mb-0.5">Owner Response</p>
                    <p className="text-xs text-muted-foreground">{review.response}</p>
                  </div>
                )}
              </div>
            ))}
            {hasMore && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" onClick={onLoadMore}>
                  Load More Reviews
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
