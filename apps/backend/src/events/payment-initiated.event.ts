export class PaymentInitiatedEvent {
  static readonly eventName = 'payment.initiated';
  constructor(
    public readonly paymentId: string,
    public readonly bookingId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly method: string,
  ) {}
}
