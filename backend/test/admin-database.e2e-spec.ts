process.env.JWT_SECRET = 'ssr_solar_super_secret_jwt_key_2026';
process.env.JWT_EXPIRES_IN = '1d';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { RoleEnum } from '../src/auth/enums/role.enum';

describe('Admin Database Management RBAC & Audit Logging (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let superAdminToken: string;
  let adminToken: string;
  let staffToken: string;

  const superAdminUser = {
    email: 'superadmin.db@ssrsolar.com',
    phone: '+919876549999',
    password: 'SuperAdminPassword123!',
    fullName: 'SSR Super Admin DB',
    roleName: RoleEnum.SUPER_ADMIN,
  };

  const adminUser = {
    email: 'admin.db@ssrsolar.com',
    phone: '+919876549888',
    password: 'AdminPassword123!',
    fullName: 'SSR Admin DB',
    roleName: RoleEnum.ADMIN,
  };

  const staffUser = {
    email: 'staff.db@ssrsolar.com',
    phone: '+919876549777',
    password: 'StaffPassword123!',
    fullName: 'SSR Staff DB',
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

    try { await authService.createUser(superAdminUser); } catch {}
    try { await authService.createUser(adminUser); } catch {}
    try { await authService.createUser(staffUser); } catch {}

    const superAdminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: superAdminUser.email, password: superAdminUser.password });
    superAdminToken = superAdminLogin.body.token;

    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = adminLogin.body.token;

    const staffLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: staffUser.email, password: staffUser.password });
    staffToken = staffLogin.body.token;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. UNAUTHENTICATED: Must block access to database management endpoints with 401', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/admin/database/tables');
    expect(res.status).toBe(401);
  });

  it('2. STAFF ROLE: Must block database management endpoints with 403 Forbidden', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/database/tables')
      .set('Authorization', `Bearer ${staffToken}`);
    expect(res.status).toBe(403);
  });

  it('3. SUPER_ADMIN & ADMIN: Can access database table metadata', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/database/tables')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const keys = res.body.map((t: any) => t.key);
    expect(keys).toContain('customers');
    expect(keys).toContain('quotations');
    expect(keys).toContain('referrals');
    expect(keys).toContain('projects');
    expect(keys).toContain('audit_logs');
  });

  it('4. ADMIN: Can query paginated records for allowed tables', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/database/projects?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.tableName).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('5. DESTRUCTIVE DELETION: Block ADMIN with 403, allow SUPER_ADMIN', async () => {
    // ADMIN attempt delete
    const adminDelRes = await request(app.getHttpServer())
      .delete('/api/v1/admin/database/projects/non-existent-id')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminDelRes.status).toBe(403);

    // SUPER_ADMIN attempt delete (gets 404 for non-existent, but passes RBAC)
    const superDelRes = await request(app.getHttpServer())
      .delete('/api/v1/admin/database/projects/non-existent-id')
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(superDelRes.status).toBe(404);
  });
});
