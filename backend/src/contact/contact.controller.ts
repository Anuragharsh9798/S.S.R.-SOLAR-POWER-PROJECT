import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('api/v1/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }
}

@Controller('api/v1/admin/contact-messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  findAllAdmin() {
    return this.contactService.findAllAdmin();
  }

  @Patch(':id/read')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  markHandled(
    @Param('id') id: string,
    @Body('isRead') isRead: boolean = true,
  ) {
    return this.contactService.markHandled(id, isRead !== false);
  }
}
