'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RatingStars } from './RatingStars'
import { cn } from '@/lib/utils'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  onSubmit: (data: ReviewFormValues) => void
  isSubmitting?: boolean
  onCancel?: () => void
  defaultRating?: number
  className?: string
}

export function ReviewForm({ onSubmit, isSubmitting = false, onCancel, defaultRating = 0, className }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: defaultRating, comment: '', title: '' },
  })

  const rating = watch('rating')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label>Rating</Label>
        <RatingStars rating={rating} interactive onChange={(r) => setValue('rating', r, { shouldValidate: true })} size="lg" />
        {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title (optional)</Label>
        <input
          id="title"
          {...register('title')}
          placeholder="Summarize your experience"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          {...register('comment')}
          placeholder="Tell us about your experience..."
          rows={4}
          maxLength={1000}
        />
        {errors.comment && <p className="text-xs text-destructive">{errors.comment.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting || rating === 0}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ReviewFormValues) => void
  isSubmitting?: boolean
  targetName?: string
}

export function ReviewModal({ open, onOpenChange, onSubmit, isSubmitting = false, targetName }: ReviewModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Write a Review</h3>
            {targetName && (
              <p className="text-sm text-muted-foreground">{targetName}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ReviewForm
          onSubmit={(data) => {
            onSubmit(data)
            onOpenChange(false)
          }}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </div>
    </div>
  )
}
