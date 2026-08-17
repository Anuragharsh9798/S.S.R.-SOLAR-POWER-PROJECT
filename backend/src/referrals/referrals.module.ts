import { Module } from '@nestjs/common';
import { ReferralsController } from './referrals.controller';
import { AdminReferralsController } from './admin-referrals.controller';
import { ReferralsService } from './referrals.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [PrismaModule, AuditLogModule],
  controllers: [ReferralsController, AdminReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}
