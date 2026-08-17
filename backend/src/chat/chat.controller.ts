import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Rate limit max 10 AI chat interactions per minute per IP
  sendMessage(@Body() dto: SendChatMessageDto, @Req() req: Request) {
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    return this.chatService.processMessage(dto, clientIp);
  }
}
