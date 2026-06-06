// ============================================================================
// useBookings Hook
// ============================================================================

import { useCallback } from 'react';
import { useBookingStore } from '@/store/booking.store';
import type { BookingRequest } from '@/types/booking.types';

export const useBookings = () => {
  const store = useBookingStore();

  const create = useCallback(async (data: BookingRequest) => {
    return store.createBooking(data);
  }, [store]);

  const cancel = useCallback(async (id: string, reason: string) => {
    return store.cancelBooking(id, reason);
  }, [store]);

  return {
    bookings: store.bookings,
    selectedBooking: store.selectedBooking,
    lastConfirmation: store.lastConfirmation,
    total: store.total,
    isLoading: store.isLoading,
    error: store.error,
    fetchBookings: store.fetchBookings,
    fetchBooking: store.fetchBooking,
    create,
    cancel,
    confirmBooking: store.confirmBooking,
    completeBooking: store.completeBooking,
    clearSelected: store.clearSelected,
    clearConfirmation: store.clearConfirmation,
  };
};
