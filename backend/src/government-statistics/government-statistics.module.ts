import { Module } from '@nestjs/common';
import { GovernmentStatisticsService } from './government-statistics.service';
import {
  GovernmentStatisticsController,
  AdminGovernmentStatisticsController,
} from './government-statistics.controller';

@Module({
  controllers: [
    GovernmentStatisticsController,
    AdminGovernmentStatisticsController,
  ],
  providers: [GovernmentStatisticsService],
  exports: [GovernmentStatisticsService],
})
export class GovernmentStatisticsModule {}
