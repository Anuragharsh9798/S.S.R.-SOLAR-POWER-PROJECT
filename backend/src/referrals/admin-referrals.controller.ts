import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { ReferralsService } from './referrals.service';
import {
  ApproveReferralDto,
  RejectReferralDto,
  MarkPaidReferralDto,
} from './dto/update-referral-status.dto';

@Controller('api/v1/admin/referrals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  findAll() {
    return this.referralsService.findAllAdmin();
  }

  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  findOne(@Param('id') id: string) {
    return this.referralsService.findOneAdmin(id);
  }

  @Patch(':id/approve')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  approve(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto?: ApproveReferralDto,
  ) {
    const adminUser = req.user || { id: 'admin-system', email: 'admin@ssrsolar.com' };
    return this.referralsService.approve(id, adminUser, dto);
  }

  @Patch(':id/reject')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  reject(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto?: RejectReferralDto,
  ) {
    const adminUser = req.user || { id: 'admin-system', email: 'admin@ssrsolar.com' };
    return this.referralsService.reject(id, adminUser, dto);
  }

  @Patch(':id/mark-paid')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  markPaid(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto?: MarkPaidReferralDto,
  ) {
    const adminUser = req.user || { id: 'admin-system', email: 'admin@ssrsolar.com' };
    return this.referralsService.markPaid(id, adminUser, dto);
  }
}
