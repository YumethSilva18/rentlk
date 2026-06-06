import { api } from './api'
import type { ApiResponse, PaginatedResponse, Booking } from '@/types'

export const bookingService = {
  getAll: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<Booking>>>('/bookings', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`),

  create: (data: {
    vehicleId: string
    startDate: string
    endDate: string
    pickupLocation: string
    totalAmount: number
    addOns?: string[]
    notes?: string
  }) =>
    api.post<ApiResponse<Booking>>('/bookings', data),

  cancel: (id: string, reason: string) =>
    api.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`, { reason }),

  confirmPickup: (id: string) =>
    api.post<ApiResponse<Booking>>(`/bookings/${id}/confirm-pickup`),

  confirmReturn: (id: string) =>
    api.post<ApiResponse<Booking>>(`/bookings/${id}/confirm-return`),

  getInvoice: (id: string) =>
    api.get<ApiResponse<unknown>>(`/bookings/${id}/invoice`),

  downloadInvoice: (id: string) =>
    api.get<Blob>(`/bookings/${id}/invoice/download`, { responseType: 'blob' }),

  trackBooking: (id: string) =>
    api.get<ApiResponse<unknown>>(`/bookings/${id}/track`),
}
