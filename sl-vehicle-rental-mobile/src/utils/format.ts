// ============================================================================
// Format Utils - String and data formatting utilities
// ============================================================================

/**
 * Truncate a string with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Format a number with commas (e.g., 1000 -> 1,000)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-LK');
};

/**
 * Format file size (bytes -> human readable)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

/**
 * Format phone number for display (Sri Lankan format)
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('94')) {
    return `+94 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};

/**
 * Format rating for display (e.g., 4.5 -> "4.5")
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Mask email for privacy (e.g., "john.doe@example.com" -> "j***e@example.com")
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
};

/**
 * Mask card number (e.g., "4111111111111111" -> "**** **** **** 1111")
 */
export const maskCardNumber = (lastFour: string): string => {
  return `**** **** **** ${lastFour}`;
};

/**
 * Pluralize a word based on count
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  return count === 1 ? singular : (plural || `${singular}s`);
};

/**
 * Get booking status display label
 */
export const getBookingStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

/**
 * Get KYC status display label
 */
export const getKycStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    not_started: 'Not Started',
    pending: 'Pending',
    in_review: 'In Review',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return labels[status] || status;
};

/**
 * Get payment status display label
 */
export const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    refunded: 'Refunded',
  };
  return labels[status] || status;
};
