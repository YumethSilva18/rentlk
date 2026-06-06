'use client'

import { useBookingStore } from '@/store'
import { bookingService } from '@/services/booking.service'
import { useCallback } from 'react'

export function useBookings() {
  const {
    bookings,
    selectedBooking,
    filter,
    totalBookings,
    currentPage,
    isLoading,
    error,
    setBookings,
    setSelectedBooking,
    setFilter,
    addBooking,
    updateBooking,
    removeBooking,
    setTotalBookings,
    setCurrentPage,
    setLoading,
    setError,
  } = useBookingStore()

  const fetchBookings = useCallback(
    async (params?: { page?: number; pageSize?: number; status?: string }) => {
      setLoading(true)
      try {
        const response = await bookingService.getAll({ page: currentPage, ...params })
        const data = response.data.data
        if (data) {
          setBookings(data.data)
          setTotalBookings(data.total)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
      } finally {
        setLoading(false)
      }
    },
    [currentPage, setLoading, setBookings, setTotalBookings, setError]
  )

  const fetchBookingById = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const response = await bookingService.getById(id)
        setSelectedBooking(response.data.data ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch booking')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setSelectedBooking, setError]
  )

  const createBooking = useCallback(
    async (data: {
      vehicleId: string
      startDate: string
      endDate: string
      pickupLocation: string
      totalAmount: number
      addOns?: string[]
      notes?: string
    }) => {
      setLoading(true)
      try {
        const response = await bookingService.create(data)
        const booking = response.data.data
        if (booking) addBooking(booking)
        return booking
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create booking')
        return null
      } finally {
        setLoading(false)
      }
    },
    [setLoading, addBooking, setError]
  )

  const cancelBooking = useCallback(
    async (id: string, reason: string) => {
      setLoading(true)
      try {
        await bookingService.cancel(id, reason)
        updateBooking(id, { status: 'cancelled' } as never)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to cancel booking')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, updateBooking, setError]
  )

  return {
    bookings,
    selectedBooking,
    filter,
    totalBookings,
    currentPage,
    isLoading,
    error,
    fetchBookings,
    fetchBookingById,
    createBooking,
    cancelBooking,
    setFilter,
    setCurrentPage,
    setSelectedBooking,
  }
}
