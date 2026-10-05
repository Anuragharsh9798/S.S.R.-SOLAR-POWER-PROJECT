import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class AdminSettingsService {
  private readonly logger = new Logger(AdminSettingsService.name);

  // Safe Application & Business Settings State
  private businessSettings = {
    companyName: 'SSR Solar Power',
    contactEmail: 'contact@ssrsolar.com',
    hotlinePhone: '+91 98765 43210',
    officeAddress: 'Kutubpur, Bahadurpur, Mau, Uttar Pradesh - 221602',
    operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    gstin: '09AAAAA0000A1Z5',
    defaultSubsidyScheme: 'PM Surya Ghar Muft Bijli Yojana 2026',
    defaultReferralRewardRs: 5000,
  };

  private securityControls = {
    sessionDuration: '24 Hours',
    loginRateLimitPerMin: 10,
    allowedCorsOrigins: ['http://localhost:8080', 'http://localhost:3000'],
    auditLoggingActive: true,
    rbacEnforcementMode: 'STRICT_DB_ROLES',
    httpsCookiesEnabled: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Retrieves safe settings filtered according to the caller's role.
   * STAFF role receives 403 Forbidden.
   */
  async getSettingsForRole(user: any) {
    const role = user?.role || user?.roleName;

    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new ForbiddenException('Access Denied: Staff accounts do not have settings access.');
    }

    // Business-level settings for ADMIN
    if (role === 'ADMIN') {
      return {
        role: 'ADMIN',
        business: this.businessSettings,
      };
    }

    // Full administrative settings suite for SUPER_ADMIN
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return {
      role: 'SUPER_ADMIN',
      business: this.businessSettings,
      security: this.securityControls,
      users,
      roles,
    };
  }

  /**
   * Updates business-level settings (SUPER_ADMIN and ADMIN).
   */
  async updateBusinessSettings(dto: Partial<typeof this.businessSettings>, actor: any) {
    const role = actor?.role || actor?.roleName;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new ForbiddenException('Access Denied: Settings update restricted.');
    }

    this.businessSettings = { ...this.businessSettings, ...dto };

    await this.auditLogService.logAction({
      action: 'BUSINESS_SETTINGS_UPDATE',
      userId: actor.id || actor.sub,
      userEmail: actor.email,
      resource: 'BUSINESS_SETTINGS',
      details: dto,
    });

    return {
      message: 'Business settings updated successfully.',
      business: this.businessSettings,
    };
  }

  /**
   * Updates security/session policy controls (SUPER_ADMIN ONLY).
   */
  async updateSecurityControls(dto: Partial<typeof this.securityControls>, actor: any) {
    const role = actor?.role || actor?.roleName;
    if (role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access Denied: Security controls update restricted to SUPER_ADMIN.');
    }

    this.securityControls = { ...this.securityControls, ...dto };

    await this.auditLogService.logAction({
      action: 'SECURITY_POLICIES_UPDATE',
      userId: actor.id || actor.sub,
      userEmail: actor.email,
      resource: 'SECURITY_CONTROLS',
      details: dto,
    });

    return {
      message: 'Security controls updated successfully.',
      security: this.securityControls,
    };
  }

  /**
   * Updates user active status or role (SUPER_ADMIN ONLY).
   */
  async updateUserRoleOrStatus(userId: string, data: { isActive?: boolean; roleName?: string }, actor: any) {
    const role = actor?.role || actor?.roleName;
    if (role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access Denied: User role/status update restricted to SUPER_ADMIN.');
    }

    let roleObj = null;
    if (data.roleName) {
      roleObj = await this.prisma.role.findUnique({ where: { name: data.roleName } });
    }

    const updateData: any = {};
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (roleObj) updateData.roleId = roleObj.id;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        role: { select: { name: true } },
      },
    });

    await this.auditLogService.logAction({
      action: 'USER_PERMISSION_CHANGE',
      userId: actor.id || actor.sub,
      userEmail: actor.email,
      resource: 'USER_MANAGEMENT',
      resourceId: userId,
      details: { targetEmail: updatedUser.email, changes: data },
    });

    return {
      message: `User ${updatedUser.email} updated successfully.`,
      user: updatedUser,
    };
  }

  /**
   * Retrieves security audit log stream (SUPER_ADMIN ONLY).
   */
  async getAuditLogs(actor: any) {
    const role = actor?.role || actor?.roleName;
    if (role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Access Denied: Audit log stream restricted to SUPER_ADMIN.');
    }

    return await this.auditLogService.getLogs();
  }
}
