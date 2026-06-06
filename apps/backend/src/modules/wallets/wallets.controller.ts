import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums/user-role.enum';
import { WalletFilterDto } from './dtos/wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('me')
  async getMyWallet(@CurrentUser('id') userId: string) {
    return this.walletsService.getWallet(userId);
  }

  @Get('me/balance')
  async getBalance(@CurrentUser('id') userId: string) {
    return this.walletsService.getBalance(userId);
  }

  @Get('me/transactions')
  async getTransactions(
    @CurrentUser('id') userId: string,
    @Query() filters: WalletFilterDto,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletsService.getTransactions(userId, {
      type: filters.type,
      skip: page ? (parseInt(page) - 1) * (parseInt(limit || '20')) : 0,
      take: limit ? parseInt(limit) : 20,
    });
  }

  @Get('me/ledger')
  async getLedger(
    @CurrentUser('id') userId: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletsService.getLedger(userId, {
      type,
      startDate,
      endDate,
      skip: page ? (parseInt(page) - 1) * (parseInt(limit || '50')) : 0,
      take: limit ? parseInt(limit) : 50,
    });
  }

  @Post('me/withdraw')
  async withdraw(
    @CurrentUser('id') userId: string,
    @Body() dto: { amount: number },
  ) {
    return this.walletsService.withdraw(userId, dto.amount);
  }

  // --- Admin endpoints ---

  @Get('admin/:userId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async getWalletByUserId(@Param('userId') userId: string) {
    return this.walletsService.getWalletByUserId(userId);
  }

  @Post('admin/:userId/reconcile')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async reconcileWallet(@Param('userId') userId: string) {
    return this.walletsService.reconcileWallet(userId);
  }
}
