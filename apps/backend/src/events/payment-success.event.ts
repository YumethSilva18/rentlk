export class PaymentSuccessEvent {
  static readonly eventName = 'payment.success';
  constructor(
    public readonly paymentId: string,
    public readonly bookingId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly gatewayRef: string,
  ) {}
}
