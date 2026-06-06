// ============================================================================
// Vehicle Store
// ============================================================================

import { create } from 'zustand';
import { vehicleService } from '@/services/vehicle.service';
import { StorageUtils, StorageKeys } from '@/utils/storage';
import type { Vehicle, VehicleFilters, VehicleAvailability } from '@/types/vehicle.types';
import type { VehicleSearchParams } from '@/types/api.types';

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  availability: VehicleAvailability | null;
  myVehicles: Vehicle[];
  savedVehicleIds: string[];
  filters: VehicleFilters;
  total: number;
  page: number;
  isLoading: boolean;
  error: string | null;

  fetchVehicles: (params?: VehicleSearchParams) => Promise<void>;
  fetchVehicle: (id: string) => Promise<void>;
  fetchMyVehicles: () => Promise<void>;
  fetchAvailability: (id: string) => Promise<void>;
  setFilters: (filters: Partial<VehicleFilters>) => void;
  clearFilters: () => void;
  toggleSavedVehicle: (id: string) => void;
  loadSavedVehicles: () => void;
  clearSelected: () => void;
  resetList: () => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  availability: null,
  myVehicles: [],
  savedVehicleIds: [],
  filters: {},
  total: 0,
  page: 1,
  isLoading: false,
  error: null,

  fetchVehicles: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.list(params);
      set({ vehicles: response.data, total: response.total, page: response.page, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load vehicles' });
    }
  },

  fetchVehicle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const vehicle = await vehicleService.getById(id);
      set({ selectedVehicle: vehicle, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load vehicle' });
    }
  },

  fetchMyVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await vehicleService.getMyVehicles();
      set({ myVehicles: response.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load my vehicles' });
    }
  },

  fetchAvailability: async (id) => {
    try {
      const availability = await vehicleService.getAvailability(id);
      set({ availability });
    } catch {
      // Non-critical
    }
  },

  setFilters: (filters) => {
    const current = get().filters;
    const updated = { ...current, ...filters };
    set({ filters: updated });
    StorageUtils.setObject(StorageKeys.VEHICLE_FILTERS, updated);
  },

  clearFilters: () => {
    set({ filters: {} });
    StorageUtils.remove(StorageKeys.VEHICLE_FILTERS);
  },

  toggleSavedVehicle: (id) => {
    const current = get().savedVehicleIds;
    const updated = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    set({ savedVehicleIds: updated });
    StorageUtils.setArray(StorageKeys.SAVED_VEHICLES, updated);
  },

  loadSavedVehicles: () => {
    const saved = StorageUtils.getArray<string>(StorageKeys.SAVED_VEHICLES);
    set({ savedVehicleIds: saved });
  },

  clearSelected: () => set({ selectedVehicle: null, availability: null }),

  resetList: () => set({ vehicles: [], total: 0, page: 1 }),
}));
