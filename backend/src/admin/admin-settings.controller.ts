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
import { AdminSettingsService } from './admin-settings.service';

@Controller('api/v1/admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminSettingsController {
  constructor(private readonly settingsService: AdminSettingsService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getSettings(@Req() req: any) {
    return this.settingsService.getSettingsForRole(req.user);
  }

  @Patch('business')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  updateBusinessSettings(@Body() dto: any, @Req() req: any) {
    return this.settingsService.updateBusinessSettings(dto, req.user);
  }

  @Patch('security')
  @Roles(RoleEnum.SUPER_ADMIN)
  updateSecurityControls(@Body() dto: any, @Req() req: any) {
    return this.settingsService.updateSecurityControls(dto, req.user);
  }

  @Patch('users/:id/role')
  @Roles(RoleEnum.SUPER_ADMIN)
  updateUserRoleOrStatus(
    @Param('id') id: string,
    @Body() dto: { isActive?: boolean; roleName?: string },
    @Req() req: any,
  ) {
    return this.settingsService.updateUserRoleOrStatus(id, dto, req.user);
  }

  @Get('audit-logs')
  @Roles(RoleEnum.SUPER_ADMIN)
  getAuditLogs(@Req() req: any) {
    return this.settingsService.getAuditLogs(req.user);
  }
}
