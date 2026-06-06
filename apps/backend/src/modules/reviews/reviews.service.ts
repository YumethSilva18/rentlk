import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { ReviewRepository } from '../../database/repositories/review.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { EventBusService } from '../../events/event-bus.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Create a review with eligibility checks:
   * - Booking must be COMPLETED
   * - User must be part of the booking (renter or owner)
   * - Only one review per booking
   * - Rating must be 1-5
   */
  async createReview(reviewerId: string, data: {
    bookingId: string;
    rating: number;
    comment?: string;
    vehicleId?: string;
  }) {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Validate comment length
    if (data.comment && data.comment.length > 1000) {
      throw new BadRequestException('Comment must be under 1000 characters');
    }

    const booking = await this.bookingRepo.findById(data.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    // Must be a COMPLETED booking
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed bookings');
    }

    const isRenter = booking.renterId === reviewerId;
    const isOwner = booking.ownerId === reviewerId;
    if (!isRenter && !isOwner) {
      throw new ForbiddenException('You are not part of this booking');
    }

    // Check for existing review
    const existing = await this.reviewRepo.findByBooking(data.bookingId);
    if (existing) {
      throw new BadRequestException('Review already submitted for this booking');
    }

    const revieweeId = isRenter ? booking.ownerId : booking.renterId;

    const review = await this.reviewRepo.create({
      bookingId: data.bookingId,
      reviewerId,
      revieweeId,
      vehicleId: data.vehicleId || booking.vehicleId,
      rating: data.rating,
      comment: data.comment,
    });

    // Update user's aggregate rating
    const ratingSummary = await this.reviewRepo.getAverageRating(revieweeId);
    this.logger.log(`User ${revieweeId} new rating: ${ratingSummary.average}`);

    // Emit event
    this.eventBus.emit('review:created', {
      reviewId: review.id,
      reviewerId,
      revieweeId,
      bookingId: data.bookingId,
      rating: data.rating,
    });

    return review;
  }

  async getReviewsForUser(userId: string, params?: { skip?: number; take?: number }) {
    const reviews = await this.reviewRepo.findByUser(userId, 'reviewee');
    const summary = await this.reviewRepo.getAverageRating(userId);

    return {
      reviews: params?.skip || params?.take
        ? reviews.slice(params?.skip || 0, (params?.skip || 0) + (params?.take || 20))
        : reviews,
      summary: {
        average: Math.round(summary.average * 10) / 10,
        count: summary.count,
        distribution: await this.getRatingDistribution(userId),
      },
    };
  }

  async getReviewsForVehicle(vehicleId: string, params?: { skip?: number; take?: number }) {
    const reviews = await this.reviewRepo.findByVehicle(vehicleId);
    const summary = await this.reviewRepo.getVehicleAverageRating(vehicleId);

    return {
      reviews: params?.skip || params?.take
        ? reviews.slice(params?.skip || 0, (params?.skip || 0) + (params?.take || 20))
        : reviews,
      summary: {
        average: Math.round(summary.average * 10) / 10,
        count: summary.count,
      },
    };
  }

  async getMyReviews(userId: string, params?: { skip?: number; take?: number }) {
    return this.reviewRepo.findByUser(userId, 'reviewer');
  }

  async getReviewById(id: string) {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  /**
   * Check if a user is eligible to review a booking.
   */
  async checkReviewEligibility(userId: string, bookingId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) return { eligible: false, reason: 'Booking not found' };

    const isParticipant = booking.renterId === userId || booking.ownerId === userId;
    if (!isParticipant) return { eligible: false, reason: 'Not a participant' };

    if (booking.status !== 'COMPLETED') {
      return { eligible: false, reason: 'Booking not completed' };
    }

    const existing = await this.reviewRepo.findByBooking(bookingId);
    if (existing) return { eligible: false, reason: 'Already reviewed' };

    return { eligible: true };
  }

  /**
   * Admin: hide/unhide a review (for moderation).
   */
  async moderateReview(reviewId: string, isPublic: boolean) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    return this.reviewRepo.update(reviewId, { isPublic });
  }

  private async getRatingDistribution(userId: string) {
    return this.reviewRepo.getRatingDistribution(userId);
  }
}
