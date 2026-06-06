import { create } from 'zustand'
import type { Booking } from '@/types'

interface BookingState {
  bookings: Booking[]
  selectedBooking: Booking | null
  filter: 'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'
  totalBookings: number
  currentPage: number
  isLoading: boolean
  error: string | null

  // Actions
  setBookings: (bookings: Booking[]) => void
  setSelectedBooking: (booking: Booking | null) => void
  setFilter: (filter: BookingState['filter']) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, data: Partial<Booking>) => void
  removeBooking: (id: string) => void
  setTotalBookings: (total: number) => void
  setCurrentPage: (page: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  selectedBooking: null,
  filter: 'all',
  totalBookings: 0,
  currentPage: 1,
  isLoading: false,
  error: null,

  setBookings: (bookings) => set({ bookings }),

  setSelectedBooking: (selectedBooking) => set({ selectedBooking }),

  setFilter: (filter) => set({ filter, currentPage: 1 }),

  addBooking: (booking) =>
    set((state) => ({
      bookings: [booking, ...state.bookings],
      totalBookings: state.totalBookings + 1,
    })),

  updateBooking: (id, data) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...data } : b)),
      selectedBooking: state.selectedBooking?.id === id ? { ...state.selectedBooking, ...data } : state.selectedBooking,
    })),

  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
      totalBookings: state.totalBookings - 1,
    })),

  setTotalBookings: (totalBookings) => set({ totalBookings }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))
