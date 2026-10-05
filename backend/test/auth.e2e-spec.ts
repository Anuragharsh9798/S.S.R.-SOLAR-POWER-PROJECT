process.env.NODE_ENV = 'test';
process.env.THROTTLE_LIMIT = '1000';
process.env.JWT_SECRET = 'ssr_solar_super_secret_jwt_key_2026';
process.env.JWT_EXPIRES_IN = '1d';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { RoleEnum } from '../src/auth/enums/role.enum';

jest.setTimeout(30000);

describe('Admin Authentication & RBAC (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  let adminCookie: string[];
  let adminToken: string;

  let staffCookie: string[];
  let staffToken: string;

  const adminUser = {
    email: 'admin.test@ssrsolar.com',
    phone: '+919876543210',
    password: 'AdminPassword123!',
    fullName: 'SSR System Admin',
    roleName: RoleEnum.ADMIN,
  };

  const staffUser = {
    email: 'staff.test@ssrsolar.com',
    phone: '+919876543211',
    password: 'StaffPassword123!',
    fullName: 'SSR Staff Member',
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
    await authService.seedDefaultRoles();

    try {
      await authService.createUser(adminUser);
      await authService.createUser(staffUser);
    } catch {
      // User created
    }

    // Authenticate Admin User once in setup
    const adminLoginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      });

    adminCookie = adminLoginRes.get('Set-Cookie') || [];
    adminToken = adminLoginRes.body.token;

    // Authenticate Staff User once in setup
    const staffLoginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: staffUser.email,
        password: staffUser.password,
      });

    staffCookie = staffLoginRes.get('Set-Cookie') || [];
    staffToken = staffLoginRes.body.token;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. POST /api/v1/auth/login - Should fail with 401 on invalid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: adminUser.email,
        password: 'WrongPassword123',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Invalid email address or password');
  });

  it('2. POST /api/v1/auth/login - Should succeed and set HttpOnly access_token cookie', async () => {
    expect(adminToken).toBeDefined();
    expect(adminCookie.some((c) => c.includes('access_token='))).toBe(true);
  });

  it('3. GET /api/v1/auth/me - Should return authenticated profile using cookie or Bearer token', async () => {
    const meRes = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', adminCookie)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user).toBeDefined();
    expect(meRes.body.user.email).toBe(adminUser.email);
    expect(meRes.body.user.role).toBe(RoleEnum.ADMIN);
  });

  it('4. GET /api/v1/admin/dashboard - Should GRANT access to ADMIN role', async () => {
    const adminRes = await request(app.getHttpServer())
      .get('/api/v1/admin/dashboard')
      .set('Cookie', adminCookie)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.message).toContain('Access granted to Admin Dashboard');
  });

  it('5. GET /api/v1/admin/dashboard - Should GRANT view access (200 OK) to STAFF role', async () => {
    const staffRes = await request(app.getHttpServer())
      .get('/api/v1/admin/dashboard')
      .set('Cookie', staffCookie)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(staffRes.status).toBe(200);
  });

  it('5b. GET /api/v1/admin/settings - Should DENY access (403 Forbidden) to STAFF role', async () => {
    const staffSettingsRes = await request(app.getHttpServer())
      .get('/api/v1/admin/settings')
      .set('Cookie', staffCookie)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(staffSettingsRes.status).toBe(403);
  });

  it('6. POST /api/v1/auth/logout - Should clear access_token cookie', async () => {
    const logoutRes = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', adminCookie);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toBe('Logout successful');

    // Verify GET /api/v1/auth/me is unauthenticated without token
    const meRes = await request(app.getHttpServer()).get('/api/v1/auth/me');
    expect(meRes.status).toBe(401);
  });
});
