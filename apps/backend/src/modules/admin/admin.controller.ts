import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('admin')
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('report/platform')
  async getPlatformReport() {
    return this.adminService.getPlatformReport();
  }

  @Get('report/revenue')
  async getRevenueReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getRevenueReport({ startDate, endDate });
  }

  @Get('users')
  async getUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      search,
      role,
    });
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users/:id/suspend')
  async suspendUser(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.suspendUser(id, adminId, reason);
  }

  @Post('users/:id/reinstate')
  async reinstateUser(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.reinstateUser(id, adminId, reason);
  }

  @Get('kyc/pending')
  async getPendingKyc(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.adminService.getPendingKyc({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Get('bookings')
  async getAllBookings(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllBookings({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
    });
  }

  @Get('vehicles')
  async getAllVehicles(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('moderationStatus') moderationStatus?: string,
  ) {
    return this.adminService.getAllVehicles({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      moderationStatus,
    });
  }

  @Put('vehicles/:id/moderate')
  async moderateVehicle(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('status') status: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.moderateVehicle(id, adminId, status, reason);
  }

  @Get('payments')
  async getAllPayments(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllPayments({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
    });
  }

  @Get('fraud-alerts')
  async getFraudAlerts(
    @Query('severity') severity?: string,
    @Query('resolved') resolved?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.adminService.getFraudAlerts({
      severity,
      resolved: resolved === 'true' ? true : resolved === 'false' ? false : undefined,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Post('fraud-alerts/:id/resolve')
  async resolveFraudAlert(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('resolution') resolution: string,
  ) {
    return this.adminService.resolveFraudAlert(id, adminId, resolution);
  }

  // Admin notes
  @Post('notes')
  async addNote(
    @CurrentUser('id') adminId: string,
    @Body() data: { entity: string; entityId: string; note: string },
  ) {
    return this.adminService.addNote(adminId, data.entity, data.entityId, data.note);
  }

  @Get('notes/:entity/:entityId')
  async getNotes(@Param('entity') entity: string, @Param('entityId') entityId: string) {
    return this.adminService.getNotes(entity, entityId);
  }

  @Put('notes/:id/pin')
  async pinNote(@Param('id') id: string) {
    return this.adminService.pinNote(id);
  }

  @Delete('notes/:id')
  async deleteNote(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.adminService.deleteNote(id, adminId);
  }

  @Get('audit-logs')
  async getAuditLogs(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('adminId') adminId?: string,
    @Query('action') action?: string,
  ) {
    return this.adminService.getAuditLogs({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      adminId,
      action,
    });
  }
}
