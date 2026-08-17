import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('api/v1/admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  getLogs() {
    return this.auditLogService.getLogs();
  }
}
