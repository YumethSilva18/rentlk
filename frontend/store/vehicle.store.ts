import { create } from 'zustand'
import type { Vehicle } from '@/types'

interface VehicleFilters {
  query?: string
  type?: string
  make?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  transmission?: string
  fuelType?: string
  minSeats?: number
  location?: string
  features?: string[]
  available?: boolean
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface VehicleState {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  filters: VehicleFilters
  totalVehicles: number
  currentPage: number
  isLoading: boolean
  error: string | null

  // Actions
  setVehicles: (vehicles: Vehicle[]) => void
  setSelectedVehicle: (vehicle: Vehicle | null) => void
  setFilters: (filters: Partial<VehicleFilters>) => void
  resetFilters: () => void
  setTotalVehicles: (total: number) => void
  setCurrentPage: (page: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultFilters: VehicleFilters = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  selectedVehicle: null,
  filters: { ...defaultFilters },
  totalVehicles: 0,
  currentPage: 1,
  isLoading: false,
  error: null,

  setVehicles: (vehicles) => set({ vehicles }),

  setSelectedVehicle: (selectedVehicle) => set({ selectedVehicle }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1,
    })),

  resetFilters: () => set({ filters: { ...defaultFilters }, currentPage: 1 }),

  setTotalVehicles: (totalVehicles) => set({ totalVehicles }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))
