import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0[1-9][0-9]{8}$/, { message: 'Phone number must be a valid Sri Lankan number (e.g., 0771234567)' })
  phoneNumber: string;
}
