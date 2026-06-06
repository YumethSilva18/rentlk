// ============================================================================
// useReviews Hook
// ============================================================================

import { useState, useCallback } from 'react';
import { reviewService } from '@/services/review.service';
import type { Review, ReviewFormData, RatingSummary } from '@/types/review.types';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVehicleReviews = useCallback(async (vehicleId: string) => {
    setIsLoading(true);
    try {
      const [response, summaryData] = await Promise.all([
        reviewService.getVehicleReviews(vehicleId),
        reviewService.getReviewSummary(vehicleId),
      ]);
      setReviews(response.data);
      setSummary(summaryData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReview = useCallback(async (data: ReviewFormData) => {
    return reviewService.create(data);
  }, []);

  return { reviews, summary, isLoading, fetchVehicleReviews, createReview };
};
