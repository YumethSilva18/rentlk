import { Controller, Get, Post, Body, Query, Param, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SendMessageDto, GetMessagesDto } from './dtos/message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(userId, dto);
  }

  @Get('conversations')
  async getConversations(@CurrentUser('id') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Get()
  async getMessages(
    @CurrentUser('id') userId: string,
    @Query() filters: GetMessagesDto,
  ) {
    return this.messagesService.getMessages(userId, {
      otherUserId: filters.otherUserId,
      bookingId: filters.bookingId,
      skip: filters.skip ? parseInt(filters.skip) : undefined,
      take: filters.take ? parseInt(filters.take) : undefined,
    });
  }

  @Put(':id/read')
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.messagesService.markAsRead(id, userId);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return { count: await this.messagesService.getUnreadCount(userId) };
  }
}
