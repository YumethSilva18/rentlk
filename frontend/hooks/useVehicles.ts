'use client'

import { useVehicleStore } from '@/store'
import { vehicleService } from '@/services/vehicle.service'
import { useCallback } from 'react'
import type { VehicleSearchParams } from '@/types'

export function useVehicles() {
  const {
    vehicles,
    selectedVehicle,
    filters,
    totalVehicles,
    currentPage,
    isLoading,
    error,
    setVehicles,
    setSelectedVehicle,
    setFilters,
    resetFilters,
    setTotalVehicles,
    setCurrentPage,
    setLoading,
    setError,
  } = useVehicleStore()

  const fetchVehicles = useCallback(
    async (params?: VehicleSearchParams) => {
      setLoading(true)
      try {
        const mergedParams = { ...filters, page: currentPage, ...params }
        const response = await vehicleService.getAll(mergedParams)
        const data = response.data.data
        if (data) {
          setVehicles(data.data)
          setTotalVehicles(data.total)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
      } finally {
        setLoading(false)
      }
    },
    [filters, currentPage, setLoading, setVehicles, setTotalVehicles, setError]
  )

  const fetchVehicleById = useCallback(
    async (id: string) => {
      setLoading(true)
      try {
        const response = await vehicleService.getById(id)
        setSelectedVehicle(response.data.data ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setSelectedVehicle, setError]
  )

  const searchVehicles = useCallback(
    async (params: VehicleSearchParams) => {
      setLoading(true)
      try {
        setFilters(params)
        const response = await vehicleService.search(params)
        const data = response.data.data
        if (data) {
          setVehicles(data.data)
          setTotalVehicles(data.total)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setFilters, setVehicles, setTotalVehicles, setError]
  )

  return {
    vehicles,
    selectedVehicle,
    filters,
    totalVehicles,
    currentPage,
    isLoading,
    error,
    fetchVehicles,
    fetchVehicleById,
    searchVehicles,
    setFilters,
    resetFilters,
    setCurrentPage,
    setSelectedVehicle,
  }
}
