import { IsString, IsNumber, IsOptional, IsEnum, Min, IsNotEmpty } from 'class-validator';

export enum WalletTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export class WithdrawDto {
  @IsNumber()
  @Min(100, { message: 'Minimum withdrawal amount is LKR 100' })
  amount: number;

  @IsString()
  @IsNotEmpty()
  bankAccount: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class WalletFilterDto {
  @IsOptional()
  @IsEnum(WalletTransactionType)
  type?: WalletTransactionType;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
