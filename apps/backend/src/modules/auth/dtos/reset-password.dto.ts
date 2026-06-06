import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { IsStrongPassword } from '../../../common/validators/password.validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0[1-9][0-9]{8}$/, { message: 'Phone number must be a valid Sri Lankan number (e.g., 0771234567)' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Reset code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Reset code must contain only digits' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
