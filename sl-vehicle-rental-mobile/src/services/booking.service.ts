// ============================================================================
// Booking Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { Booking, BookingRequest, BookingConfirmation } from '@/types/booking.types';

class BookingService {
  async list(params?: PaginationParams): Promise<PaginatedResponse<Booking>> {
    return api.get<PaginatedResponse<Booking>>(apiConfig.endpoints.bookings.list, { params });
  }

  async getById(id: string): Promise<Booking> {
    const response = await api.get<ApiResponse<Booking>>(apiConfig.endpoints.bookings.detail(id));
    return response.data!;
  }

  async create(data: BookingRequest): Promise<BookingConfirmation> {
    const response = await api.post<ApiResponse<BookingConfirmation>>(
      apiConfig.endpoints.bookings.create,
      data
    );
    return response.data!;
  }

  async confirm(id: string): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>(
      apiConfig.endpoints.bookings.confirm(id)
    );
    return response.data!;
  }

  async cancel(id: string, reason: string): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>(
      apiConfig.endpoints.bookings.cancel(id),
      { reason }
    );
    return response.data!;
  }

  async complete(id: string): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>(
      apiConfig.endpoints.bookings.complete(id)
    );
    return response.data!;
  }

  async getMyBookings(params?: PaginationParams): Promise<PaginatedResponse<Booking>> {
    return api.get<PaginatedResponse<Booking>>(apiConfig.endpoints.bookings.myBookings, { params });
  }

  async getIncomingBookings(params?: PaginationParams): Promise<PaginatedResponse<Booking>> {
    return api.get<PaginatedResponse<Booking>>(apiConfig.endpoints.bookings.incoming, { params });
  }
}

export const bookingService = new BookingService();
