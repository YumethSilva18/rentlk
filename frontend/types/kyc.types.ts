import type { KYCStatus, KYCDocument as BaseKYCDocument } from './user.types'

export type { KYCStatus }

export type DocumentType = 'nic' | 'passport' | 'driving_license'

export interface KYCVerificationDocument extends BaseKYCDocument {
  userId: string
  documentNumber: string
  frontImage: string
  backImage?: string
}

export interface KYCSelfie {
  id: string
  userId: string
  image: string
  status: KYCStatus
  submittedAt: string
}

export interface KYCApplication {
  id: string
  userId: string
  status: KYCStatus
  documents: KYCVerificationDocument[]
  selfie?: KYCSelfie
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface KYCFormData {
  documentType: DocumentType
  documentNumber: string
  frontImage: File | null
  backImage?: File | null
  selfie: File | null
}
