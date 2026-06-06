import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { KYCStatus } from '../../../common/enums/kyc-status.enum';

export enum KYCType {
  NIC = 'NIC',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export class SubmitKYCDto {
  @IsEnum(KYCType)
  type: KYCType;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  frontImage: string;

  @IsString()
  @IsOptional()
  backImage?: string;

  @IsString()
  @IsNotEmpty()
  selfieImage: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;
}

export class ReviewKYCDto {
  @IsEnum(KYCStatus)
  status: KYCStatus;

  @IsString()
  @IsOptional()
  rejectReason?: string;
}
