import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { NotificationRepository } from '../../database/repositories/notification.repository';
import { UserPreferenceRepository } from '../../database/repositories/user-preference.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { SesService } from '../../integrations/email/ses.service';
import { DialogSmsService } from '../../integrations/sms/dialog-sms.service';
import { EventBusService } from '../../events/event-bus.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly preferenceRepo: UserPreferenceRepository,
    private readonly userRepo: UserRepository,
    private readonly sesService: SesService,
    private readonly smsService: DialogSmsService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Create an in-app notification and dispatch via email/SMS/push
   * based on user preferences.
   */
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    channels?: ('inApp' | 'email' | 'sms' | 'push')[];
  }) {
    // Check if user wants this notification type
    const shouldNotify = await this.preferenceRepo.shouldNotify(data.userId, data.type);
    if (!shouldNotify) {
      this.logger.debug(`Notification suppressed for user ${data.userId} type ${data.type}`);
      return { suppressed: true, reason: 'User preference' };
    }

    // Always create in-app notification
    const notification = await this.notificationRepo.create({
      userId: data.userId,
      type: data.type as any,
      title: data.title,
      message: data.message,
      data: data.data,
    });

    // Determine channels
    const channels = data.channels || this.getDefaultChannels(data.type);
    const prefs = await this.preferenceRepo.getNotificationPreferences(data.userId);

    // Dispatch via additional channels
    if (channels.includes('email') && prefs.emailNotifications) {
      await this.sendEmailNotification(data.userId, data.title, data.message);
    }

    if (channels.includes('sms') && prefs.smsNotifications) {
      await this.sendSmsNotification(data.userId, data.message);
    }

    if (channels.includes('push') && prefs.pushNotifications) {
      await this.sendPushNotification(data.userId, data.title, data.message, data.data);
    }

    // Emit event for other listeners
    this.eventBus.emit('notification:created', {
      notificationId: notification.id,
      userId: data.userId,
      type: data.type,
    });

    return notification;
  }

  /**
   * Send booking-related notification to both renter and owner.
   */
  async sendBookingNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    bookingId: string,
  ) {
    return this.createNotification({
      userId,
      type,
      title,
      message,
      data: { bookingId },
    });
  }

  /**
   * Send notification to multiple users (e.g., both parties in a booking).
   */
  async notifyMultiple(
    userIds: string[],
    type: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) {
    const results = await Promise.allSettled(
      userIds.map((userId) =>
        this.createNotification({ userId, type, title, message, data }),
      ),
    );
    return {
      sent: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
    };
  }

  async getUserNotifications(
    userId: string,
    params?: { unreadOnly?: boolean; type?: string; skip?: number; take?: number },
  ) {
    const notifications = await this.notificationRepo.findByUser(userId, {
      isRead: params?.unreadOnly ? false : undefined,
      skip: params?.skip,
      take: params?.take,
    });

    const unreadCount = await this.notificationRepo.countUnread(userId);

    return {
      notifications,
      unreadCount,
      total: notifications.length,
      page: Math.floor((params?.skip || 0) / (params?.take || 20)) + 1,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException('Not your notification');
    return this.notificationRepo.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepo.countUnread(userId);
    return { count };
  }

  async getNotificationSummary(userId: string) {
    const unreadCount = await this.notificationRepo.countUnread(userId);
    const totalCount = await this.notificationRepo.count({ userId });
    const prefs = await this.preferenceRepo.getNotificationPreferences(userId);

    return {
      unread: unreadCount,
      total: totalCount,
      preferences: prefs,
    };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) throw new ForbiddenException('Not your notification');
    await this.notificationRepo.delete(notificationId);
    return { success: true };
  }

  async clearReadNotifications(userId: string) {
    const count = await this.notificationRepo.deleteReadByUser(userId);
    return { success: true, deleted: count };
  }

  // --- Private channel dispatchers ---

  private async sendEmailNotification(userId: string, title: string, message: string) {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user?.email) return;
      await this.sesService.sendEmail({
        to: user.email,
        subject: `[RentLK] ${title}`,
        html: `<div style="font-family:sans-serif"><h2>${title}</h2><p>${message}</p><hr><p style="color:#888;font-size:12px">RentLK - Sri Lanka's Vehicle Rental Marketplace</p></div>`,
      });
    } catch (error) {
      this.logger.error(`Email notification failed for user ${userId}: ${error}`);
    }
  }

  private async sendSmsNotification(userId: string, message: string) {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user?.phoneNumber) return;
      await this.smsService.sendSms(user.phoneNumber, `[RentLK] ${message}`);
    } catch (error) {
      this.logger.error(`SMS notification failed for user ${userId}: ${error}`);
    }
  }

  private async sendPushNotification(
    userId: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) {
    try {
      // Push notification hook - integrate with FCM/APNs in production
      this.logger.debug(`Push notification to ${userId}: ${title}`);
      this.eventBus.emit('push:send', { userId, title, body: message, data });
    } catch (error) {
      this.logger.error(`Push notification failed for user ${userId}: ${error}`);
    }
  }

  private getDefaultChannels(type: string): ('inApp' | 'email' | 'sms' | 'push')[] {
    switch (type) {
      case 'BOOKING_REQUEST':
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_CANCELLED':
        return ['inApp', 'email', 'push'];
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_FAILED':
        return ['inApp', 'email', 'sms'];
      case 'KYC_APPROVED':
      case 'KYC_REJECTED':
        return ['inApp', 'email'];
      case 'NEW_MESSAGE':
        return ['inApp', 'push'];
      case 'REVIEW_RECEIVED':
        return ['inApp', 'push'];
      case 'FRAUD_ALERT':
        return ['inApp', 'email', 'sms'];
      case 'SYSTEM':
        return ['inApp'];
      default:
        return ['inApp'];
    }
  }
}
