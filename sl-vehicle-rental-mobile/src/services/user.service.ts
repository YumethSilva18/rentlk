// ============================================================================
// User Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { UserProfile } from '@/types/user.types';

class UserService {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>(apiConfig.endpoints.users.profile);
    return response.data!;
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.put<ApiResponse<UserProfile>>(
      apiConfig.endpoints.users.update,
      data
    );
    return response.data!;
  }

  async updatePreferences(preferences: Record<string, unknown>): Promise<void> {
    await api.put(apiConfig.endpoints.users.preferences, preferences);
  }
}

export const userService = new UserService();
