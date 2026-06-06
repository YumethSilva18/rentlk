import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async requestPayout(
    @CurrentUser('id') userId: string,
    @Body() data: { amount: number; bankDetails?: { accountNumber: string; bankName: string; branchName?: string } },
  ) {
    return this.payoutsService.requestPayout(userId, data);
  }

  @Get('my')
  async getMyPayouts(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.payoutsService.getUserPayouts(userId, { status, skip, take });
  }

  @Get('my/summary')
  async getMyPayoutSummary(@CurrentUser('id') userId: string) {
    return this.payoutsService.getUserPayoutSummary(userId);
  }

  @Get(':id')
  async getPayout(@Param('id') id: string) {
    return this.payoutsService.getPayout(id);
  }

  // Admin endpoints
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('admin/all')
  async getAllPayouts(
    @Query('status') status?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.payoutsService.getAllPayouts({ status, skip, take });
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('admin/pending-summary')
  async getPendingPayouts() {
    return this.payoutsService.getPendingPayouts();
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/approve')
  async approvePayout(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.payoutsService.approvePayout(id, adminId);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/reject')
  async rejectPayout(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason: string,
  ) {
    return this.payoutsService.rejectPayout(id, adminId, reason);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/process')
  async processPayout(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reference') reference: string,
  ) {
    return this.payoutsService.processPayout(id, adminId, reference);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/fail')
  async failPayout(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason: string,
  ) {
    return this.payoutsService.failPayout(id, adminId, reason);
  }
}
