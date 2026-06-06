// ============================================================================
// User Types - Ported from web frontend, adapted for React Native
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  kycStatus: KYCStatus;
  isVerified: boolean;
  role: UserRole;
  rating?: number;
  totalReviews?: number;
  joinedAt: string;
  lastActive?: string;
}

export interface UserProfile extends User {
  bio?: string;
  address?: string;
  city?: string;
  dateOfBirth?: string;
  drivingLicenseNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  badges?: string[];
  totalBookings: number;
  totalListings: number;
  totalEarnings: number;
  responseRate?: number;
  responseTime?: string;
}

export interface KYCDocument {
  id: string;
  type: 'id_card' | 'drivers_license' | 'selfie' | 'passport';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

/** Mobile-specific: uses string URI instead of File */
export interface KYCSubmission {
  userId: string;
  idCard: string; // URI on mobile
  driversLicense: string; // URI on mobile
  selfie: string; // URI on mobile
  status: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  documents?: KYCDocument[];
}

export type UserRole = 'user' | 'admin';
export type KYCStatus = 'not_started' | 'pending' | 'in_review' | 'approved' | 'rejected';
