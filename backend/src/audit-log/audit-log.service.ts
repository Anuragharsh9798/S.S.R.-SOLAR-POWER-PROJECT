import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum AuditAction {
  LOGIN = 'LOGIN',
  FAILED_LOGIN = 'FAILED_LOGIN',
  LOGOUT = 'LOGOUT',
  QUOTE_UPDATE = 'QUOTE_UPDATE',
  PROJECT_CREATE = 'PROJECT_CREATE',
  PROJECT_UPDATE = 'PROJECT_UPDATE',
  PROJECT_DELETE = 'PROJECT_DELETE',
  REVIEW_APPROVE = 'REVIEW_APPROVE',
  BLOG_CREATE = 'BLOG_CREATE',
  BLOG_UPDATE = 'BLOG_UPDATE',
  BLOG_DELETE = 'BLOG_DELETE',
  GOVT_DATA_UPDATE = 'GOVT_DATA_UPDATE',
  USER_PERMISSION_CHANGE = 'USER_PERMISSION_CHANGE',
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);
  private inMemoryLogs: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async logAction(data: {
    action: AuditAction | string;
    userId?: string;
    userEmail?: string;
    resource?: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const sanitizedDetails = this.sanitizeData(data.details);
    const logRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action: data.action,
      actorId: data.userId,
      userEmail: data.userEmail,
      entityName: data.resource || 'SYSTEM',
      entityId: data.resourceId,
      changesJson: JSON.stringify(sanitizedDetails),
      ipAddress: data.ipAddress || '127.0.0.1',
      userAgent: data.userAgent || 'Internal System',
      createdAt: new Date(),
    };

    this.inMemoryLogs.unshift(logRecord);
    if (this.inMemoryLogs.length > 500) {
      this.inMemoryLogs.pop();
    }

    try {
      await this.prisma.auditLog.create({
        data: {
          action: data.action,
          actorId: data.userId,
          userEmail: data.userEmail,
          entityName: data.resource || 'SYSTEM',
          entityId: data.resourceId,
          changesJson: JSON.stringify(sanitizedDetails),
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (err) {
      this.logger.warn(`Audit log saved in memory cache. DB notice: ${err.message}`);
    }

    this.logger.log(`AUDIT EVENT: [${data.action}] by ${data.userEmail || 'anonymous'} on ${data.resource || 'system'}`);
  }

  async getLogs() {
    try {
      return await this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    } catch {
      return this.inMemoryLogs;
    }
  }

  private sanitizeData(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    const sensitiveKeys = ['password', 'passwordhash', 'token', 'access_token', 'jwt', 'secret', 'apikey'];
    const clean: any = Array.isArray(obj) ? [] : {};

    for (const [k, v] of Object.entries(obj)) {
      if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
        clean[k] = '[REDACTED_CREDENTIAL]';
      } else if (v && typeof v === 'object') {
        clean[k] = this.sanitizeData(v);
      } else {
        clean[k] = v;
      }
    }
    return clean;
  }
}
