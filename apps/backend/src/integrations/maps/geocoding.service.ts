import { Injectable, Logger } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private cache = new Map<string, { result: any; timestamp: number }>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(private readonly googleMaps: GoogleMapsService) {}

  async forwardGeocode(address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
    const cacheKey = `forward:${address.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    const result = await this.googleMaps.geocode(address);
    if (result) {
      this.cache.set(cacheKey, { result, timestamp: Date.now() });
    }

    return result;
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const roundedLat = Math.round(lat * 10000) / 10000;
    const roundedLng = Math.round(lng * 10000) / 10000;
    const cacheKey = `reverse:${roundedLat},${roundedLng}`;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    const address = await this.googleMaps.reverseGeocode(lat, lng);
    this.cache.set(cacheKey, { result: address, timestamp: Date.now() });

    return address;
  }

  async validateAddress(address: string): Promise<boolean> {
    const result = await this.forwardGeocode(address);
    return result !== null;
  }

  async getSriLankaDistricts(): Promise<string[]> {
    return [
      'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
      'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
      'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
      'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
      'Monaragala', 'Ratnapura', 'Kegalle',
    ];
  }
}
