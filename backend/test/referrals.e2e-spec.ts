process.env.JWT_SECRET = 'ssr_solar_super_secret_jwt_key_2026';
process.env.JWT_EXPIRES_IN = '1d';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { AuditLogService } from '../src/audit-log/audit-log.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RoleEnum } from '../src/auth/enums/role.enum';

describe('Referrals State Machine & Audit Logging (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let auditLogService: AuditLogService;
  let prismaService: PrismaService;
  let adminToken: string;
  let staffToken: string;

  const createdClaimNumbers: string[] = [];

  const getRandomPhone = () => `+919${Math.floor(100000000 + Math.random() * 900000000)}`;

  const adminUser = {
    email: 'admin.workflow@ssrsolar.com',
    phone: '+919876543888',
    password: 'AdminPassword123!',
    fullName: 'SSR Workflow Admin',
    roleName: RoleEnum.ADMIN,
  };

  const staffUser = {
    email: 'staff.workflow@ssrsolar.com',
    phone: '+919876543777',
    password: 'StaffPassword123!',
    fullName: 'SSR Workflow Staff',
    roleName: RoleEnum.STAFF,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    auditLogService = moduleFixture.get<AuditLogService>(AuditLogService);
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await authService.seedDefaultRoles();

    try { await authService.createUser(adminUser); } catch {}
    try { await authService.createUser(staffUser); } catch {}

    const adminLoginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = adminLoginRes.body.token;

    const staffLoginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: staffUser.email, password: staffUser.password });
    staffToken = staffLoginRes.body.token;
  });

  afterAll(async () => {
    // Clean up ONLY specific test referral claims created during this test run
    if (createdClaimNumbers.length > 0 && prismaService) {
      try {
        await prismaService.referral.deleteMany({
          where: { claimNumber: { in: createdClaimNumbers } },
        });
      } catch {}
    }
    if (app) {
      await app.close();
    }
  });

  it('1. VALID TRANSITION: PENDING -> APPROVED -> PAID flow', async () => {
    // Submit claim 1 with unique test phone numbers
    const subRes = await request(app.getHttpServer())
      .post('/api/v1/referrals')
      .send({
        referrerName: 'Test Referrer Anil',
        referrerPhone: getRandomPhone(),
        friendName: 'Test Friend Sunil',
        friendPhone: getRandomPhone(),
        friendCity: 'Mumbai',
      });

    expect(subRes.status).toBe(201);
    const claimNumber = subRes.body.claimNumber;
    expect(claimNumber).toBeDefined();
    createdClaimNumbers.push(claimNumber);
    expect(subRes.body.status).toBe('PENDING');

    // Approve claim: PENDING -> APPROVED
    const appRes = await request(app.getHttpServer())
      .patch(`/api/v1/admin/referrals/${claimNumber}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ adminNotes: 'Rooftop inspection passed' });

    expect(appRes.status).toBe(200);
    expect(appRes.body.status).toBe('APPROVED');
    expect(appRes.body.reviewedBy).toBeDefined();

    // Mark paid claim: APPROVED -> PAID
    const paidRes = await request(app.getHttpServer())
      .patch(`/api/v1/admin/referrals/${claimNumber}/mark-paid`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ adminNotes: 'Reward paid via Bank Transfer' });

    expect(paidRes.status).toBe(200);
    expect(paidRes.body.status).toBe('PAID');
  });

  it('2. VALID TRANSITION: PENDING -> REJECTED flow', async () => {
    // Submit claim 2 with unique test phone numbers
    const subRes = await request(app.getHttpServer())
      .post('/api/v1/referrals')
      .send({
        referrerName: 'Test Referrer Vikram',
        referrerPhone: getRandomPhone(),
        friendName: 'Test Friend Karan',
        friendPhone: getRandomPhone(),
        friendCity: 'Delhi',
      });

    expect(subRes.status).toBe(201);
    const claimNumber = subRes.body.claimNumber;
    expect(claimNumber).toBeDefined();
    createdClaimNumbers.push(claimNumber);

    // Reject claim: PENDING -> REJECTED
    const rejRes = await request(app.getHttpServer())
      .patch(`/api/v1/admin/referrals/${claimNumber}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ rejectionReason: 'Insufficient roof space', adminNotes: 'Site survey failed' });

    expect(rejRes.status).toBe(200);
    expect(rejRes.body.status).toBe('REJECTED');
    expect(rejRes.body.rejectionReason).toBe('Insufficient roof space');
  });

  it('3. INVALID TRANSITION: PENDING -> PAID must be BLOCKED with 400 Bad Request', async () => {
    // Submit claim 3 with unique test phone numbers
    const subRes = await request(app.getHttpServer())
      .post('/api/v1/referrals')
      .send({
        referrerName: 'Test Referrer Rohit',
        referrerPhone: getRandomPhone(),
        friendName: 'Test Friend Virat',
        friendPhone: getRandomPhone(),
        friendCity: 'Bangalore',
      });

    expect(subRes.status).toBe(201);
    const claimNumber = subRes.body.claimNumber;
    expect(claimNumber).toBeDefined();
    createdClaimNumbers.push(claimNumber);

    // Attempt direct PENDING -> PAID
    const paidRes = await request(app.getHttpServer())
      .patch(`/api/v1/admin/referrals/${claimNumber}/mark-paid`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ adminNotes: 'Attempting invalid direct payment' });

    expect(paidRes.status).toBe(400);
    expect(paidRes.body.message).toContain('Invalid status transition from PENDING to PAID');
  });

  it('4. INVALID TRANSITION: REJECTED -> PAID and REJECTED -> APPROVED must be BLOCKED with 400 Bad Request', async () => {
    // Submit claim 4 & reject it
    const subRes = await request(app.getHttpServer())
      .post('/api/v1/referrals')
      .send({
        referrerName: 'Test Referrer Hardik',
        referrerPhone: getRandomPhone(),
        friendName: 'Test Friend Rahul',
        friendPhone: getRandomPhone(),
        friendCity: 'Ahmedabad',
      });

    expect(subRes.status).toBe(201);
    const claimNumber = subRes.body.claimNumber;
    expect(claimNumber).toBeDefined();
    createdClaimNumbers.push(claimNumber);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/referrals/${claimNumber}/reject`)
      .set('Authorization', `Bearer ${adminToken}`);

    // Attempt REJECTED -> PAID
    const paidRes = await request(app.getHttpServer())
      .patch(`/api/v1/admin/referrals/${claimNumber}/mark-paid`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(paidRes.status).toBe(400);
    expect(paidRes.body.message).toContain('Invalid status transition from REJECTED to PAID');

    // Attempt REJECTED -> APPROVED
    const appRes = await request(app.getHttpServer())
      .patch(`/api/v1/admin/referrals/${claimNumber}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(appRes.status).toBe(400);
    expect(appRes.body.message).toContain('Invalid status transition from REJECTED to APPROVED');
  });

  it('5. AUDIT LOGGING: Must create audit log entries for all admin referral actions', async () => {
    const logs = await auditLogService.getLogs();
    expect(logs).toBeDefined();

    const referralApprovedLogs = logs.filter((l: any) => l.action === 'REFERRAL_APPROVED');
    const referralRejectedLogs = logs.filter((l: any) => l.action === 'REFERRAL_REJECTED');
    const referralPaidLogs = logs.filter((l: any) => l.action === 'REFERRAL_MARKED_PAID');

    expect(referralApprovedLogs.length).toBeGreaterThan(0);
    expect(referralRejectedLogs.length).toBeGreaterThan(0);
    expect(referralPaidLogs.length).toBeGreaterThan(0);
  });
});
