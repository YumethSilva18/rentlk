export class FraudDetectedEvent {
  static readonly eventName = 'fraud.detected';
  constructor(
    public readonly alertId: string,
    public readonly userId?: string,
    public readonly bookingId?: string,
    public readonly type?: string,
    public readonly severity?: string,
    public readonly score?: number,
  ) {}
}
