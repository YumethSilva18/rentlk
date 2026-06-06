import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseInterceptors, UploadedFile, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() data: { firstName?: string; lastName?: string; email?: string; address?: string; city?: string; district?: string; preferredLanguage?: string },
  ) {
    return this.usersService.updateProfile(userId, data);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@CurrentUser('id') userId: string, @UploadedFile() file: any) {
    return this.usersService.uploadAvatar(userId, file);
  }

  @Get('me/preferences')
  async getPreferences(@CurrentUser('id') userId: string) {
    return this.usersService.getPreferences(userId);
  }

  @Put('me/preferences')
  async updatePreferences(@CurrentUser('id') userId: string, @Body() prefs: any) {
    return this.usersService.updatePreferences(userId, prefs);
  }

  @Get('me/notification-preferences')
  async getNotificationPreferences(@CurrentUser('id') userId: string) {
    return this.usersService.getNotificationPreferences(userId);
  }

  @Put('me/notification-preferences')
  async updateNotificationPreferences(@CurrentUser('id') userId: string, @Body() prefs: any) {
    return this.usersService.updateNotificationPreferences(userId, prefs);
  }

  @Get('me/saved-vehicles')
  async getSavedVehicles(
    @CurrentUser('id') userId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.usersService.getSavedVehicles(userId, {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Post('me/saved-vehicles/:vehicleId')
  async saveVehicle(@CurrentUser('id') userId: string, @Param('vehicleId') vehicleId: string) {
    return this.usersService.saveVehicle(userId, vehicleId);
  }

  @Delete('me/saved-vehicles/:vehicleId')
  async unsaveVehicle(@CurrentUser('id') userId: string, @Param('vehicleId') vehicleId: string) {
    return this.usersService.unsaveVehicle(userId, vehicleId);
  }

  @Get('me/saved-vehicles/:vehicleId/check')
  async isVehicleSaved(@CurrentUser('id') userId: string, @Param('vehicleId') vehicleId: string) {
    const saved = await this.usersService.isVehicleSaved(userId, vehicleId);
    return { saved };
  }

  @Public()
  @Get(':id/public')
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateAccount(@CurrentUser('id') userId: string) {
    await this.usersService.deactivateAccount(userId);
  }
}
