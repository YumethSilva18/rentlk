import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { KycService } from './kyc.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SubmitKYCDto, ReviewKYCDto } from './dtos/kyc.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { KYCStatus } from '../../common/enums/kyc-status.enum';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('submit')
  async submitKYC(
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitKYCDto,
  ) {
    return this.kycService.submitKYC(userId, dto);
  }

  @Get('me')
  async getMyKYC(@CurrentUser('id') userId: string) {
    return this.kycService.getMyKYC(userId);
  }

  @Get('me/status')
  async getKYCStatus(@CurrentUser('id') userId: string) {
    return this.kycService.getKYCStatus(userId);
  }

  @Get('me/eligibility/:action')
  async checkEligibility(
    @CurrentUser('id') userId: string,
    @Param('action') action: 'book' | 'list',
  ) {
    return this.kycService.checkKycEligibility(userId, action);
  }

  @Post('resubmit')
  async resubmitKYC(
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitKYCDto,
  ) {
    return this.kycService.resubmitKYC(userId, dto);
  }

  @Get('admin/submissions')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async getAllSubmissions(
    @Query('status') status?: KYCStatus,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.kycService.getAllSubmissions({
      status,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Put('admin/:id/review')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async reviewSubmission(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: ReviewKYCDto,
  ) {
    return this.kycService.reviewSubmission(id, adminId, dto);
  }
}
