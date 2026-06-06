export interface User {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  kycStatus: 'not_started' | 'pending' | 'in_review' | 'approved' | 'rejected'
  isVerified: boolean
  role: 'user' | 'admin'
  rating?: number
  totalReviews?: number
  joinedAt: string
  lastActive?: string
}

export interface UserProfile extends User {
  bio?: string
  address?: string
  city?: string
  dateOfBirth?: string
  drivingLicenseNumber?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  badges?: string[]
  totalBookings: number
  totalListings: number
  totalEarnings: number
  responseRate?: number
  responseTime?: string
}

export interface KYCDocument {
  id: string
  type: 'id_card' | 'drivers_license' | 'selfie' | 'passport'
  url: string
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface KYCSubmission {
  userId: string
  idCard: File | string
  driversLicense: File | string
  selfie: File | string
  status: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  documents?: KYCDocument[]
}

export type UserRole = 'user' | 'admin'
export type KYCStatus = 'not_started' | 'pending' | 'in_review' | 'approved' | 'rejected'
