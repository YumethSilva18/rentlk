import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { VehicleRepository } from '../../database/repositories/vehicle.repository';
import { S3Service } from '../../integrations/storage/s3.service';
import { GeocodingService } from '../../integrations/maps/geocoding.service';
import { GoogleMapsService } from '../../integrations/maps/google-maps.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EventBusService } from '../../events/event-bus.service';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(
    private readonly vehicleRepo: VehicleRepository,
    private readonly s3Service: S3Service,
    private readonly geocodingService: GeocodingService,
    private readonly googleMaps: GoogleMapsService,
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async getVehicle(id: string) {
    const vehicle = await this.vehicleRepo.findById(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async createVehicle(ownerId: string, data: any) {
    const geo = await this.geocodingService.forwardGeocode(`${data.city}, ${data.district}, Sri Lanka`);
    const vehicle = await this.vehicleRepo.create({
      ...data,
      owner: { connect: { id: ownerId } },
      latitude: geo?.lat,
      longitude: geo?.lng,
    });

    this.eventBus.emit('vehicle:created', { vehicleId: vehicle.id, ownerId });
    return vehicle;
  }

  async updateVehicle(vehicleId: string, ownerId: string, data: any) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('You can only edit your own vehicles');

    // If city/district changed, recalculate geolocation
    if (data.city || data.district) {
      const geo = await this.geocodingService.forwardGeocode(
        `${data.city || vehicle.city}, ${data.district || vehicle.district}, Sri Lanka`,
      );
      data.latitude = geo?.lat;
      data.longitude = geo?.lng;
    }

    return this.vehicleRepo.update(vehicleId, data);
  }

  async deleteVehicle(vehicleId: string, ownerId: string) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('You can only delete your own vehicles');

    // Soft delete by setting INACTIVE
    return this.vehicleRepo.updateStatus(vehicleId, 'INACTIVE');
  }

  async getMyVehicles(ownerId: string, params?: { status?: string; skip?: number; take?: number }) {
    return this.vehicleRepo.findByOwner(ownerId, params);
  }

  /**
   * Get owner dashboard stats for a specific vehicle or all vehicles.
   */
  async getOwnerStats(ownerId: string) {
    const vehicles = await this.vehicleRepo.findByOwner(ownerId);

    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v: any) => v.status === 'ACTIVE').length;
    const totalBookings = vehicles.reduce((sum: number, v: any) => sum + (v.bookingCount || 0), 0);
    const avgRating = totalVehicles > 0
      ? vehicles.reduce((sum: number, v: any) => sum + (v.rating || 0), 0) / totalVehicles
      : 0;

    return {
      totalVehicles,
      activeVehicles,
      totalBookings,
      averageRating: Math.round(avgRating * 10) / 10,
      vehicles: vehicles.map((v: any) => ({
        id: v.id,
        title: v.title,
        status: v.status,
        bookingCount: v.bookingCount,
        rating: v.rating,
        dailyRate: v.dailyRate,
      })),
    };
  }

  async searchVehicles(params: {
    startDate?: string;
    endDate?: string;
    city?: string;
    district?: string;
    type?: string;
    minRate?: number;
    maxRate?: number;
    seats?: number;
    transmission?: string;
    fuelType?: string;
    features?: string[];
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
    page?: number;
    limit?: number;
  }) {
    const skip = ((params.page || 1) - 1) * (params.limit || 20);
    const startDate = params.startDate ? new Date(params.startDate) : new Date();
    const endDate = params.endDate ? new Date(params.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return this.vehicleRepo.searchAvailable({
      startDate,
      endDate,
      city: params.city,
      type: params.type,
      minRate: params.minRate,
      maxRate: params.maxRate,
      seats: params.seats,
      transmission: params.transmission,
      fuelType: params.fuelType,
      skip,
      take: params.limit || 20,
    });
  }

  // --- Image Management ---

  async uploadImage(
    vehicleId: string,
    ownerId: string,
    file: Express.Multer.File,
    options?: { isPrimary?: boolean; order?: number },
  ) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('Forbidden');

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image must be under 5MB');
    }

    const key = this.s3Service.generateKey('vehicles', file.originalname);
    const url = await this.s3Service.uploadFile(key, file.buffer, file.mimetype);

    return this.vehicleRepo.addImage(vehicleId, {
      url,
      vehicle: { connect: { id: vehicleId } },
      isPrimary: options?.isPrimary || false,
      order: options?.order || 0,
    });
  }

  async deleteImage(vehicleId: string, ownerId: string, imageId: string) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('Forbidden');

    return this.prisma.vehicleImage.delete({ where: { id: imageId } });
  }

  async reorderImages(vehicleId: string, ownerId: string, imageOrders: { id: string; order: number }[]) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('Forbidden');

    const updates = imageOrders.map((img) =>
      this.prisma.vehicleImage.update({ where: { id: img.id }, data: { order: img.order } }),
    );
    await Promise.all(updates);
    return { success: true };
  }

  // --- Features ---

  async addFeature(vehicleId: string, ownerId: string, name: string) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('Forbidden');

    return this.vehicleRepo.addFeature(vehicleId, name);
  }

  async removeFeature(vehicleId: string, ownerId: string, name: string) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('Forbidden');

    return this.vehicleRepo.removeFeature(vehicleId, name);
  }

  // --- Availability Management ---

  async setAvailability(
    vehicleId: string,
    ownerId: string,
    data: { startDate: string; endDate: string; isBlocked?: boolean; reason?: string },
  ) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('Forbidden');

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.prisma.vehicleAvailability.create({
      data: {
        vehicleId,
        startDate,
        endDate,
        isBlocked: data.isBlocked || false,
        reason: data.reason,
      },
    });
  }

  async removeAvailability(vehicleId: string, ownerId: string, availabilityId: string) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId !== ownerId) throw new ForbiddenException('Forbidden');

    return this.prisma.vehicleAvailability.delete({ where: { id: availabilityId } });
  }

  async getAvailability(vehicleId: string, params?: { startDate?: string; endDate?: string }) {
    const where: any = { vehicleId };
    if (params?.startDate || params?.endDate) {
      where.startDate = {};
      if (params.startDate) where.startDate.gte = new Date(params.startDate);
      if (params.endDate) where.startDate.lte = new Date(params.endDate);
    }
    return this.prisma.vehicleAvailability.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });
  }

  // --- Featured & Public ---

  async getFeaturedVehicles(limit: number = 6) {
    return this.vehicleRepo.findMany({
      take: limit,
      where: { status: 'ACTIVE', rating: { gte: 4 } },
      orderBy: { rating: 'desc' },
    });
  }

  async getVehicleTypes() {
    return [
      { value: 'CAR', label: 'Car' },
      { value: 'VAN', label: 'Van' },
      { value: 'SUV', label: 'SUV' },
      { value: 'MOTORCYCLE', label: 'Motorcycle' },
      { value: 'TUKTUK', label: 'Tuk-Tuk' },
      { value: 'LUXURY', label: 'Luxury' },
      { value: 'COMMERCIAL', label: 'Commercial' },
    ];
  }
}
