import { api } from './api'
import type { ApiResponse, PaginatedResponse, Vehicle, VehicleSearchParams } from '@/types'

export const vehicleService = {
  getAll: (params?: VehicleSearchParams) =>
    api.get<ApiResponse<PaginatedResponse<Vehicle>>>('/vehicles', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`),

  getMyVehicles: (params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedResponse<Vehicle>>>('/vehicles/my', { params }),

  create: (data: FormData) =>
    api.post<ApiResponse<Vehicle>>('/vehicles', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/vehicles/${id}`),

  toggleAvailability: (id: string, available: boolean) =>
    api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}/availability`, { available }),

  getFeatured: () =>
    api.get<ApiResponse<Vehicle[]>>('/vehicles/featured'),

  getSimilar: (id: string) =>
    api.get<ApiResponse<Vehicle[]>>(`/vehicles/${id}/similar`),

  search: (params: VehicleSearchParams) =>
    api.get<ApiResponse<PaginatedResponse<Vehicle>>>('/vehicles/search', { params }),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post<ApiResponse<{ url: string }>>(`/vehicles/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteImage: (vehicleId: string, imageId: string) =>
    api.delete<ApiResponse<null>>(`/vehicles/${vehicleId}/images/${imageId}`),

  checkAvailability: (id: string, startDate: string, endDate: string) =>
    api.get<ApiResponse<{ available: boolean }>>(`/vehicles/${id}/availability`, {
      params: { startDate, endDate },
    }),
}
