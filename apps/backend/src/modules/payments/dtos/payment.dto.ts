import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class InitiatePaymentDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}

export class ConfirmPaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsString()
  @IsNotEmpty()
  gatewayRef: string;
}

export class RefundPaymentDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
