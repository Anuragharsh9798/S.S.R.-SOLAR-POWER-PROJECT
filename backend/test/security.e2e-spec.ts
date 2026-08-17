import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';

describe('Backend Security Infrastructure (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(helmet());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Should return security headers (Helmet)', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(res.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
    expect(res.headers).not.toHaveProperty('x-powered-by');
  });

  it('2. Should reject mass assignment & extra non-whitelisted fields with 400 Bad Request', async () => {
    const res = await request(app.getHttpServer())
      .post('/security-test/validate')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword123',
        isAdmin: true, // Non-whitelisted field
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('property isAdmin should not exist');
  });

  it('3. Should automatically sanitize & strip sensitive keys from responses (Excessive Data Exposure Protection)', async () => {
    const res = await request(app.getHttpServer())
      .post('/security-test/validate')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword123',
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.name).toBe('John Doe');
    // Verify passwordHash and secretKey were stripped by SanitizeResponseInterceptor
    expect(res.body.data.passwordHash).toBeUndefined();
    expect(res.body.data.secretKey).toBeUndefined();
  });

  it('4. Should trigger 429 Too Many Requests on rate limit breach', async () => {
    const endpoint = '/security-test/strict-rate-limit';

    // Exceed strict rate limit of 3 requests
    await request(app.getHttpServer()).get(endpoint);
    await request(app.getHttpServer()).get(endpoint);
    await request(app.getHttpServer()).get(endpoint);
    const res = await request(app.getHttpServer()).get(endpoint);

    expect(res.status).toBe(429);
  });
});
