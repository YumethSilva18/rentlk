import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleMapsService {
  private readonly logger = new Logger(GoogleMapsService.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('maps.google.apiKey');
  }

  async geocode(address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
    this.logger.log(`Geocoding address: ${address}`);
    // In production, call Google Maps Geocoding API
    return { lat: 6.9271, lng: 79.8612, formattedAddress: address };
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    this.logger.log(`Reverse geocoding: ${lat}, ${lng}`);
    return 'Colombo, Sri Lanka';
  }

  async getDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ): Promise<{ distanceKm: number; durationMin: number }> {
    this.logger.log(`Calculating distance between (${origin.lat}, ${origin.lng}) and (${destination.lat}, ${destination.lng})`);

    const latDiff = destination.lat - origin.lat;
    const lngDiff = destination.lng - origin.lng;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;

    return {
      distanceKm: Math.round(distance * 10) / 10,
      durationMin: Math.round(distance * 2 * 10) / 10,
    };
  }

  async getEstimatedTravelTime(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ): Promise<number> {
    const { durationMin } = await this.getDistance(origin, destination);
    return durationMin;
  }

  async searchPlaces(query: string, location?: { lat: number; lng: number }, radiusKm?: number): Promise<any[]> {
    this.logger.log(`Searching places: ${query}`);
    return [
      { id: '1', name: `${query} - Location 1`, address: 'Address 1', lat: 6.9271, lng: 79.8612 },
      { id: '2', name: `${query} - Location 2`, address: 'Address 2', lat: 6.9280, lng: 79.8620 },
    ];
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    this.logger.log(`Getting place details: ${placeId}`);
    return { id: placeId, name: 'Place', address: 'Address', lat: 6.9271, lng: 79.8612 };
  }
}
