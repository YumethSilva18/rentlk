import { api } from './api'
import type { ApiResponse, PaginatedResponse, Review, ReviewFormData, RatingSummary } from '@/types'

export const reviewService = {
  getByVehicle: (vehicleId: string, params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedResponse<Review>>>(`/reviews/vehicle/${vehicleId}`, { params }),

  getByUser: (userId: string, params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedResponse<Review>>>(`/reviews/user/${userId}`, { params }),

  getMyReviews: (params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedResponse<Review>>>('/reviews/my', { params }),

  getRatingSummary: (targetId: string, targetType: 'vehicle' | 'owner' | 'renter') =>
    api.get<ApiResponse<RatingSummary>>(`/reviews/summary/${targetId}`, { params: { targetType } }),

  create: (data: ReviewFormData) => {
    const formData = new FormData()
    formData.append('rating', String(data.rating))
    if (data.title) formData.append('title', data.title)
    formData.append('comment', data.comment)
    formData.append('categories', JSON.stringify(data.categories))
    if (data.images) {
      data.images.forEach((image) => formData.append('images', image))
    }
    return api.post<ApiResponse<Review>>('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  update: (reviewId: string, data: Partial<ReviewFormData>) =>
    api.put<ApiResponse<Review>>(`/reviews/${reviewId}`, data),

  delete: (reviewId: string) =>
    api.delete<ApiResponse<null>>(`/reviews/${reviewId}`),

  markHelpful: (reviewId: string) =>
    api.post<ApiResponse<{ helpfulCount: number }>>(`/reviews/${reviewId}/helpful`),

  respond: (reviewId: string, comment: string) =>
    api.post<ApiResponse<Review>>(`/reviews/${reviewId}/respond`, { comment }),
}
