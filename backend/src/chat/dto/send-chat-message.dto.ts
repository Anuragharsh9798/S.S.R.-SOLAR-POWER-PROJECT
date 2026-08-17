import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class SendChatMessageDto {
  @IsNotEmpty({ message: 'Message content is required' })
  @IsString()
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
  message: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
