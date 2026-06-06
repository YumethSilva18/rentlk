// ============================================================================
// Booking Store
// ============================================================================

import { create } from 'zustand';
import { bookingService } from '@/services/booking.service';
import type { Booking, BookingRequest, BookingConfirmation } from '@/types/booking.types';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  lastConfirmation: BookingConfirmation | null;
  total: number;
  isLoading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  fetchBooking: (id: string) => Promise<void>;
  createBooking: (data: BookingRequest) => Promise<BookingConfirmation>;
  cancelBooking: (id: string, reason: string) => Promise<void>;
  confirmBooking: (id: string) => Promise<void>;
  completeBooking: (id: string) => Promise<void>;
  clearSelected: () => void;
  clearConfirmation: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  selectedBooking: null,
  lastConfirmation: null,
  total: 0,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.getMyBookings();
      set({ bookings: response.data, total: response.total, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load bookings' });
    }
  },

  fetchBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingService.getById(id);
      set({ selectedBooking: booking, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load booking' });
    }
  },

  createBooking: async (data: BookingRequest) => {
    set({ isLoading: true, error: null });
    try {
      const confirmation = await bookingService.create(data);
      set({ lastConfirmation: confirmation, isLoading: false });
      return confirmation;
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to create booking' });
      throw err;
    }
  },

  cancelBooking: async (id: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingService.cancel(id, reason);
      set((state) => ({
        selectedBooking: state.selectedBooking?.id === id ? booking : state.selectedBooking,
        bookings: state.bookings.map((b) => (b.id === id ? booking : b)),
        isLoading: false,
      }));
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to cancel booking' });
      throw err;
    }
  },

  confirmBooking: async (id: string) => {
    const booking = await bookingService.confirm(id);
    set((state) => ({
      selectedBooking: state.selectedBooking?.id === id ? booking : state.selectedBooking,
      bookings: state.bookings.map((b) => (b.id === id ? booking : b)),
    }));
  },

  completeBooking: async (id: string) => {
    const booking = await bookingService.complete(id);
    set((state) => ({
      selectedBooking: state.selectedBooking?.id === id ? booking : state.selectedBooking,
      bookings: state.bookings.map((b) => (b.id === id ? booking : b)),
    }));
  },

  clearSelected: () => set({ selectedBooking: null }),
  clearConfirmation: () => set({ lastConfirmation: null }),
}));
