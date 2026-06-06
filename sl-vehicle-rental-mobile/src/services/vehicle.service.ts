// ============================================================================
// Vehicle Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams, VehicleSearchParams } from '@/types/api.types';
import type { Vehicle, VehicleFilters, VehicleFormData, VehicleAvailability } from '@/types/vehicle.types';

class VehicleService {
  async list(params?: VehicleSearchParams): Promise<PaginatedResponse<Vehicle>> {
    return api.get<PaginatedResponse<Vehicle>>(apiConfig.endpoints.vehicles.list, { params });
  }

  async getById(id: string): Promise<Vehicle> {
    const response = await api.get<ApiResponse<Vehicle>>(apiConfig.endpoints.vehicles.detail(id));
    return response.data!;
  }

  async create(data: VehicleFormData): Promise<Vehicle> {
    const response = await api.post<ApiResponse<Vehicle>>(apiConfig.endpoints.vehicles.create, data);
    return response.data!;
  }

  async update(id: string, data: Partial<VehicleFormData>): Promise<Vehicle> {
    const response = await api.put<ApiResponse<Vehicle>>(apiConfig.endpoints.vehicles.update(id), data);
    return response.data!;
  }

  async delete(id: string): Promise<void> {
    await api.delete(apiConfig.endpoints.vehicles.delete(id));
  }

  async getMyVehicles(params?: PaginationParams): Promise<PaginatedResponse<Vehicle>> {
    return api.get<PaginatedResponse<Vehicle>>(apiConfig.endpoints.vehicles.myVehicles, { params });
  }

  async search(params: VehicleSearchParams): Promise<PaginatedResponse<Vehicle>> {
    return api.get<PaginatedResponse<Vehicle>>(apiConfig.endpoints.vehicles.search, { params });
  }

  async getAvailability(id: string): Promise<VehicleAvailability> {
    const response = await api.get<ApiResponse<VehicleAvailability>>(
      apiConfig.endpoints.vehicles.availability(id)
    );
    return response.data!;
  }

  async getStats(): Promise<Record<string, number>> {
    const response = await api.get<ApiResponse<Record<string, number>>>(
      apiConfig.endpoints.vehicles.stats
    );
    return response.data!;
  }
}

export const vehicleService = new VehicleService();
