export class NotificationSentEvent {
  static readonly eventName = 'notification.sent';
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly title: string,
    public readonly message: string,
  ) {}
}
