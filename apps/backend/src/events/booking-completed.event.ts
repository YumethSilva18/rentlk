export class BookingCompletedEvent {
  static readonly eventName = 'booking.completed';
  constructor(
    public readonly bookingId: string,
    public readonly renterId: string,
    public readonly ownerId: string,
    public readonly vehicleId: string,
    public readonly totalAmount: number,
  ) {}
}
