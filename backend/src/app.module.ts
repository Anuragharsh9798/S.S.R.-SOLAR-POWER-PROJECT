import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CalculatorModule } from './calculator/calculator.module';
import { QuotationModule } from './quotation/quotation.module';
import { ProjectsModule } from './projects/projects.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BlogsModule } from './blogs/blogs.module';
import { ContactModule } from './contact/contact.module';
import { ReferralsModule } from './referrals/referrals.module';
import { GovernmentStatisticsModule } from './government-statistics/government-statistics.module';
import { ChatModule } from './chat/chat.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { CustomerModule } from './customer/customer.module';
import { AdminController } from './admin/admin.controller';
import { AdminDatabaseController } from './admin/admin-database.controller';
import { AdminDatabaseService } from './admin/admin-database.service';
import { AdminSettingsController } from './admin/admin-settings.controller';
import { AdminSettingsService } from './admin/admin-settings.service';
import { envValidationSchema } from './config/env.validation';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { SanitizeResponseInterceptor } from './common/interceptors/sanitize-response.interceptor';
import { SecurityTestController } from './security-test/security-test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuditLogModule,
    AuthModule,
    CalculatorModule,
    QuotationModule,
    CustomerModule,
    ProjectsModule,
    ReviewsModule,
    BlogsModule,
    ContactModule,
    ReferralsModule,
    GovernmentStatisticsModule,
    ChatModule,
  ],
  controllers: [
    AppController,
    SecurityTestController,
    AdminController,
    AdminDatabaseController,
    AdminSettingsController,
  ],
  providers: [
    AppService,
    AdminDatabaseService,
    AdminSettingsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SanitizeResponseInterceptor,
    },
  ],
})
export class AppModule {}
