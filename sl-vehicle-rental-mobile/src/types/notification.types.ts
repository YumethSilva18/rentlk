// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export type NotificationType =
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_completed'
  | 'payment_received'
  | 'payment_failed'
  | 'payment_refunded'
  | 'message_new'
  | 'review_new'
  | 'review_response'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'vehicle_approved'
  | 'vehicle_rejected'
  | 'tracking_alert'
  | 'system'
  | 'promotion';

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  bookingUpdates: boolean;
  paymentAlerts: boolean;
  messageAlerts: boolean;
  marketingEmails: boolean;
  trackingAlerts: boolean;
}

export interface UnreadCount {
  total: number;
  byType: Partial<Record<NotificationType, number>>;
}
