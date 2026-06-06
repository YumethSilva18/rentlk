import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationFilterDto } from './dtos/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @CurrentUser('id') userId: string,
    @Query() filters: NotificationFilterDto,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getUserNotifications(userId, {
      ...filters,
      skip: page ? (parseInt(page) - 1) * (parseInt(limit || '20')) : 0,
      take: limit ? parseInt(limit) : 20,
    });
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Get('summary')
  async getNotificationSummary(@CurrentUser('id') userId: string) {
    return this.notificationsService.getNotificationSummary(userId);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notificationsService.deleteNotification(id, userId);
  }

  @Delete('clear-read')
  async clearReadNotifications(@CurrentUser('id') userId: string) {
    return this.notificationsService.clearReadNotifications(userId);
  }
}
