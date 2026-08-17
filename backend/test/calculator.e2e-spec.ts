import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Solar Calculator API (e2e)', () => {
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

  it('POST /api/v1/calculator/calculate - Should calculate 530W panel specs & subsidy correctly for ₹6,000 monthly bill (6kW plant)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/calculator/calculate')
      .send({
        monthlyBillAmount: 6000,
        electricityRate: 8.0,
        state: 'Uttar Pradesh',
        city: 'Mau',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');

    const data = res.body.data;
    // 6000 bill / 8.0 rate = 750 units/month -> 25 kWh/day -> 25 / 4.5 = 5.55 kW -> 6 kW plant
    expect(data.recommendedPlantSizeKw).toBe(6);

    // 530W Panel specifications test
    // 6 kW plant / 0.53 kW = 11.32 -> Math.ceil(6 / 0.53) = 12 panels
    expect(data.panelSpecs.wattageW).toBe(530);
    expect(data.panelSpecs.requiredPanels).toBe(12);
    expect(data.panelSpecs.requiredRoofAreaSqFt).toBe(333.96); // 12 * 27.83

    // Subsidy math test
    expect(data.financials.centralSubsidyRs).toBe(78000); // 3 kW+ PM Surya Ghar
    expect(data.financials.stateSubsidyRs).toBe(30000); // UP State max
    expect(data.financials.totalSubsidyRs).toBe(108000);

    // Environmental metrics test
    expect(data.environmental.co2ReductionTonnesPerYear).toBeGreaterThan(0);
  });
});
