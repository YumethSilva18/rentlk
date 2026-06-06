import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewRepository } from '../../database/repositories/review.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository, BookingRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
