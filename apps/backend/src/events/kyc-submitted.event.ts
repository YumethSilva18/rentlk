export class KycSubmittedEvent {
  static readonly eventName = 'kyc.submitted';
  constructor(
    public readonly kycId: string,
    public readonly userId: string,
    public readonly type: string,
  ) {}
}
