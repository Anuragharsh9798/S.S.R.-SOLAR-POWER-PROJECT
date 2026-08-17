import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Quotation API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  it('1. POST /api/v1/quotations - Should reject invalid phone number with 400 Bad Request', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/quotations')
      .send({
        fullName: 'Ramesh Singh',
        phone: '12345', // Invalid Indian mobile
        address: 'Kutubpur',
        city: 'Mau',
      });

    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body.message)).toContain('valid 10-digit Indian phone number');
  });

  it('2. POST /api/v1/quotations - Should create quote with server-side sizing & location data', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/quotations')
      .send({
        fullName: 'Ramesh Singh',
        phone: '9876543210',
        email: 'ramesh@example.com',
        address: 'Kutubpur, Bahadurpur',
        houseNumber: '12-B',
        area: 'Kutubpur',
        city: 'Mau',
        district: 'Mau',
        state: 'Uttar Pradesh',
        pincode: '221602',
        latitude: 25.9417,
        longitude: 83.5611,
        accuracy: '12 meters',
        googleMapsUrl: 'https://www.google.com/maps?q=25.9417,83.5611',
        monthlyBillAmount: 6000,
        electricityRate: 8.0,
        solarType: 'On-Grid',
        contactTime: 'Morning (9 AM - 12 PM)',
        message: 'Looking for rooftop solar installation under PM Surya Ghar Yojana',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Quotation request received successfully');
    expect(res.body.quoteNumber).toMatch(/^SSR-2026-[A-Z0-9]{6}$/);
    expect(res.body.customerName).toBe('Ramesh Singh');
    expect(res.body.location.city).toBe('Mau');
    expect(res.body.location.latitude).toBe(25.9417);
    expect(res.body.calculation.recommendedPlantSizeKw).toBeGreaterThanOrEqual(3);
  });
});
