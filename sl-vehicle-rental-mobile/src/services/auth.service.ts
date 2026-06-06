// ============================================================================
// Auth Service
// ============================================================================

import * as SecureStore from 'expo-secure-store';
import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import { securityConfig } from '@/config/security.config';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ApiResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyPhoneRequest,
} from '@/types/api.types';
import type { User } from '@/types/user.types';

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      apiConfig.endpoints.auth.login,
      data
    );
    const loginData = response.data!;

    // Store tokens securely
    await SecureStore.setItemAsync(
      securityConfig.storageKeys.accessToken,
      loginData.accessToken
    );
    await SecureStore.setItemAsync(
      securityConfig.storageKeys.refreshToken,
      loginData.refreshToken
    );
    await SecureStore.setItemAsync(
      securityConfig.storageKeys.tokenExpiry,
      String(Date.now() + loginData.expiresIn * 1000)
    );

    return loginData;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      apiConfig.endpoints.auth.register,
      data
    );
    const loginData = response.data!;

    await SecureStore.setItemAsync(
      securityConfig.storageKeys.accessToken,
      loginData.accessToken
    );
    await SecureStore.setItemAsync(
      securityConfig.storageKeys.refreshToken,
      loginData.refreshToken
    );
    await SecureStore.setItemAsync(
      securityConfig.storageKeys.tokenExpiry,
      String(Date.now() + loginData.expiresIn * 1000)
    );

    return loginData;
  }

  async logout(): Promise<void> {
    try {
      await api.post(apiConfig.endpoints.auth.logout);
    } catch {
      // Ignore errors on logout
    } finally {
      await this.clearTokens();
    }
  }

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(apiConfig.endpoints.auth.me);
    return response.data!;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await api.post(apiConfig.endpoints.auth.forgotPassword, data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await api.post(apiConfig.endpoints.auth.resetPassword, data);
  }

  async verifyPhone(data: VerifyPhoneRequest): Promise<void> {
    await api.post(apiConfig.endpoints.auth.verifyPhone, data);
  }

  async resendOtp(phone: string): Promise<void> {
    await api.post(apiConfig.endpoints.auth.resendOtp, { phone });
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(securityConfig.storageKeys.accessToken);
    const expiry = await SecureStore.getItemAsync(securityConfig.storageKeys.tokenExpiry);
    if (!token || !expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  }

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(securityConfig.storageKeys.accessToken);
  }

  private async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.accessToken);
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.refreshToken);
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.tokenExpiry);
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.biometricEnabled);
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.pinHash);
  }
}

export const authService = new AuthService();
