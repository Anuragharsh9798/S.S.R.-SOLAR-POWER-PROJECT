import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('dashboard')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.STAFF)
  async getDashboardMetrics(@Req() req: any) {
    // 1. Real Database Count Metrics
    const [
      totalCustomers,
      newQuoteRequests,
      pendingQuotes,
      totalProjects,
      pendingReferrals,
      approvedReferrals,
      paidReferrals,
      pendingReviews,
      publishedBlogs,
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.quotation.count({ where: { status: 'NEW' } }),
      this.prisma.quotation.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
      this.prisma.project.count(),
      this.prisma.referral.count({ where: { status: 'PENDING' } }),
      this.prisma.referral.count({ where: { status: 'APPROVED' } }),
      this.prisma.referral.count({ where: { status: 'PAID' } }),
      this.prisma.review.count({ where: { isApproved: false } }),
      this.prisma.blog.count({ where: { isPublished: true } }),
    ]);

    // 2. Real Recent Items (5 most recent)
    const [recentQuotes, recentReferrals, recentProjects, recentReviews, auditLogs] = await Promise.all([
      this.prisma.quotation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          quoteNumber: true,
          fullName: true,
          phone: true,
          city: true,
          solarType: true,
          recommendedCapacityKw: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.referral.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          claimNumber: true,
          referrerName: true,
          friendName: true,
          friendCity: true,
          rewardAmount: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          location: true,
          capacity: true,
          rating: true,
          createdAt: true,
        },
      }),
      this.prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          location: true,
          rating: true,
          quote: true,
          isApproved: true,
          createdAt: true,
        },
      }),
      this.prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          entityName: true,
          createdAt: true,
          actor: {
            select: {
              email: true,
              fullName: true,
            },
          },
        },
      }),
    ]);

    const recentActivity = auditLogs.map((log) => ({
      id: log.id,
      userEmail: log.actor?.email || log.actor?.fullName || 'System Event',
      action: log.action,
      entityName: log.entityName,
      createdAt: log.createdAt,
    }));

    return {
      message: 'Access granted to Admin Dashboard Overview',
      actor: req.user,
      metrics: {
        totalCustomers,
        newQuoteRequests,
        pendingQuotes,
        totalProjects,
        pendingReferrals,
        approvedReferrals,
        paidReferrals,
        pendingReviews,
        publishedBlogs,
      },
      recentQuotes,
      recentReferrals,
      recentProjects,
      recentReviews,
      recentActivity,
    };
  }

  @Get('content')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CONTENT_MANAGER)
  getContentManagement() {
    return {
      message: 'Access granted to Content Management Suite',
    };
  }
}
