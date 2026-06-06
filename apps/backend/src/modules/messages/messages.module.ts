import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MessageRepository } from '../../database/repositories/message.repository';
import { ConversationRepository } from '../../database/repositories/conversation.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesGateway,
    MessageRepository,
    ConversationRepository,
    BookingRepository,
  ],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
