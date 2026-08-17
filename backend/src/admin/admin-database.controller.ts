import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { AdminDatabaseService } from './admin-database.service';

@Controller('api/v1/admin/database')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminDatabaseController {
  constructor(private readonly databaseService: AdminDatabaseService) {}

  @Get('tables')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getTableMetadata() {
    return this.databaseService.getTableMetadata();
  }

  @Get(':table')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getTableRecords(
    @Param('table') table: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.databaseService.getTableRecords(table, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get(':table/:id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  getRecordById(@Param('table') table: string, @Param('id') id: string) {
    return this.databaseService.getRecordById(table, id);
  }

  @Patch(':table/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  updateRecord(
    @Param('table') table: string,
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Req() req: any,
  ) {
    const adminUser = req.user || { email: 'admin@ssrsolar.com', role: 'ADMIN' };
    return this.databaseService.updateRecord(table, id, body, adminUser);
  }

  @Delete(':table/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.SUPER_ADMIN)
  deleteRecord(
    @Param('table') table: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const adminUser = req.user || { email: 'superadmin@ssrsolar.com', role: 'SUPER_ADMIN' };
    return this.databaseService.deleteRecord(table, id, adminUser);
  }
}
