// ============================================================================
// Review Types - Ported from web frontend
// ============================================================================

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  targetId: string;
  targetType: 'vehicle' | 'owner' | 'renter';
  rating: number;
  title?: string;
  comment: string;
  categories: ReviewCategory[];
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  response?: ReviewResponse;
  createdAt: string;
}

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface ReviewResponse {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface RatingSummary {
  average: number;
  total: number;
  distribution: Record<number, number>;
  categories: {
    name: string;
    average: number;
  }[];
}

/** Mobile-specific: images are string URIs */
export interface ReviewFormData {
  bookingId: string;
  targetId: string;
  targetType: 'vehicle' | 'owner' | 'renter';
  rating: number;
  title?: string;
  comment: string;
  categories: { name: string; rating: number }[];
  images?: string[]; // URIs on mobile
}

export interface ReviewEligibility {
  eligible: boolean;
  bookingId?: string;
  reason?: string;
}
