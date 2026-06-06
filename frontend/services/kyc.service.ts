import { api } from './api'
import type { ApiResponse, KYCApplication, KYCFormData } from '@/types'

export const kycService = {
  getStatus: () =>
    api.get<ApiResponse<KYCApplication>>('/kyc/status'),

  submit: (data: KYCFormData) => {
    const formData = new FormData()
    formData.append('documentType', data.documentType)
    formData.append('documentNumber', data.documentNumber)
    if (data.frontImage) formData.append('frontImage', data.frontImage)
    if (data.backImage) formData.append('backImage', data.backImage)
    if (data.selfie) formData.append('selfie', data.selfie)
    return api.post<ApiResponse<KYCApplication>>('/kyc/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  uploadDocument: (type: string, file: File) => {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('file', file)
    return api.post<ApiResponse<unknown>>('/kyc/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  updateDocument: (documentId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.put<ApiResponse<unknown>>(`/kyc/documents/${documentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getDocuments: () =>
    api.get<ApiResponse<unknown[]>>('/kyc/documents'),

  deleteDocument: (documentId: string) =>
    api.delete<ApiResponse<null>>(`/kyc/documents/${documentId}`),
}
