import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { TrackingRepository } from '../../database/repositories/tracking.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { EventBusService } from '../../events/event-bus.service';
import { GeoUtil } from '../../common/utils/geo.util';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private readonly SPEED_ALERT_THRESHOLD = 120; // km/h
  private readonly GEOFENCE_RADIUS_METERS = 5000; // 5km from pickup

  constructor(
    private readonly trackingRepo: TrackingRepository,
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Create a tracking session for an active booking.
   * Only the renter or owner can create a tracking session.
   */
  async createSession(userId: string, data: { bookingId: string; vehicleId: string; driverId?: string }) {
    const booking = await this.bookingRepo.findById(data.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    // Only participants can create tracking
    if (booking.renterId !== userId && booking.ownerId !== userId) {
      throw new ForbiddenException('Only booking participants can create tracking');
    }

    // Only for ACTIVE bookings
    if (booking.status !== 'ACTIVE') {
      throw new ForbiddenException('Tracking only available for active bookings');
    }

    const session = await this.trackingRepo.create({
      bookingId: data.bookingId,
      vehicleId: data.vehicleId,
      driverId: data.driverId || userId,
      status: 'ACTIVE',
      startTime: new Date(),
    });

    this.eventBus.emit('tracking:session:created', {
      sessionId: session.id,
      bookingId: data.bookingId,
    });

    return session;
  }

  /**
   * Add a location update with geofence and speed checks.
   */
  async addLocation(
    userId: string,
    sessionId: string,
    data: {
      latitude: number;
      longitude: number;
      speed?: number;
      heading?: number;
      accuracy?: number;
    },
  ) {
    const session = await this.trackingRepo.findById(sessionId);
    if (!session) throw new NotFoundException('Tracking session not found');

    // Verify user is the driver or session owner
    if (session.driverId && session.driverId !== userId) {
      throw new ForbiddenException('Only the driver can update location');
    }

    const location = await this.trackingRepo.addLocation({
      sessionId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed,
      heading: data.heading,
      accuracy: data.accuracy,
      timestamp: new Date(),
    });

    // Speed alert check
    if (data.speed && data.speed > this.SPEED_ALERT_THRESHOLD) {
      this.logger.warn(`Speed alert: ${data.speed} km/h in session ${sessionId}`);
      this.eventBus.emit('tracking:speed:alert', {
        sessionId,
        speed: data.speed,
        threshold: this.SPEED_ALERT_THRESHOLD,
        location: { latitude: data.latitude, longitude: data.longitude },
      });
    }

    // Emit real-time location update
    this.eventBus.emit('tracking:location:update', {
      sessionId,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: location.timestamp,
      },
    });

    return location;
  }

  /**
   * Get active sessions - admin can see all, users see only their own.
   */
  async getActiveSessions(userId?: string, isAdmin?: boolean) {
    if (isAdmin) {
      return this.trackingRepo.getActiveSessions();
    }
    // Filter to user's bookings only
    const sessions = await this.trackingRepo.getActiveSessions();
    return sessions.filter(
      (s: any) => s.booking?.renterId === userId || s.booking?.ownerId === userId,
    );
  }

  /**
   * Get session with access control check.
   */
  async getSessionById(id: string, userId?: string, isAdmin?: boolean) {
    const session = await this.trackingRepo.findById(id);
    if (!session) throw new NotFoundException('Tracking session not found');

    if (!isAdmin) {
      const booking = await this.bookingRepo.findById(session.bookingId);
      if (booking && booking.renterId !== userId && booking.ownerId !== userId) {
        throw new ForbiddenException('Access denied to this tracking session');
      }
    }

    return session;
  }

  async getSessionByBooking(bookingId: string) {
    return this.trackingRepo.findByBooking(bookingId);
  }

  /**
   * End a tracking session and calculate route statistics.
   */
  async endSession(
    userId: string,
    id: string,
    data?: { distanceKm?: number; avgSpeed?: number; maxSpeed?: number },
  ) {
    const session = await this.trackingRepo.findById(id);
    if (!session) throw new NotFoundException('Tracking session not found');

    // Calculate stats from locations if not provided
    let stats = data;
    if (!stats?.distanceKm) {
      stats = await this.calculateRouteStats(id);
    }

    const ended = await this.trackingRepo.endSession(id, {
      endTime: new Date(),
      distanceKm: stats?.distanceKm,
      avgSpeed: stats?.avgSpeed,
      maxSpeed: stats?.maxSpeed,
    });

    this.eventBus.emit('tracking:session:ended', {
      sessionId: id,
      bookingId: session.bookingId,
      stats,
    });

    return ended;
  }

  async getLocations(sessionId: string, params?: { skip?: number; take?: number }) {
    return this.trackingRepo.getLocations(sessionId, params);
  }

  /**
   * Get route summary for a completed tracking session.
   */
  async getRouteSummary(sessionId: string) {
    const session = await this.trackingRepo.findById(sessionId);
    if (!session) throw new NotFoundException('Tracking session not found');

    const locations = await this.trackingRepo.getLocations(sessionId, { take: 10000 });

    if (locations.length < 2) {
      return { distanceKm: 0, durationMinutes: 0, points: locations.length };
    }

    // Calculate total distance
    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      totalDistance += GeoUtil.haversineDistance(
        locations[i - 1].latitude,
        locations[i - 1].longitude,
        locations[i].latitude,
        locations[i].longitude,
      );
    }

    const duration = session.endTime
      ? (session.endTime.getTime() - session.startTime.getTime()) / 60000
      : (Date.now() - session.startTime.getTime()) / 60000;

    return {
      distanceKm: Math.round(totalDistance * 100) / 100,
      durationMinutes: Math.round(duration),
      avgSpeedKmh: duration > 0 ? Math.round((totalDistance / (duration / 60)) * 10) / 10 : 0,
      maxSpeedKmh: session.maxSpeed || 0,
      points: locations.length,
      startTime: session.startTime,
      endTime: session.endTime,
    };
  }

  /**
   * Check if a location is within the geofence of the pickup location.
   */
  async checkGeofence(sessionId: string, latitude: number, longitude: number) {
    const session = await this.trackingRepo.findById(sessionId);
    if (!session) throw new NotFoundException('Tracking session not found');

    // Get first location as pickup reference
    const locations = await this.trackingRepo.getLocations(sessionId, { take: 1 });
    if (locations.length === 0) {
      return { withinGeofence: true, distanceMeters: 0 };
    }

    const pickup = locations[0];
    const distanceMeters = GeoUtil.haversineDistance(
      pickup.latitude,
      pickup.longitude,
      latitude,
      longitude,
    ) * 1000;

    return {
      withinGeofence: distanceMeters <= this.GEOFENCE_RADIUS_METERS,
      distanceMeters: Math.round(distanceMeters),
      geofenceRadius: this.GEOFENCE_RADIUS_METERS,
    };
  }

  private async calculateRouteStats(sessionId: string) {
    const locations = await this.trackingRepo.getLocations(sessionId, { take: 10000 });
    if (locations.length < 2) return { distanceKm: 0, avgSpeed: 0, maxSpeed: 0 };

    let totalDistance = 0;
    let maxSpeed = 0;

    for (let i = 1; i < locations.length; i++) {
      totalDistance += GeoUtil.haversineDistance(
        locations[i - 1].latitude,
        locations[i - 1].longitude,
        locations[i].latitude,
        locations[i].longitude,
      );
      if (locations[i].speed && locations[i].speed! > maxSpeed) {
        maxSpeed = locations[i].speed!;
      }
    }

    return {
      distanceKm: Math.round(totalDistance * 100) / 100,
      avgSpeed: locations.length > 1 ? Math.round((totalDistance / locations.length) * 100) / 100 : 0,
      maxSpeed,
    };
  }
}
