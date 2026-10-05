import {
  Controller,
  Post,
  Get,
  Param,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: process.env.NODE_ENV === 'test' ? 1000 : 10, ttl: 60000 } })
  sendMessage(@Body() dto: SendChatMessageDto, @Req() req: Request) {
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    return this.chatService.processMessage(dto, clientIp);
  }
}

@Controller('api/v1/admin/chatbot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  findAllConversations() {
    return this.chatService.findAllAdminConversations();
  }

  @Get('conversations/:sessionId')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  findConversationMessages(@Param('sessionId') sessionId: string) {
    return this.chatService.findConversationMessages(sessionId);
  }
}
