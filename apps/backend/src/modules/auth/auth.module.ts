import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserRepository } from '../../database/repositories/user.repository';
import { SessionRepository } from '../../database/repositories/session.repository';
import { SmsModule } from '../../integrations/sms/sms.module';
import { EmailModule } from '../../integrations/email/email.module';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { OtpUtil } from '../../common/utils/otp.util';
import { PhoneUtil } from '../../common/utils/phone.util';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn', '15m'),
          issuer: config.get<string>('jwt.issuer'),
        },
      }),
      inject: [ConfigService],
    }),
    SmsModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    LocalStrategy,
    UserRepository,
    SessionRepository,
    CryptoUtil,
    OtpUtil,
    PhoneUtil,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
