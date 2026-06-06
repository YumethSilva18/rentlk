import { api } from './api'
import type { ApiResponse, User, UserProfile } from '@/types'

export const userService = {
  getProfile: (userId: string) =>
    api.get<ApiResponse<UserProfile>>(`/users/${userId}`),

  updateProfile: (userId: string, data: Partial<UserProfile>) =>
    api.put<ApiResponse<UserProfile>>(`/users/${userId}`, data),

  uploadAvatar: (userId: string, file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post<ApiResponse<{ url: string }>>(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getPublicProfile: (userId: string) =>
    api.get<ApiResponse<Pick<User, 'id' | 'name' | 'avatar' | 'rating' | 'totalReviews'>>>(`/users/${userId}/public`),

  deleteAccount: (userId: string) =>
    api.delete<ApiResponse<null>>(`/users/${userId}`),

  changePassword: (userId: string, currentPassword: string, newPassword: string) =>
    api.put<ApiResponse<null>>(`/users/${userId}/password`, { currentPassword, newPassword }),
}
