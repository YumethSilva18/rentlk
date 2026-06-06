'use client'

import { useCallback, useState } from 'react'
import { reviewService } from '@/services/review.service'
import type { Review, ReviewFormData, RatingSummary } from '@/types'

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviewsByVehicle = useCallback(
    async (vehicleId: string, params?: { page?: number; pageSize?: number }) => {
      setIsLoading(true)
      try {
        const response = await reviewService.getByVehicle(vehicleId, params)
        const data = response.data.data
        if (data) setReviews(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews')
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const fetchRatingSummary = useCallback(
    async (targetId: string, targetType: 'vehicle' | 'owner' | 'renter') => {
      try {
        const response = await reviewService.getRatingSummary(targetId, targetType)
        setRatingSummary(response.data.data ?? null)
      } catch {
        // silently fail
      }
    },
    []
  )

  const submitReview = useCallback(async (data: ReviewFormData) => {
    setIsLoading(true)
    try {
      const response = await reviewService.create(data)
      const review = response.data.data
      if (review) setReviews((prev) => [review, ...prev])
      return review
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    reviews,
    ratingSummary,
    isLoading,
    error,
    fetchReviewsByVehicle,
    fetchRatingSummary,
    submitReview,
  }
}
