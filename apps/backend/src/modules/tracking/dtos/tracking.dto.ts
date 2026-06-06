import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateTrackingSessionDto {
  @IsString()
  bookingId: string;

  @IsString()
  vehicleId: string;

  @IsOptional()
  @IsString()
  driverId?: string;
}

export class LocationUpdateDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  @IsNumber()
  heading?: number;

  @IsOptional()
  @IsNumber()
  accuracy?: number;
}
