import { Injectable } from '@nestjs/common';
import { BookingRepository as DbBookingRepository } from '../../../database/repositories/booking.repository';

@Injectable()
export class BookingsRepository extends DbBookingRepository {}
