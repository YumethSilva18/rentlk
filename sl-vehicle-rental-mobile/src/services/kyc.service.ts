// ============================================================================
// KYC Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { KYCApplication, KYCFormData, KYCEligibility } from '@/types/kyc.types';
import type { KYCStatus } from '@/types/user.types';

class KYCService {
  async getStatus(): Promise<{ status: KYCStatus; application?: KYCApplication }> {
    const response = await api.get<ApiResponse<{ status: KYCStatus; application?: KYCApplication }>>(
      apiConfig.endpoints.kyc.status
    );
    return response.data!;
  }

  async submit(data: KYCFormData): Promise<KYCApplication> {
    // Create form data for file uploads
    const formData = new FormData();
    formData.append('documentType', data.documentType);
    formData.append('documentNumber', data.documentNumber);

    if (data.frontImage) {
      formData.append('frontImage', {
        uri: data.frontImage,
        type: 'image/jpeg',
        name: 'front.jpg',
      } as unknown as Blob);
    }

    if (data.backImage) {
      formData.append('backImage', {
        uri: data.backImage,
        type: 'image/jpeg',
        name: 'back.jpg',
      } as unknown as Blob);
    }

    if (data.selfie) {
      formData.append('selfie', {
        uri: data.selfie,
        type: 'image/jpeg',
        name: 'selfie.jpg',
      } as unknown as Blob);
    }

    const response = await api.post<ApiResponse<KYCApplication>>(
      apiConfig.endpoints.kyc.submit,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data!;
  }

  async resubmit(data: KYCFormData): Promise<KYCApplication> {
    const response = await api.post<ApiResponse<KYCApplication>>(
      apiConfig.endpoints.kyc.resubmit,
      data
    );
    return response.data!;
  }

  async getEligibility(): Promise<KYCEligibility> {
    const response = await api.get<ApiResponse<KYCEligibility>>(
      apiConfig.endpoints.kyc.eligibility
    );
    return response.data!;
  }
}

export const kycService = new KYCService();
