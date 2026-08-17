import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';

@Controller('api/v1/referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  create(@Body() dto: CreateReferralDto) {
    return this.referralsService.create(dto);
  }
}
