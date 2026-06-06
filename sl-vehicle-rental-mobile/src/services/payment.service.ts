// ============================================================================
// Payment Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type {
  PaymentTransaction,
  PaymentMethodInfo,
  PaymentRequest,
  PaymentResponse,
} from '@/types/payment.types';

class PaymentService {
  async create(data: PaymentRequest): Promise<PaymentResponse> {
    const response = await api.post<ApiResponse<PaymentResponse>>(
      apiConfig.endpoints.payments.create,
      data
    );
    return response.data!;
  }

  async verify(id: string): Promise<PaymentTransaction> {
    const response = await api.post<ApiResponse<PaymentTransaction>>(
      apiConfig.endpoints.payments.verify(id)
    );
    return response.data!;
  }

  async getMethods(): Promise<PaymentMethodInfo[]> {
    const response = await api.get<ApiResponse<PaymentMethodInfo[]>>(
      apiConfig.endpoints.payments.methods
    );
    return response.data || [];
  }

  async addMethod(data: Partial<PaymentMethodInfo>): Promise<PaymentMethodInfo> {
    const response = await api.post<ApiResponse<PaymentMethodInfo>>(
      apiConfig.endpoints.payments.addMethod,
      data
    );
    return response.data!;
  }

  async removeMethod(id: string): Promise<void> {
    await api.delete(apiConfig.endpoints.payments.removeMethod(id));
  }

  async getHistory(params?: PaginationParams): Promise<PaginatedResponse<PaymentTransaction>> {
    return api.get<PaginatedResponse<PaymentTransaction>>(
      apiConfig.endpoints.payments.history,
      { params }
    );
  }
}

export const paymentService = new PaymentService();
