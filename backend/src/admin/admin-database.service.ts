import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

export interface TableMeta {
  key: string;
  name: string;
  description: string;
  readOnly: boolean;
  count: number;
}

@Injectable()
export class AdminDatabaseService {
  private readonly logger = new Logger(AdminDatabaseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private readonly allowedTables: Record<
    string,
    {
      name: string;
      modelName: string;
      tableNameRaw: string;
      description: string;
      readOnly?: boolean;
      searchFields: string[];
    }
  > = {
    customers: {
      name: 'Customers',
      modelName: 'customer',
      tableNameRaw: 'customers',
      description: 'Customer contact details, addresses, and DISCOM consumer numbers',
      searchFields: ['fullName', 'phone', 'email', 'city', 'discomConsumerNo'],
    },
    quotations: {
      name: 'Quotations & Solar Leads',
      modelName: 'quotation',
      tableNameRaw: 'quotations',
      description: 'Solar quote requests, bill calculations, and lead statuses',
      searchFields: ['quoteNumber', 'fullName', 'phone', 'email', 'city', 'status'],
    },
    referrals: {
      name: 'Referral Claims',
      modelName: 'referral',
      tableNameRaw: 'referrals',
      description: 'Customer referral reward claims and verification workflow',
      searchFields: ['claimNumber', 'referrerName', 'referrerPhone', 'friendName', 'friendPhone', 'friendCity'],
    },
    projects: {
      name: 'Solar Projects Portfolio',
      modelName: 'project',
      tableNameRaw: 'projects',
      description: 'Featured solar rooftop installation portfolio projects',
      searchFields: ['title', 'slug', 'type', 'location', 'capacity'],
    },
    reviews: {
      name: 'Customer Testimonials',
      modelName: 'review',
      tableNameRaw: 'reviews',
      description: 'Customer ratings, solar reviews, and moderation statuses',
      searchFields: ['name', 'location', 'solarType'],
    },
    blogs: {
      name: 'Blog Articles & News',
      modelName: 'blog',
      tableNameRaw: 'blogs',
      description: 'Solar energy educational articles and news updates',
      searchFields: ['title', 'slug', 'excerpt'],
    },
    government_statistics: {
      name: 'Government Statistics & Schemes',
      modelName: 'governmentStatistic',
      tableNameRaw: 'government_statistics',
      description: 'PM Surya Ghar scheme metrics and official solar statistics',
      searchFields: ['metric', 'value', 'source'],
    },
    contact_messages: {
      name: 'Contact Form Inquiries',
      modelName: 'contactMessage',
      tableNameRaw: 'contact_messages',
      description: 'Direct website contact form submissions',
      searchFields: ['fullName', 'email', 'phone', 'subject'],
    },
    audit_logs: {
      name: 'System Audit Logs',
      modelName: 'auditLog',
      tableNameRaw: 'audit_logs',
      description: 'Immutable system audit trail (Read-Only)',
      readOnly: true,
      searchFields: ['userEmail', 'action', 'entityName', 'entityId'],
    },
  };

  async getTableMetadata(): Promise<TableMeta[]> {
    const tables: TableMeta[] = [];

    for (const [key, config] of Object.entries(this.allowedTables)) {
      let count = 0;
      try {
        const model = (this.prisma as any)[config.modelName];
        if (model && typeof model.count === 'function') {
          count = await model.count();
        } else {
          const rawCountRes: any[] = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as count FROM "${config.tableNameRaw}"`);
          count = rawCountRes[0]?.count || 0;
        }
      } catch (err) {
        this.logger.warn(`Count query fallback for ${key}: ${err.message}`);
        try {
          const rawCountRes: any[] = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as count FROM "${config.tableNameRaw}"`);
          count = rawCountRes[0]?.count || 0;
        } catch {
          count = 0;
        }
      }

      tables.push({
        key,
        name: config.name,
        description: config.description,
        readOnly: !!config.readOnly,
        count,
      });
    }

    return tables;
  }

  async getTableRecords(
    tableKey: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ) {
    const config = this.allowedTables[tableKey];
    if (!config) {
      throw new NotFoundException(`Table '${tableKey}' is not supported or accessible.`);
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search && config.searchFields.length > 0) {
      const searchTerm = query.search.trim();
      where.OR = config.searchFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      }));
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const model = (this.prisma as any)[config.modelName];

    let items: any[] = [];
    let total = 0;

    try {
      [items, total] = await Promise.all([
        model.findMany({
          where,
          skip,
          take: limit,
          orderBy,
        }),
        model.count({ where }),
      ]);
    } catch (primaryErr) {
      this.logger.warn(`Primary query failed for ${tableKey}: ${primaryErr.message}`);
      try {
        items = await model.findMany({ skip, take: limit });
        total = await model.count();
      } catch (secondaryErr) {
        this.logger.warn(`Secondary query failed for ${tableKey}: ${secondaryErr.message}`);
        try {
          const rawCountRes: any[] = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as count FROM "${config.tableNameRaw}"`);
          total = rawCountRes[0]?.count || 0;
          items = await this.prisma.$queryRawUnsafe(`SELECT * FROM "${config.tableNameRaw}" LIMIT ${limit} OFFSET ${skip}`);
        } catch (rawErr) {
          this.logger.error(`Raw SQL fallback failed for ${tableKey}: ${rawErr.message}`);
          items = [];
          total = 0;
        }
      }
    }

    // Sanitize any sensitive fields
    const sanitizedItems = (items || []).map((item) => this.sanitizeRecord(item));

    return {
      tableKey,
      tableName: config.name,
      readOnly: !!config.readOnly,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: sanitizedItems,
    };
  }

  async getRecordById(tableKey: string, id: string) {
    const config = this.allowedTables[tableKey];
    if (!config) {
      throw new NotFoundException(`Table '${tableKey}' is not supported.`);
    }

    const model = (this.prisma as any)[config.modelName];
    let record = null;
    try {
      record = await model.findUnique({ where: { id } });
    } catch {
      try {
        const rawRes: any[] = await this.prisma.$queryRawUnsafe(`SELECT * FROM "${config.tableNameRaw}" WHERE id = $1 LIMIT 1`, id);
        record = rawRes[0] || null;
      } catch {
        record = null;
      }
    }

    if (!record) {
      throw new NotFoundException(`Record with ID '${id}' not found in table '${tableKey}'.`);
    }

    return this.sanitizeRecord(record);
  }

  async updateRecord(
    tableKey: string,
    id: string,
    payload: Record<string, any>,
    adminUser: { id?: string; email: string; role?: string },
  ) {
    const config = this.allowedTables[tableKey];
    if (!config) {
      throw new NotFoundException(`Table '${tableKey}' is not supported.`);
    }

    if (config.readOnly) {
      throw new BadRequestException(`Table '${config.name}' is read-only and cannot be modified.`);
    }

    // Verify existing
    const existing = await this.getRecordById(tableKey, id);

    // Strip forbidden fields
    const updateData: Record<string, any> = { ...payload };
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.passwordHash;
    delete updateData.password_hash;

    const model = (this.prisma as any)[config.modelName];

    let updated: any = null;
    try {
      updated = await model.update({
        where: { id },
        data: updateData,
      });
    } catch (err) {
      throw new BadRequestException(`Failed to update record in ${config.name}: ${err.message}`);
    }

    // Log Audit action
    await this.auditLogService.logAction({
      action: 'DATABASE_RECORD_UPDATE',
      userId: adminUser.id,
      userEmail: adminUser.email,
      resource: config.name,
      resourceId: id,
      details: {
        tableKey,
        previousState: existing,
        updatedState: this.sanitizeRecord(updated),
      },
    });

    return this.sanitizeRecord(updated);
  }

  async deleteRecord(
    tableKey: string,
    id: string,
    adminUser: { id?: string; email: string; role?: string },
  ) {
    const config = this.allowedTables[tableKey];
    if (!config) {
      throw new NotFoundException(`Table '${tableKey}' is not supported.`);
    }

    if (config.readOnly) {
      throw new BadRequestException(`Table '${config.name}' is read-only and cannot be deleted.`);
    }

    // Only SUPER_ADMIN can perform destructive deletions
    if (adminUser.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Destructive record deletion requires SUPER_ADMIN privileges.');
    }

    const existing = await this.getRecordById(tableKey, id);

    const model = (this.prisma as any)[config.modelName];

    try {
      await model.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(`Failed to delete record from ${config.name}: ${err.message}`);
    }

    // Log Audit action
    await this.auditLogService.logAction({
      action: 'DATABASE_RECORD_DELETE',
      userId: adminUser.id,
      userEmail: adminUser.email,
      resource: config.name,
      resourceId: id,
      details: {
        tableKey,
        deletedRecord: existing,
      },
    });

    return {
      success: true,
      message: `Record '${id}' successfully deleted from ${config.name}.`,
      deletedId: id,
    };
  }

  private sanitizeRecord(record: any): any {
    if (!record || typeof record !== 'object') return record;
    const clone = { ...record };
    delete clone.passwordHash;
    delete clone.password_hash;
    return clone;
  }
}
