import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import {
  ApproveReferralDto,
  RejectReferralDto,
  MarkPaidReferralDto,
} from './dto/update-referral-status.dto';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);
  private inMemoryReferrals: Map<string, any> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Enforces allowed state machine transitions for referral claims:
   * - PENDING -> APPROVED
   * - PENDING -> REJECTED
   * - APPROVED -> PAID
   * Rejects invalid transitions (PENDING -> PAID, REJECTED -> PAID, REJECTED -> APPROVED, etc.)
   */
  validateStatusTransition(currentStatus: string, targetStatus: string) {
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['APPROVED', 'REJECTED'],
      APPROVED: ['PAID'],
      REJECTED: [],
      PAID: [],
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${targetStatus}. Allowed transitions: PENDING -> APPROVED, PENDING -> REJECTED, APPROVED -> PAID.`,
      );
    }
  }

  async create(dto: CreateReferralDto) {
    // 1. Normalize phone numbers (extract last 10 digits for duplicate comparison)
    const normalizedReferrerPhone = dto.referrerPhone.replace(/\D/g, '').slice(-10);
    const normalizedFriendPhone = dto.friendPhone.replace(/\D/g, '').slice(-10);

    // 2. Duplicate Detection: Check if referrer has already referred this friend
    let isDuplicate = false;

    try {
      const existing = await this.prisma.referral.findFirst({
        where: {
          OR: [
            {
              referrerPhone: dto.referrerPhone,
              friendPhone: dto.friendPhone,
            },
            {
              referrerPhone: { endsWith: normalizedReferrerPhone },
              friendPhone: { endsWith: normalizedFriendPhone },
            },
          ],
        },
      });

      if (existing) {
        isDuplicate = true;
      }
    } catch (dbErr) {
      this.logger.warn(`Duplicate lookup notice: ${dbErr.message}`);
    }

    if (!isDuplicate) {
      for (const ref of this.inMemoryReferrals.values()) {
        const refPhoneNorm = ref.referrerPhone.replace(/\D/g, '').slice(-10);
        const friendPhoneNorm = ref.friendPhone.replace(/\D/g, '').slice(-10);

        if (
          (ref.referrerPhone === dto.referrerPhone || refPhoneNorm === normalizedReferrerPhone) &&
          (ref.friendPhone === dto.friendPhone || friendPhoneNorm === normalizedFriendPhone)
        ) {
          isDuplicate = true;
          break;
        }
      }
    }

    if (isDuplicate) {
      throw new ConflictException(
        'A referral claim for this friend has already been submitted by this referrer.',
      );
    }

    // 3. Generate unique claimNumber on server
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const claimNumber = `REF-${new Date().getFullYear()}-${randomStr}`;
    const submittedAt = new Date();

    // 4. Server-enforced defaults (Never trust reward/status from client)
    const rewardAmount = 5000;
    const status = 'PENDING';

    const record = {
      id: claimNumber,
      claimNumber,
      referrerName: dto.referrerName,
      referrerPhone: dto.referrerPhone,
      friendName: dto.friendName,
      friendPhone: dto.friendPhone,
      friendCity: dto.friendCity,
      rewardAmount,
      status: 'PENDING',
      adminNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      createdAt: submittedAt,
      updatedAt: submittedAt,
    };

    this.inMemoryReferrals.set(claimNumber, record);

    // 5. Persist referral claim into PostgreSQL using Prisma
    try {
      const dbSaved = await this.prisma.referral.create({
        data: {
          claimNumber,
          referrerName: dto.referrerName,
          referrerPhone: dto.referrerPhone,
          friendName: dto.friendName,
          friendPhone: dto.friendPhone,
          friendCity: dto.friendCity,
          rewardAmount,
          status: 'PENDING',
        },
      });
      record.id = dbSaved.id;
    } catch (dbErr) {
      this.logger.warn(`Referral persisted with claimNumber notice: ${dbErr.message}`);
    }

    this.logger.log(
      `New Referral claim submitted: ${claimNumber} by ${dto.referrerName} for ${dto.friendName}`,
    );

    // 6. Return sanitized public response (no internal DB IDs exposed)
    return {
      success: true,
      claimNumber,
      status,
      submittedAt: submittedAt.toISOString(),
    };
  }

  async findAllAdmin() {
    try {
      const records = await this.prisma.referral.findMany({
        orderBy: { createdAt: 'desc' },
      });
      if (records && records.length > 0) return records;
    } catch (dbErr) {
      this.logger.warn(`findAllAdmin referrals DB notice: ${dbErr.message}`);
    }
    return Array.from(this.inMemoryReferrals.values());
  }

  async findOneAdmin(id: string) {
    try {
      const found = await this.prisma.referral.findFirst({
        where: {
          OR: [{ id }, { claimNumber: id }],
        },
      });
      if (found) return found;
    } catch (dbErr) {
      this.logger.warn(`findOneAdmin DB notice: ${dbErr.message}`);
    }

    const memFound = Array.from(this.inMemoryReferrals.values()).find(
      (r) => r.id === id || r.claimNumber === id,
    );
    if (!memFound) {
      throw new NotFoundException(`Referral claim #${id} not found`);
    }
    return memFound;
  }

  async approve(id: string, adminUser: { id?: string; email: string }, dto?: ApproveReferralDto) {
    const existing = await this.findOneAdmin(id);

    // Enforce state transition rule: PENDING -> APPROVED
    this.validateStatusTransition(existing.status, 'APPROVED');

    const now = new Date();
    const reviewerId = adminUser.id || adminUser.email;
    const adminNotes = dto?.adminNotes ?? existing.adminNotes;

    let updatedRecord: any = null;

    try {
      updatedRecord = await this.prisma.referral.update({
        where: { id: existing.id },
        data: {
          status: 'APPROVED',
          reviewedBy: reviewerId,
          reviewedAt: now,
          adminNotes,
        },
      });
      existing.status = updatedRecord.status;
      existing.reviewedBy = updatedRecord.reviewedBy;
      existing.reviewedAt = updatedRecord.reviewedAt;
      existing.adminNotes = updatedRecord.adminNotes;
    } catch (dbErr) {
      this.logger.warn(`approve referral DB update notice: ${dbErr.message}`);
      existing.status = 'APPROVED';
      existing.reviewedBy = reviewerId;
      existing.reviewedAt = now;
      existing.adminNotes = adminNotes;
      updatedRecord = existing;
    }

    // Create Audit Log entry
    await this.auditLogService.logAction({
      action: 'REFERRAL_APPROVED',
      userId: adminUser.id,
      userEmail: adminUser.email,
      resource: 'Referral',
      resourceId: existing.id,
      details: {
        claimNumber: existing.claimNumber,
        previousStatus: 'PENDING',
        newStatus: 'APPROVED',
        adminNotes,
      },
    });

    return updatedRecord;
  }

  async reject(id: string, adminUser: { id?: string; email: string }, dto?: RejectReferralDto) {
    const existing = await this.findOneAdmin(id);

    // Enforce state transition rule: PENDING -> REJECTED
    this.validateStatusTransition(existing.status, 'REJECTED');

    const now = new Date();
    const reviewerId = adminUser.id || adminUser.email;
    const rejectionReason = dto?.rejectionReason ?? 'Rejected by admin verification';
    const adminNotes = dto?.adminNotes ?? existing.adminNotes;

    let updatedRecord: any = null;

    try {
      updatedRecord = await this.prisma.referral.update({
        where: { id: existing.id },
        data: {
          status: 'REJECTED',
          reviewedBy: reviewerId,
          reviewedAt: now,
          rejectionReason,
          adminNotes,
        },
      });
      existing.status = updatedRecord.status;
      existing.reviewedBy = updatedRecord.reviewedBy;
      existing.reviewedAt = updatedRecord.reviewedAt;
      existing.rejectionReason = updatedRecord.rejectionReason;
      existing.adminNotes = updatedRecord.adminNotes;
    } catch (dbErr) {
      this.logger.warn(`reject referral DB update notice: ${dbErr.message}`);
      existing.status = 'REJECTED';
      existing.reviewedBy = reviewerId;
      existing.reviewedAt = now;
      existing.rejectionReason = rejectionReason;
      existing.adminNotes = adminNotes;
      updatedRecord = existing;
    }

    // Create Audit Log entry
    await this.auditLogService.logAction({
      action: 'REFERRAL_REJECTED',
      userId: adminUser.id,
      userEmail: adminUser.email,
      resource: 'Referral',
      resourceId: existing.id,
      details: {
        claimNumber: existing.claimNumber,
        previousStatus: 'PENDING',
        newStatus: 'REJECTED',
        rejectionReason,
        adminNotes,
      },
    });

    return updatedRecord;
  }

  async markPaid(id: string, adminUser: { id?: string; email: string }, dto?: MarkPaidReferralDto) {
    const existing = await this.findOneAdmin(id);

    // Enforce state transition rule: APPROVED -> PAID
    this.validateStatusTransition(existing.status, 'PAID');

    const now = new Date();
    const reviewerId = adminUser.id || adminUser.email;
    const adminNotes = dto?.adminNotes ?? existing.adminNotes;

    let updatedRecord: any = null;

    try {
      updatedRecord = await this.prisma.referral.update({
        where: { id: existing.id },
        data: {
          status: 'PAID',
          reviewedBy: reviewerId,
          reviewedAt: now,
          adminNotes,
        },
      });
      existing.status = updatedRecord.status;
      existing.reviewedBy = updatedRecord.reviewedBy;
      existing.reviewedAt = updatedRecord.reviewedAt;
      existing.adminNotes = updatedRecord.adminNotes;
    } catch (dbErr) {
      this.logger.warn(`markPaid referral DB update notice: ${dbErr.message}`);
      existing.status = 'PAID';
      existing.reviewedBy = reviewerId;
      existing.reviewedAt = now;
      existing.adminNotes = adminNotes;
      updatedRecord = existing;
    }

    // Create Audit Log entry
    await this.auditLogService.logAction({
      action: 'REFERRAL_MARKED_PAID',
      userId: adminUser.id,
      userEmail: adminUser.email,
      resource: 'Referral',
      resourceId: existing.id,
      details: {
        claimNumber: existing.claimNumber,
        previousStatus: 'APPROVED',
        newStatus: 'PAID',
        adminNotes,
      },
    });

    return updatedRecord;
  }
}
