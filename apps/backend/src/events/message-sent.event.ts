export class MessageSentEvent {
  static readonly eventName = 'message.sent';
  constructor(
    public readonly messageId: string,
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly bookingId?: string,
  ) {}
}
