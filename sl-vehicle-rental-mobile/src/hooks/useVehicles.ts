// ============================================================================
// useVehicles Hook
// ============================================================================

import { useCallback } from 'react';
import { useVehicleStore } from '@/store/vehicle.store';
import type { VehicleFilters } from '@/types/vehicle.types';
import type { VehicleSearchParams } from '@/types/api.types';

export const useVehicles = () => {
  const store = useVehicleStore();

  const search = useCallback((params?: VehicleSearchParams) => {
    return store.fetchVehicles(params);
  }, [store]);

  const getDetail = useCallback((id: string) => {
    return store.fetchVehicle(id);
  }, [store]);

  const toggleSave = useCallback((id: string) => {
    store.toggleSavedVehicle(id);
  }, [store]);

  const isSaved = useCallback((id: string) => {
    return store.savedVehicleIds.includes(id);
  }, [store.savedVehicleIds]);

  return {
    vehicles: store.vehicles,
    selectedVehicle: store.selectedVehicle,
    availability: store.availability,
    myVehicles: store.myVehicles,
    savedVehicleIds: store.savedVehicleIds,
    filters: store.filters,
    total: store.total,
    isLoading: store.isLoading,
    error: store.error,
    search,
    getDetail,
    fetchMyVehicles: store.fetchMyVehicles,
    fetchAvailability: store.fetchAvailability,
    setFilters: store.setFilters,
    clearFilters: store.clearFilters,
    toggleSave,
    isSaved,
    clearSelected: store.clearSelected,
    resetList: store.resetList,
  };
};
