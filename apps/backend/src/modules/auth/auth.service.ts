import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../database/repositories/user.repository';
import { SessionRepository } from '../../database/repositories/session.repository';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { OtpUtil } from '../../common/utils/otp.util';
import { PhoneUtil } from '../../common/utils/phone.util';
import { OtpSmsService } from '../../integrations/sms/otp-sms.service';
import { SesService } from '../../integrations/email/ses.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { PrismaService } from '../../database/prisma/prisma.service';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 30;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly sessionRepo: SessionRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpSmsService: OtpSmsService,
    private readonly sesService: SesService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(dto: SignupDto) {
    const phone = PhoneUtil.formatToInternational(dto.phoneNumber);
    const existingUser = await this.userRepo.findByPhone(phone);
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new ConflictException('Phone number already registered');
      }
      await this.userRepo.softDelete(existingUser.id);
    }

    const passwordHash = await CryptoUtil.hash(dto.password);
    const user = await this.userRepo.create({
      phoneNumber: phone,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      role: dto.role || 'CUSTOMER',
    });

    const { code, expiresAt } = await this.otpSmsService.sendOtp(phone);
    await this.prisma.otpRecord.create({
      data: {
        phoneNumber: phone,
        code: await this.otpUtil().hashOtp(code),
        expiresAt,
      },
    });

    this.logger.log(`Signup completed for phone: ${phone.substring(0, 6)}***`);
    return {
      message: 'Signup successful. Please verify your phone number with the OTP sent.',
      userId: user.id,
      expiresIn: 300,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const phone = PhoneUtil.formatToInternational(dto.phoneNumber);
    const otpRecords = await this.prisma.otpRecord.findMany({
      where: { phoneNumber: phone, verified: false },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (otpRecords.length === 0) {
      throw new BadRequestException('No OTP found. Please request a new one.');
    }

    const otpRecord = otpRecords[0];
    if (otpRecord.attemptCount >= 5) {
      throw new BadRequestException('Too many attempts. Please request a new OTP.');
    }

    const isValid = await this.otpUtil().verifyOtp(dto.code, otpRecord.code);
    if (!isValid) {
      await this.prisma.otpRecord.update({
        where: { id: otpRecord.id },
        data: { attemptCount: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP code');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    await Promise.all([
      this.prisma.otpRecord.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      }),
      this.userRepo.update(otpRecord.phoneNumber, {
        isVerified: true,
      }),
    ]);

    const user = await this.userRepo.findByPhone(phone);
    const tokens = await this.generateTokens(user!);

    return {
      message: 'Phone verified successfully',
      user: this.sanitizeUser(user!),
      ...tokens,
    };
  }

  async login(dto: LoginDto, request?: { ip?: string; userAgent?: string }) {
    const phone = PhoneUtil.formatToInternational(dto.phoneNumber);
    const user = await this.userRepo.findByPhone(phone);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your phone number first');
    }

    // Check if user is suspended
    if (user.isSuspended) {
      this.logger.warn(`Suspended user attempted login: ${phone.substring(0, 6)}***`);
      throw new ForbiddenException(
        `Account suspended. Reason: ${user.suspendedReason || 'Contact support.'}`,
      );
    }

    // Check if account is locked
    const isLocked = await this.userRepo.isLocked(user.id);
    if (isLocked) {
      this.logger.warn(`Locked user attempted login: ${phone.substring(0, 6)}***`);
      throw new ForbiddenException(
        `Account temporarily locked due to too many failed attempts. Try again after ${user.lockedUntil?.toISOString()}`,
      );
    }

    const isPasswordValid = await CryptoUtil.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment login attempts and potentially lock account
      await this.userRepo.incrementLoginAttempts(user.id);
      const updatedUser = await this.userRepo.findById(user.id);
      if (updatedUser && updatedUser.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        await this.userRepo.lockAccount(user.id, LOCKOUT_MINUTES);
        this.logger.warn(
          `Account locked after ${MAX_LOGIN_ATTEMPTS} failed attempts: ${phone.substring(0, 6)}***`,
        );
        throw new ForbiddenException(
          `Account locked for ${LOCKOUT_MINUTES} minutes due to too many failed attempts.`,
        );
      }

      this.logger.warn(`Failed login attempt for: ${phone.substring(0, 6)}***`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on successful login
    await this.userRepo.resetLoginAttempts(user.id);

    // Detect IP anomaly
    if (request?.ip) {
      const anomaly = await this.sessionRepo.detectAnomaly(user.id, request.ip);
      if (anomaly.isNewIp) {
        this.logger.warn(`New IP detected for user ${user.id}: ${request.ip}`);
        // Optionally send SMS/email alert about new device/IP
      }
    }

    await this.userRepo.updateLastLogin(user.id);
    const tokens = await this.generateTokens(user, request?.ip, request?.userAgent);

    this.logger.log(`Login successful for: ${phone.substring(0, 6)}***`);
    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    // Invalidate refresh token
    await this.userRepo.updateRefreshToken(userId, null);

    // Revoke session if token provided
    if (refreshToken) {
      await this.sessionRepo.revokeByToken(refreshToken);
    }

    this.logger.log(`User ${userId} logged out`);
    return { message: 'Logged out successfully' };
  }

  async logoutAllDevices(userId: string) {
    // Invalidate refresh token
    await this.userRepo.updateRefreshToken(userId, null);

    // Revoke all sessions
    await this.sessionRepo.revokeAll(userId);

    this.logger.log(`User ${userId} logged out from all devices`);
    return { message: 'Logged out from all devices' };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.userRepo.findById(payload.sub);
      if (!user || !user.isActive || user.refreshToken !== dto.refreshToken) {
        // Potential token reuse - revoke all sessions
        if (user) {
          await this.sessionRepo.revokeAll(user.id);
          await this.userRepo.updateRefreshToken(user.id, null);
          this.logger.warn(`Potential refresh token reuse detected for user ${user.id}`);
        }
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if user is suspended
      if (user.isSuspended) {
        throw new ForbiddenException('Account suspended. Contact support.');
      }

      // Token rotation - revoke old session, create new
      await this.sessionRepo.revokeByToken(dto.refreshToken);
      const tokens = await this.generateTokens(user);

      return {
        message: 'Token refreshed',
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const phone = PhoneUtil.formatToInternational(dto.phoneNumber);
    const user = await this.userRepo.findByPhone(phone);
    if (!user) {
      return { message: 'If an account exists, a reset code has been sent.' };
    }

    const resetToken = CryptoUtil.generateVerificationToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.otpRecord.create({
      data: {
        phoneNumber: phone,
        code: await this.otpUtil().hashOtp(resetToken),
        expiresAt,
      },
    });

    await this.otpSmsService.sendOtp(phone);

    if (user.email) {
      await this.sesService.sendPasswordResetEmail(user.email, resetToken);
    }

    this.logger.log(`Password reset requested for: ${phone.substring(0, 6)}***`);
    return { message: 'If an account exists, a reset code has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const phone = PhoneUtil.formatToInternational(dto.phoneNumber);
    const user = await this.userRepo.findByPhone(phone);
    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const otpRecords = await this.prisma.otpRecord.findMany({
      where: { phoneNumber: phone, verified: false },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (otpRecords.length === 0) {
      throw new BadRequestException('No reset code found. Please request a new one.');
    }

    const otpRecord = otpRecords[0];
    const isValid = await this.otpUtil().verifyOtp(dto.code, otpRecord.code);
    if (!isValid || new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const passwordHash = await CryptoUtil.hash(dto.newPassword);

    // Reset password, invalidate all sessions, clear lockout
    await Promise.all([
      this.userRepo.update(user.id, {
        passwordHash,
        loginAttempts: 0,
        lockedUntil: null,
      }),
      this.userRepo.updateRefreshToken(user.id, null),
      this.sessionRepo.revokeAll(user.id),
      this.prisma.otpRecord.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      }),
    ]);

    this.logger.log(`Password reset completed for: ${phone.substring(0, 6)}***`);
    return { message: 'Password reset successful. All sessions revoked. Please login again.' };
  }

  async resendOtp(phoneNumber: string) {
    const phone = PhoneUtil.formatToInternational(phoneNumber);
    const user = await this.userRepo.findByPhone(phone);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { code, expiresAt } = await this.otpSmsService.sendOtp(phone);
    await this.prisma.otpRecord.create({
      data: {
        phoneNumber: phone,
        code: await this.otpUtil().hashOtp(code),
        expiresAt,
      },
    });

    return {
      message: 'OTP resent successfully',
      expiresIn: 300,
    };
  }

  async getActiveSessions(userId: string) {
    return this.sessionRepo.findByUser(userId);
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session || session.userId !== userId) {
      throw new ForbiddenException('Cannot revoke this session');
    }
    await this.sessionRepo.revoke(sessionId);
    return { message: 'Session revoked' };
  }

  private async generateTokens(user: any, ipAddress?: string, userAgent?: string) {
    const payload = {
      sub: user.id,
      phone: user.phoneNumber,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwt.expiresIn', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
      }),
    ]);

    await this.userRepo.updateRefreshToken(user.id, refreshToken);

    // Create session record
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    const expiresAt = new Date(Date.now() + this.parseExpiry(refreshExpiresIn));

    await this.sessionRepo.createSession({
      userId: user.id,
      token: refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  private parseExpiry(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      case 's': return value * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  private sanitizeUser(user: any) {
    const { passwordHash, refreshToken, lockedUntil, loginAttempts, ...safeUser } = user;
    return safeUser;
  }

  private otpUtil(): OtpUtil {
    return new OtpUtil();
  }
}
