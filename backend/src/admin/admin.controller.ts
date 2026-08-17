import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getDashboardMetrics(@Req() req: any) {
    return {
      message: 'Access granted to Admin Dashboard',
      actor: req.user,
      metrics: {
        totalLeads: 124,
        pendingSurveys: 18,
        approvedSubsidies: 42,
        systemHealth: '100% Operational',
      },
    };
  }

  @Get('content')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CONTENT_MANAGER)
  getContentManagement() {
    return {
      message: 'Access granted to Content Management Suite',
    };
  }
}
