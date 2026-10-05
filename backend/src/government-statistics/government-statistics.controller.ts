import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { GovernmentStatisticsService } from './government-statistics.service';
import { CreateGovtStatDto } from './dto/create-govt-stat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('api/v1/government-statistics')
export class GovernmentStatisticsController {
  constructor(private readonly govtStatsService: GovernmentStatisticsService) {}

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  findAll() {
    return this.govtStatsService.findAll();
  }
}

@Controller('api/v1/admin/government-statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminGovernmentStatisticsController {
  constructor(private readonly govtStatsService: GovernmentStatisticsService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CONTENT_MANAGER, RoleEnum.STAFF)
  findAllAdmin() {
    return this.govtStatsService.findAll();
  }

  @Post()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CONTENT_MANAGER)
  create(@Body() dto: CreateGovtStatDto, @Req() req: any) {
    return this.govtStatsService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CONTENT_MANAGER)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateGovtStatDto>,
    @Req() req: any,
  ) {
    return this.govtStatsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.govtStatsService.remove(id);
  }
}
