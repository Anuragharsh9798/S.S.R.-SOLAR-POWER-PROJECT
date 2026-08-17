process.env.JWT_SECRET = 'ssr_solar_super_secret_jwt_key_2026';
process.env.JWT_EXPIRES_IN = '1d';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { RoleEnum } from '../src/auth/enums/role.enum';

describe('Projects, Reviews, Blogs & Contact APIs (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let adminToken: string;

  const adminUser = {
    email: 'admin.content@ssrsolar.com',
    phone: '+919876543299',
    password: 'AdminPassword123!',
    fullName: 'SSR Content Admin',
    roleName: RoleEnum.ADMIN,
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
    } catch {
      // User created
    }

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      });

    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // 1. PROJECTS TESTS
  it('1. GET /api/v1/projects - Should return list of projects', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('2. POST /api/v1/admin/projects - Should create project when authenticated as ADMIN', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Mau Solar Villa',
        slug: 'mau-solar-villa',
        type: 'Residential',
        location: 'Mau, UP',
        capacity: '10 kW',
        capacityKw: 10,
        completedDate: 'March 2026',
        annualSavings: '₹ 1.4 L / year',
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Mau Solar Villa');
    expect(res.body.slug).toBe('mau-solar-villa');
  });

  // 2. REVIEWS TESTS (Approval Workflow)
  it('3. POST /api/v1/reviews & Approval Workflow - Review must require admin approval before becoming public', async () => {
    // Step A: Submit new review (default isApproved = false)
    const submitRes = await request(app.getHttpServer())
      .post('/api/v1/reviews')
      .send({
        name: 'Virendra Verma',
        location: 'Kutubpur, Mau',
        rating: 5,
        quote: 'Extremely neat solar structure work and fast net-metering setup!',
      });

    expect(submitRes.status).toBe(201);
    expect(submitRes.body.isApproved).toBe(false);
    const reviewId = submitRes.body.reviewId;

    // Step B: Public GET /api/v1/reviews should NOT contain unapproved review
    const publicResBefore = await request(app.getHttpServer()).get('/api/v1/reviews');
    expect(publicResBefore.status).toBe(200);
    expect(publicResBefore.body.some((r) => r.id === reviewId)).toBe(false);

    // Step C: Admin approves review
    const approveRes = await request(app.getHttpServer())
      .patch(`/api/v1/admin/reviews/${reviewId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isApproved: true });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.isApproved).toBe(true);

    // Step D: Public GET /api/v1/reviews NOW contains the approved review
    const publicResAfter = await request(app.getHttpServer()).get('/api/v1/reviews');
    expect(publicResAfter.status).toBe(200);
    expect(publicResAfter.body.some((r) => r.id === reviewId)).toBe(true);
  });

  // 3. BLOGS TESTS
  it('4. POST /api/v1/admin/blogs & GET /api/v1/blogs - Should create and retrieve blog post by slug', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/v1/admin/blogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: '8 Things to Check Before Installing Rooftop Solar',
        slug: '8-things-before-installing-rooftop-solar',
        excerpt: 'Essential checklist before going solar in UP',
        content: 'Check roof orientation, shadow clearance, and structural strength...',
        readTime: '6 min read',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.slug).toBe('8-things-before-installing-rooftop-solar');

    // Fetch public list
    const listRes = await request(app.getHttpServer()).get('/api/v1/blogs');
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBeGreaterThan(0);

    // Fetch by slug
    const detailRes = await request(app.getHttpServer()).get('/api/v1/blogs/8-things-before-installing-rooftop-solar');
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.title).toBe('8 Things to Check Before Installing Rooftop Solar');
  });

  // 4. CONTACT TEST
  it('5. POST /api/v1/contact - Should submit contact message with DTO validation', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/contact')
      .send({
        fullName: 'Anil Yadav',
        email: 'anil@example.com',
        phone: '+919876543210',
        subject: 'Commercial Solar Query',
        message: 'Interested in 50 kW plant for our hospital in Mau',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toContain('Your message has been received');
  });
});
