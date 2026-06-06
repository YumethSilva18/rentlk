import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { UserRepository } from '../../database/repositories/user.repository';
import { SavedVehicleRepository } from '../../database/repositories/saved-vehicle.repository';
import { UserPreferenceRepository } from '../../database/repositories/user-preference.repository';
import { S3Service } from '../../integrations/storage/s3.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly savedVehicleRepo: SavedVehicleRepository,
    private readonly preferenceRepo: UserPreferenceRepository,
    private readonly s3Service: S3Service,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, refreshToken, lockedUntil, loginAttempts, ...profile } = user;

    // Get preferences
    const preferences = await this.preferenceRepo.findByUserId(userId);

    return { ...profile, preferences };
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      address?: string;
      city?: string;
      district?: string;
      preferredLanguage?: string;
    },
  ) {
    const updateData: any = { ...data };
    // Don't allow updating sensitive fields
    delete updateData.passwordHash;
    delete updateData.role;
    delete updateData.isVerified;

    return this.userRepo.update(userId, updateData);
  }

  async getPublicProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      rating: user.rating,
      reviewCount: user.reviewCount,
      profileImage: user.profileImage,
    };
  }

  async findByPhone(phoneNumber: string) {
    return this.userRepo.findByPhone(phoneNumber);
  }

  async deactivateAccount(userId: string) {
    return this.userRepo.softDelete(userId);
  }

  // Avatar upload
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    const key = this.s3Service.generateKey('avatars', file.originalname);
    const url = await this.s3Service.uploadFile(key, file.buffer, file.mimetype);

    await this.userRepo.update(userId, { profileImage: url });

    this.logger.log(`Avatar uploaded for user ${userId}`);
    return { url };
  }

  // Saved vehicles
  async saveVehicle(userId: string, vehicleId: string) {
    return this.savedVehicleRepo.save(userId, vehicleId);
  }

  async unsaveVehicle(userId: string, vehicleId: string) {
    await this.savedVehicleRepo.unsave(userId, vehicleId);
    return { success: true };
  }

  async getSavedVehicles(userId: string, params?: { skip?: number; take?: number }) {
    return this.savedVehicleRepo.findByUser(userId, params);
  }

  async isVehicleSaved(userId: string, vehicleId: string) {
    return this.savedVehicleRepo.isSaved(userId, vehicleId);
  }

  // Preferences
  async getPreferences(userId: string) {
    return this.preferenceRepo.findByUserId(userId) || {
      language: 'en',
      currency: 'LKR',
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      bookingAlerts: true,
      paymentAlerts: true,
      marketingAlerts: false,
    };
  }

  async updatePreferences(userId: string, prefs: {
    language?: string;
    currency?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    bookingAlerts?: boolean;
    paymentAlerts?: boolean;
    marketingAlerts?: boolean;
  }) {
    return this.preferenceRepo.upsert(userId, prefs);
  }

  // Notification preferences
  async getNotificationPreferences(userId: string) {
    return this.preferenceRepo.getNotificationPreferences(userId);
  }

  async updateNotificationPreferences(
    userId: string,
    prefs: {
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      pushNotifications?: boolean;
      bookingAlerts?: boolean;
      paymentAlerts?: boolean;
      marketingAlerts?: boolean;
    },
  ) {
    return this.preferenceRepo.updateNotificationPreferences(userId, prefs);
  }
}
