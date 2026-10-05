import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController, AdminChatController } from './chat.controller';
import { GovernmentStatisticsModule } from '../government-statistics/government-statistics.module';

@Module({
  imports: [GovernmentStatisticsModule],
  controllers: [ChatController, AdminChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
