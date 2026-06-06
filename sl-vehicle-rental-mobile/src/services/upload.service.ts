// ============================================================================
// Upload Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';

interface UploadResponse {
  url: string;
  key?: string;
  size?: number;
  type?: string;
}

class UploadService {
  async uploadImage(uri: string, type = 'vehicle'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `upload_${Date.now()}.jpg`,
    } as unknown as Blob);
    formData.append('type', type);

    const response = await api.post<ApiResponse<UploadResponse>>(
      apiConfig.endpoints.upload.image,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data!;
  }

  async uploadDocument(uri: string, type: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'application/pdf',
      name: `doc_${Date.now()}.pdf`,
    } as unknown as Blob);
    formData.append('type', type);

    const response = await api.post<ApiResponse<UploadResponse>>(
      apiConfig.endpoints.upload.document,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data!;
  }

  async uploadMultiple(uris: string[], type = 'vehicle'): Promise<UploadResponse[]> {
    const formData = new FormData();
    uris.forEach((uri, index) => {
      formData.append('files', {
        uri,
        type: 'image/jpeg',
        name: `upload_${index}_${Date.now()}.jpg`,
      } as unknown as Blob);
    });
    formData.append('type', type);

    const response = await api.post<ApiResponse<UploadResponse[]>>(
      apiConfig.endpoints.upload.multiple,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data || [];
  }
}

export const uploadService = new UploadService();
