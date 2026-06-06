// ============================================================================
// Review Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { Review, ReviewFormData, RatingSummary, ReviewEligibility } from '@/types/review.types';

class ReviewService {
  async list(params?: PaginationParams): Promise<PaginatedResponse<Review>> {
    return api.get<PaginatedResponse<Review>>(apiConfig.endpoints.reviews.list, { params });
  }

  async create(data: ReviewFormData): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>(apiConfig.endpoints.reviews.create, data);
    return response.data!;
  }

  async getById(id: string): Promise<Review> {
    const response = await api.get<ApiResponse<Review>>(apiConfig.endpoints.reviews.detail(id));
    return response.data!;
  }

  async getVehicleReviews(vehicleId: string, params?: PaginationParams): Promise<PaginatedResponse<Review>> {
    return api.get<PaginatedResponse<Review>>(
      apiConfig.endpoints.reviews.vehicle(vehicleId),
      { params }
    );
  }

  async getUserReviews(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Review>> {
    return api.get<PaginatedResponse<Review>>(
      apiConfig.endpoints.reviews.user(userId),
      { params }
    );
  }

  async getReviewSummary(vehicleId: string): Promise<RatingSummary> {
    const response = await api.get<ApiResponse<RatingSummary>>(
      apiConfig.endpoints.reviews.summary(vehicleId)
    );
    return response.data!;
  }

  async checkEligibility(bookingId: string): Promise<ReviewEligibility> {
    const response = await api.get<ApiResponse<ReviewEligibility>>(
      apiConfig.endpoints.reviews.eligibility,
      { params: { bookingId } }
    );
    return response.data!;
  }
}

export const reviewService = new ReviewService();
