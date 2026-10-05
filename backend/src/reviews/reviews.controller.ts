import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  findAllPublic() {
    return this.reviewsService.findAllPublic();
  }
}

@Controller('api/v1/admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  findAllAdmin() {
    return this.reviewsService.findAllAdmin();
  }

  @Patch(':id/approve')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  approveReview(
    @Param('id') id: string,
    @Body('isApproved') isApproved: boolean = true,
  ) {
    return this.reviewsService.approveReview(id, isApproved !== false);
  }

  @Patch(':id/reject')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  rejectReview(@Param('id') id: string) {
    return this.reviewsService.approveReview(id, false);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
