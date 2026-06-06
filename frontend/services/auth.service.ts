import { api } from './api'
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest } from '@/types'

export const authService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<{ userId: string }>>('/auth/register', data),

  verifyPhone: (phone: string, code: string) =>
    api.post<ApiResponse<null>>('/auth/verify-phone', { phone, code }),

  sendPhoneOTP: (phone: string) =>
    api.post<ApiResponse<null>>('/auth/send-otp', { phone }),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword }),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; expiresIn: number }>>('/auth/refresh', { refreshToken }),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),

  getProfile: () =>
    api.get<ApiResponse<unknown>>('/auth/me'),

  updateProfile: (data: Record<string, unknown>) =>
    api.put<ApiResponse<unknown>>('/auth/me', data),
}
