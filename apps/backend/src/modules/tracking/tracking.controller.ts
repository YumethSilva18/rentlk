import {
  Controller, Get, Post, Put, Body, Param, Query,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateTrackingSessionDto, LocationUpdateDto } from './dtos/tracking.dto';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('sessions')
  async createSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTrackingSessionDto,
  ) {
    return this.trackingService.createSession(userId, dto);
  }

  @Get('sessions/active')
  async getActiveSessions(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    return this.trackingService.getActiveSessions(userId, isAdmin);
  }

  @Get('sessions/:id')
  async getSession(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    return this.trackingService.getSessionById(id, userId, isAdmin);
  }

  @Get('sessions/booking/:bookingId')
  async getSessionByBooking(@Param('bookingId') bookingId: string) {
    return this.trackingService.getSessionByBooking(bookingId);
  }

  @Put('sessions/:id/end')
  async endSession(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() data: { distanceKm?: number; avgSpeed?: number; maxSpeed?: number },
  ) {
    return this.trackingService.endSession(userId, id, data);
  }

  @Post('sessions/:id/locations')
  async addLocation(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: LocationUpdateDto,
  ) {
    return this.trackingService.addLocation(userId, id, dto);
  }

  @Get('sessions/:id/locations')
  async getLocations(
    @Param('id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.trackingService.getLocations(id, {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Get('sessions/:id/route-summary')
  async getRouteSummary(@Param('id') id: string) {
    return this.trackingService.getRouteSummary(id);
  }

  @Post('sessions/:id/geofence-check')
  async checkGeofence(
    @Param('id') id: string,
    @Body() data: { latitude: number; longitude: number },
  ) {
    return this.trackingService.checkGeofence(id, data.latitude, data.longitude);
  }
}
