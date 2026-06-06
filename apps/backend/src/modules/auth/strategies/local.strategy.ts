import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserRepository } from '../../../database/repositories/user.repository';
import { CryptoUtil } from '../../../common/utils/crypto.util';
import { PhoneUtil } from '../../../common/utils/phone.util';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepo: UserRepository) {
    super({ usernameField: 'phoneNumber' });
  }

  async validate(phoneNumber: string, password: string) {
    const phone = PhoneUtil.formatToInternational(phoneNumber);
    const user = await this.userRepo.findByPhone(phone);

    if (!user || !user.isActive || !user.isVerified) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await CryptoUtil.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
