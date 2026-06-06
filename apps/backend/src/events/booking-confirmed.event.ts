export class BookingConfirmedEvent {
  static readonly eventName = 'booking.confirmed';
  constructor(
    public readonly bookingId: string,
    public readonly renterId: string,
    public readonly ownerId: string,
    public readonly vehicleId: string,
  ) {}
}
