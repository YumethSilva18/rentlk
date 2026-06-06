import { Module } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { GeocodingService } from './geocoding.service';

@Module({
  providers: [GoogleMapsService, GeocodingService],
  exports: [GoogleMapsService, GeocodingService],
})
export class MapsModule {}
