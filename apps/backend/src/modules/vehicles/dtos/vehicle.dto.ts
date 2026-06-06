import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsBoolean, Min, Max, MinLength, IsArray, ArrayMinSize } from 'class-validator';
import { VehicleType, TransmissionType, FuelType, VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(VehicleType)
  type: VehicleType;

  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @Min(1990)
  @Max(2030)
  year: number;

  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsNumber()
  @Min(1)
  @Max(50)
  seats: number;

  @IsNumber()
  @Min(2)
  @Max(6)
  doors: number;

  @IsBoolean()
  @IsOptional()
  hasAC?: boolean;

  @IsBoolean()
  @IsOptional()
  hasGPS?: boolean;

  @IsNumber()
  @IsOptional()
  mileage?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @Min(100, { message: 'Daily rate must be at least LKR 100' })
  dailyRate: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  weeklyDiscount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  monthlyDiscount?: number;

  @IsNumber()
  @Min(0)
  securityDeposit: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one image is required' })
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  features?: string[];
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(100)
  dailyRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  securityDeposit?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}

export class SearchVehiclesDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TransmissionType)
  transmission?: TransmissionType;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsBoolean()
  hasAC?: boolean;
}
