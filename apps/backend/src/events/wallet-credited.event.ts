export class WalletCreditedEvent {
  static readonly eventName = 'wallet.credited';
  constructor(
    public readonly walletId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly bookingId?: string,
    public readonly description?: string,
  ) {}
}
