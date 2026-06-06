import { api } from './api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { AdminStats, AdminUser, FraudAlert, AdminLogEntry, KYCApplication } from '@/types'

export const adminService = {
  // Dashboard
  getStats: () =>
    api.get<ApiResponse<AdminStats>>('/admin/stats'),

  getActivityLog: (params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedResponse<AdminLogEntry>>>('/admin/activity-log', { params }),

  // Users
  getUsers: (params?: { page?: number; pageSize?: number; role?: string; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<AdminUser>>>('/admin/users', { params }),

  getUser: (userId: string) =>
    api.get<ApiResponse<AdminUser>>(`/admin/users/${userId}`),

  updateUser: (userId: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<AdminUser>>(`/admin/users/${userId}`, data),

  suspendUser: (userId: string, reason: string) =>
    api.post<ApiResponse<null>>(`/admin/users/${userId}/suspend`, { reason }),

  deleteUser: (userId: string) =>
    api.delete<ApiResponse<null>>(`/admin/users/${userId}`),

  // Vehicles
  getVehicles: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/vehicles', { params }),

  updateVehicle: (vehicleId: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<unknown>>(`/admin/vehicles/${vehicleId}`, data),

  aproveVehicle: (vehicleId: string) =>
    api.post<ApiResponse<null>>(`/admin/vehicles/${vehicleId}/approve`),

  rejectVehicle: (vehicleId: string, reason: string) =>
    api.post<ApiResponse<null>>(`/admin/vehicles/${vehicleId}/reject`, { reason }),

  // Bookings
  getBookings: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/bookings', { params }),

  getBooking: (bookingId: string) =>
    api.get<ApiResponse<unknown>>(`/admin/bookings/${bookingId}`),

  cancelBooking: (bookingId: string, reason: string) =>
    api.post<ApiResponse<null>>(`/admin/bookings/${bookingId}/cancel`, { reason }),

  // KYC
  getKYCReviews: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<KYCApplication>>>('/admin/kyc', { params }),

  approveKYC: (applicationId: string) =>
    api.post<ApiResponse<null>>(`/admin/kyc/${applicationId}/approve`),

  rejectKYC: (applicationId: string, reason: string) =>
    api.post<ApiResponse<null>>(`/admin/kyc/${applicationId}/reject`, { reason }),

  // Transactions
  getTransactions: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<unknown>>>('/admin/transactions', { params }),

  processRefund: (transactionId: string, amount: number, reason: string) =>
    api.post<ApiResponse<unknown>>(`/admin/transactions/${transactionId}/refund`, { amount, reason }),

  // Fraud Alerts
  getFraudAlerts: (params?: { page?: number; pageSize?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<FraudAlert>>>('/admin/fraud-alerts', { params }),

  updateFraudAlert: (alertId: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<FraudAlert>>(`/admin/fraud-alerts/${alertId}`, data),

  resolveFraudAlert: (alertId: string, resolution: string) =>
    api.post<ApiResponse<null>>(`/admin/fraud-alerts/${alertId}/resolve`, { resolution }),

  // Reports
  getReports: (params?: { type?: string; from?: string; to?: string }) =>
    api.get<ApiResponse<unknown>>('/admin/reports', { params }),

  generateReport: (type: string, from: string, to: string) =>
    api.post<ApiResponse<{ url: string }>>('/admin/reports/generate', { type, from, to }),
}
