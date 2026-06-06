import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseInterceptors, UploadedFile, HttpCode, HttpStatus,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Public()
  @Get()
  async searchVehicles(@Query() query: any) {
    return this.vehiclesService.searchVehicles(query);
  }

  @Public()
  @Get('featured')
  async getFeatured(@Query('limit') limit?: number) {
    return this.vehiclesService.getFeaturedVehicles(limit ? Number(limit) : 6);
  }

  @Public()
  @Get('types')
  async getVehicleTypes() {
    return this.vehiclesService.getVehicleTypes();
  }

  @Get('my/list')
  async getMyVehicles(
    @CurrentUser('id') userId: string,
    @Query('status') status?: string,
  ) {
    return this.vehiclesService.getMyVehicles(userId, { status });
  }

  @Get('my/stats')
  async getOwnerStats(@CurrentUser('id') userId: string) {
    return this.vehiclesService.getOwnerStats(userId);
  }

  @Public()
  @Get(':id')
  async getVehicle(@Param('id') id: string) {
    return this.vehiclesService.getVehicle(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createVehicle(@CurrentUser('id') userId: string, @Body() data: any) {
    return this.vehiclesService.createVehicle(userId, data);
  }

  @Put(':id')
  async updateVehicle(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() data: any) {
    return this.vehiclesService.updateVehicle(id, userId, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVehicle(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.vehiclesService.deleteVehicle(id, userId);
  }

  // --- Images ---

  @Post(':id/images')
  async uploadImage(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: any,
    @Body('isPrimary') isPrimary?: string,
    @Body('order') order?: string,
  ) {
    return this.vehiclesService.uploadImage(id, userId, file, {
      isPrimary: isPrimary === 'true',
      order: order ? parseInt(order) : 0,
    });
  }

  @Delete(':id/images/:imageId')
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.vehiclesService.deleteImage(id, userId, imageId);
  }

  @Put(':id/images/reorder')
  async reorderImages(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: { images: { id: string; order: number }[] },
  ) {
    return this.vehiclesService.reorderImages(id, userId, body.images);
  }

  // --- Features ---

  @Post(':id/features')
  async addFeature(@Param('id') id: string, @CurrentUser('id') userId: string, @Body('name') name: string) {
    return this.vehiclesService.addFeature(id, userId, name);
  }

  @Delete(':id/features/:name')
  async removeFeature(@Param('id') id: string, @Param('name') name: string, @CurrentUser('id') userId: string) {
    return this.vehiclesService.removeFeature(id, userId, name);
  }

  // --- Availability ---

  @Post(':id/availability')
  async setAvailability(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: { startDate: string; endDate: string; isBlocked?: boolean; reason?: string },
  ) {
    return this.vehiclesService.setAvailability(id, userId, data);
  }

  @Delete(':id/availability/:availabilityId')
  async removeAvailability(
    @Param('id') id: string,
    @Param('availabilityId') availabilityId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.vehiclesService.removeAvailability(id, userId, availabilityId);
  }

  @Get(':id/availability')
  async getAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.vehiclesService.getAvailability(id, { startDate, endDate });
  }
}
