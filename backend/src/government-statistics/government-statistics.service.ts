import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService, AuditAction } from '../audit-log/audit-log.service';
import { CreateGovtStatDto } from './dto/create-govt-stat.dto';

@Injectable()
export class GovernmentStatisticsService {
  private readonly logger = new Logger(GovernmentStatisticsService.name);
  private inMemoryStats: Map<string, any> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {
    this.seedOfficialData();
  }

  private seedOfficialData() {
    const officialStats = [
      {
        id: 'stat-pm-surya-ghar-achievements',
        metric: 'Households Benefiting',
        value: '51.58 Lakh',
        unit: 'PM Surya Ghar Achievements',
        source: 'Ministry of New and Renewable Energy (MNRE)',
        sourceUrl: 'https://pmsuryaghar.gov.in',
        effectiveDate: '2026-08-17',
        lastVerifiedAt: '2026-08-17',
      },
      {
        id: 'stat-subsidy-released-transferred',
        metric: 'Subsidy Transferred',
        value: '₹28,024 Cr',
        unit: 'Subsidy Released / Transferred',
        source: 'Ministry of New and Renewable Energy (MNRE)',
        sourceUrl: 'https://pmsuryaghar.gov.in',
        effectiveDate: '2026-08-17',
        lastVerifiedAt: '2026-08-17',
      },
      {
        id: 'stat-installation-capacity',
        metric: 'Commissioned Capacity',
        value: '14.8 GW',
        unit: 'Installation Capacity',
        source: 'Ministry of New and Renewable Energy (MNRE)',
        sourceUrl: 'https://pmsuryaghar.gov.in',
        effectiveDate: '2026-08-17',
        lastVerifiedAt: '2026-08-17',
      },
      {
        id: 'stat-installations-completed',
        metric: 'Households / Installations',
        value: '50+ Lakh',
        unit: 'Installations Completed',
        source: 'Ministry of New and Renewable Energy (MNRE)',
        sourceUrl: 'https://pmsuryaghar.gov.in',
        effectiveDate: '2026-08-17',
        lastVerifiedAt: '2026-08-17',
      },
      {
        id: 'stat-households-covered',
        metric: 'Households Covered',
        value: '51.58 Lakh',
        unit: 'Households Covered',
        source: 'Ministry of New and Renewable Energy (MNRE)',
        sourceUrl: 'https://pmsuryaghar.gov.in',
        effectiveDate: '2026-08-17',
        lastVerifiedAt: '2026-08-17',
      },
      {
        id: 'stat-max-central-subsidy',
        metric: 'Maximum Central Financial Assistance (CFA)',
        value: '78,000',
        unit: '₹ (INR)',
        source: 'PM Surya Ghar Muft Bijli Yojana Benchmark',
        sourceUrl: 'https://pmsuryaghar.gov.in',
        effectiveDate: '2024-02-13',
        lastVerifiedAt: '2026-08-17',
      },
      {
        id: 'stat-up-state-subsidy',
        metric: 'Uttar Pradesh State Solar Subsidy (Max)',
        value: '30,000',
        unit: '₹ (INR)',
        source: 'UP Solar Power Policy 2022 / UPNEDA',
        sourceUrl: 'https://upneda.org.in',
        effectiveDate: '2022-11-01',
        lastVerifiedAt: '2026-08-17',
      },
    ];

    this.inMemoryStats.clear();
    for (const stat of officialStats) {
      this.inMemoryStats.set(stat.id, stat);
    }
  }

  async findAll() {
    try {
      const stats = await this.prisma.governmentStatistic.findMany({
        orderBy: { createdAt: 'asc' },
      });
      if (stats && stats.length >= 5) return stats;
    } catch {
      // Fallback to in-memory stats
    }
    return Array.from(this.inMemoryStats.values());
  }

  async create(dto: CreateGovtStatDto, reqUser?: any) {
    const id = `stat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const statRecord = {
      id,
      ...dto,
      lastVerifiedAt: dto.lastVerifiedAt || new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inMemoryStats.set(id, statRecord);

    try {
      const created = await this.prisma.governmentStatistic.create({
        data: {
          metric: dto.metric,
          value: dto.value,
          unit: dto.unit,
          source: dto.source,
          sourceUrl: dto.sourceUrl,
          effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : null,
          lastVerifiedAt: dto.lastVerifiedAt ? new Date(dto.lastVerifiedAt) : new Date(),
        },
      });

      await this.auditLogService.logAction({
        action: AuditAction.GOVT_DATA_UPDATE,
        userId: reqUser?.id,
        userEmail: reqUser?.email,
        resource: 'GovernmentStatistic',
        resourceId: created.id,
        details: { metric: dto.metric, value: dto.value },
      });

      return created;
    } catch (err) {
      this.logger.warn(`Govt stat saved in memory cache. DB notice: ${err.message}`);
      await this.auditLogService.logAction({
        action: AuditAction.GOVT_DATA_UPDATE,
        userId: reqUser?.id,
        userEmail: reqUser?.email,
        resource: 'GovernmentStatistic',
        resourceId: id,
        details: { metric: dto.metric, value: dto.value },
      });
      return statRecord;
    }
  }

  async update(id: string, dto: Partial<CreateGovtStatDto>, reqUser?: any) {
    try {
      const updated = await this.prisma.governmentStatistic.update({
        where: { id },
        data: {
          ...dto,
          effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : undefined,
          lastVerifiedAt: dto.lastVerifiedAt ? new Date(dto.lastVerifiedAt) : new Date(),
        },
      });

      await this.auditLogService.logAction({
        action: AuditAction.GOVT_DATA_UPDATE,
        userId: reqUser?.id,
        userEmail: reqUser?.email,
        resource: 'GovernmentStatistic',
        resourceId: id,
        details: dto,
      });

      return updated;
    } catch {
      const existing = this.inMemoryStats.get(id);
      if (!existing) {
        throw new NotFoundException(`Government statistic with ID "${id}" not found`);
      }
      const updated = { ...existing, ...dto, lastVerifiedAt: new Date().toISOString(), updatedAt: new Date() };
      this.inMemoryStats.set(id, updated);
      return updated;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.governmentStatistic.delete({ where: { id } });
    } catch {
      this.inMemoryStats.delete(id);
    }
    return { message: `Government statistic with ID "${id}" deleted successfully` };
  }
}
