import { Controller, Get, Post, Put, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.bookingsService.createBooking(userId, data);
  }

  @Get('my/renter')
  async getMyBookingsAsRenter(@CurrentUser('id') userId: string, @Query('status') status?: string) {
    return this.bookingsService.getMyBookingsAsRenter(userId, status);
  }

  @Get('my/owner')
  async getMyBookingsAsOwner(@CurrentUser('id') userId: string, @Query('status') status?: string) {
    return this.bookingsService.getMyBookingsAsOwner(userId, status);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.getBooking(id);
  }

  @Get(':id/timeline')
  async getBookingTimeline(@Param('id') id: string) {
    return this.bookingsService.getBookingWithTimeline(id);
  }

  @Get(':id/history')
  async getStatusHistory(@Param('id') id: string) {
    return this.bookingsService.getStatusHistory(id);
  }

  @Get(':id/invoice')
  async getInvoice(@Param('id') id: string) {
    return this.bookingsService.generateInvoice(id);
  }

  @Put(':id/confirm')
  async confirmBooking(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.confirmBooking(id, userId);
  }

  @Put(':id/start')
  async startBooking(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.startBooking(id, userId);
  }

  @Put(':id/complete')
  async completeBooking(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.completeBooking(id, userId);
  }

  @Put(':id/cancel')
  async cancelBooking(@Param('id') id: string, @CurrentUser('id') userId: string, @Body('reason') reason: string) {
    return this.bookingsService.cancelBooking(id, userId, reason);
  }

  @Put(':id/dispute')
  async disputeBooking(@Param('id') id: string, @CurrentUser('id') userId: string, @Body('reason') reason: string) {
    return this.bookingsService.disputeBooking(id, userId, reason);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put(':id/admin-status')
  async adminForceStatus(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('status') status: string,
    @Body('reason') reason: string,
  ) {
    return this.bookingsService.adminForceStatus(id, adminId, status, reason);
  }
}
