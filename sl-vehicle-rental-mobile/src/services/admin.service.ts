// ============================================================================
// Admin Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { AdminStats, FraudAlert, AdminLogEntry } from '@/types/admin.types';
import type { User } from '@/types/user.types';
import type { Vehicle } from '@/types/vehicle.types';
import type { Booking } from '@/types/booking.types';
import type { KYCApplication } from '@/types/kyc.types';
import type { Review } from '@/types/review.types';

class AdminService {
  async getDashboard(): Promise<AdminStats> {
    const response = await api.get<ApiResponse<AdminStats>>(apiConfig.endpoints.admin.dashboard);
    return response.data!;
  }

  // Users
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    return api.get<PaginatedResponse<User>>(apiConfig.endpoints.admin.users, { params });
  }

  async getUser(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(apiConfig.endpoints.admin.user(id));
    return response.data!;
  }

  async suspendUser(id: string, reason: string): Promise<void> {
    await api.post(apiConfig.endpoints.admin.user(id) + '/suspend', { reason });
  }

  async activateUser(id: string): Promise<void> {
    await api.post(apiConfig.endpoints.admin.user(id) + '/activate');
  }

  // Vehicles
  async getVehicles(params?: PaginationParams): Promise<PaginatedResponse<Vehicle>> {
    return api.get<PaginatedResponse<Vehicle>>(apiConfig.endpoints.admin.vehicles, { params });
  }

  async approveVehicle(id: string): Promise<void> {
    await api.post(apiConfig.endpoints.admin.vehicle(id) + '/approve');
  }

  async rejectVehicle(id: string, reason: string): Promise<void> {
    await api.post(apiConfig.endpoints.admin.vehicle(id) + '/reject', { reason });
  }

  // Bookings
  async getBookings(params?: PaginationParams): Promise<PaginatedResponse<Booking>> {
    return api.get<PaginatedResponse<Booking>>(apiConfig.endpoints.admin.bookings, { params });
  }

  // KYC
  async getKYCApplications(params?: PaginationParams): Promise<PaginatedResponse<KYCApplication>> {
    return api.get<PaginatedResponse<KYCApplication>>(apiConfig.endpoints.admin.kyc, { params });
  }

  async reviewKYC(id: string, decision: 'approve' | 'reject', reason?: string): Promise<void> {
    await api.post(apiConfig.endpoints.admin.kycReview(id), { decision, reason });
  }

  // Transactions
  async getTransactions(params?: PaginationParams): Promise<PaginatedResponse<unknown>> {
    return api.get<PaginatedResponse<unknown>>(apiConfig.endpoints.admin.transactions, { params });
  }

  // Fraud
  async getFraudAlerts(params?: PaginationParams): Promise<PaginatedResponse<FraudAlert>> {
    return api.get<PaginatedResponse<FraudAlert>>(apiConfig.endpoints.admin.fraud, { params });
  }

  async updateFraudAlert(id: string, status: string, notes?: string): Promise<void> {
    await api.put(apiConfig.endpoints.admin.fraudAlert(id), { status, notes });
  }

  // Reviews
  async getReviews(params?: PaginationParams): Promise<PaginatedResponse<Review>> {
    return api.get<PaginatedResponse<Review>>(apiConfig.endpoints.admin.reviews, { params });
  }

  async moderateReview(id: string, action: 'approve' | 'remove', reason?: string): Promise<void> {
    await api.post(apiConfig.endpoints.admin.review(id) + '/moderate', { action, reason });
  }

  // Reports
  async getReports(params?: { type?: string; period?: string }): Promise<unknown> {
    return api.get(apiConfig.endpoints.admin.reports, { params });
  }
}

export const adminService = new AdminService();
