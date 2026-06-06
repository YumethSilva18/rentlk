// ============================================================================
// API Service - Central Axios instance with interceptors
// ============================================================================

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { apiConfig } from '@/config/api.config';
import { securityConfig } from '@/config/security.config';
import type { ApiError } from '@/types/api.types';

class ApiService {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: apiConfig.baseUrl,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: attach access token
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await SecureStore.getItemAsync(
            securityConfig.storageKeys.accessToken
          );
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // Token not available
        }

        // Dev mode logging
        if (__DEV__) {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401 + token refresh
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log(`[API] ${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request until refresh completes
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.refreshSubscribers.forEach((cb) => cb(newToken));
            this.refreshSubscribers = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.instance(originalRequest);
          } catch {
            // Refresh failed - clear tokens and force re-login
            await this.clearTokens();
            this.refreshSubscribers = [];
            return Promise.reject(new Error('Session expired. Please login again.'));
          } finally {
            this.isRefreshing = false;
          }
        }

        // Normalize error
        const apiError = this.normalizeError(error);
        return Promise.reject(apiError);
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await SecureStore.getItemAsync(
      securityConfig.storageKeys.refreshToken
    );

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${apiConfig.baseUrl}${apiConfig.endpoints.auth.refreshToken}`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;

    await SecureStore.setItemAsync(securityConfig.storageKeys.accessToken, accessToken);
    if (newRefreshToken) {
      await SecureStore.setItemAsync(securityConfig.storageKeys.refreshToken, newRefreshToken);
    }
    await SecureStore.setItemAsync(
      securityConfig.storageKeys.tokenExpiry,
      String(Date.now() + expiresIn * 1000)
    );

    return accessToken;
  }

  private async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.accessToken);
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.refreshToken);
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.tokenExpiry);
  }

  private normalizeError(error: AxiosError): ApiError {
    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
      return {
        message: (data.message as string) || (data.error as string) || 'An error occurred',
        code: (data.code as string) || String(error.response.status),
        field: data.field as string | undefined,
      };
    }

    if (error.code === 'ECONNABORTED') {
      return { message: 'Request timed out. Please check your connection.', code: 'TIMEOUT' };
    }

    if (!error.response) {
      return { message: 'Network error. Please check your connection.', code: 'NETWORK_ERROR' };
    }

    return {
      message: `Request failed with status ${error.response.status}`,
      code: String(error.response.status),
    };
  }

  // Public methods
  get axiosInstance(): AxiosInstance {
    return this.instance;
  }

  get = <T>(url: string, config?: Parameters<AxiosInstance['get']>[1]) =>
    this.instance.get<T>(url, config).then((res) => res.data);

  post = <T>(url: string, data?: unknown, config?: Parameters<AxiosInstance['post']>[2]) =>
    this.instance.post<T>(url, data, config).then((res) => res.data);

  put = <T>(url: string, data?: unknown, config?: Parameters<AxiosInstance['put']>[2]) =>
    this.instance.put<T>(url, data, config).then((res) => res.data);

  patch = <T>(url: string, data?: unknown, config?: Parameters<AxiosInstance['patch']>[2]) =>
    this.instance.patch<T>(url, data, config).then((res) => res.data);

  delete = <T>(url: string, config?: Parameters<AxiosInstance['delete']>[1]) =>
    this.instance.delete<T>(url, config).then((res) => res.data);
}

// Singleton instance
export const api = new ApiService();
