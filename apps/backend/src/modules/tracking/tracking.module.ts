import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { TrackingRepository } from '../../database/repositories/tracking.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';

@Module({
  controllers: [TrackingController],
  providers: [TrackingService, TrackingRepository, BookingRepository],
  exports: [TrackingService],
})
export class TrackingModule {}
