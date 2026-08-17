import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { TestRequestDto } from './dto/test-request.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('security-test')
export class SecurityTestController {
  @Post('validate')
  testValidation(@Body() dto: TestRequestDto) {
    return {
      message: 'Validation passed successfully',
      data: {
        id: '123-abc',
        name: dto.name,
        email: dto.email,
        passwordHash: '$2b$12$eImiTXuWVxfM37uY4JANjO', // Will be automatically stripped by SanitizeResponseInterceptor
        secretKey: 'SUPER_SECRET_TOKEN', // Will be automatically stripped
        createdAt: new Date(),
      },
    };
  }

  @Get('error-test')
  testError() {
    throw new InternalServerErrorException(
      'Database error: SELECT * FROM users WHERE id = secret_key',
    );
  }

  @Get('strict-rate-limit')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  testStrictRateLimit() {
    return { message: 'Strict rate limited endpoint accessed' };
  }
}
