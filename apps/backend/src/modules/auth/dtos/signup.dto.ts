import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEnum, IsEmail, Matches } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { IsSriLankanPhone } from '../../../common/validators/phone.validator';
import { IsStrongPassword } from '../../../common/validators/password.validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0[1-9][0-9]{8}$/, { message: 'Phone number must be a valid Sri Lankan number (e.g., 0771234567)' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
