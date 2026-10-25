import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService, QuoteNotificationData } from './mail.service';

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;
  let originalFetch: typeof global.fetch;

  const mockQuoteData: QuoteNotificationData = {
    quoteNumber: 'SSR-2026-TEST01',
    fullName: 'Anurag Sharma',
    phone: '9876543210',
    email: 'anurag@example.com',
    address: 'Near Station Road, Mau',
    city: 'Mau',
    state: 'Uttar Pradesh',
    monthlyBillAmount: 5000,
    solarType: 'On-Grid Solar',
    submissionDate: '26 Oct 2026, 02:30',
  };

  beforeEach(async () => {
    originalFetch = global.fetch;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const env: Record<string, string> = {
                EMAILJS_SERVICE_ID: 'test_service_id',
                EMAILJS_TEMPLATE_ID: 'test_template_id',
                EMAILJS_PUBLIC_KEY: 'test_public_key',
                ADMIN_NOTIFICATION_EMAIL: 'info@ssrsolarpower.com',
                CORS_ORIGIN: 'https://ssrsolarpower.com',
              };
              return env[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('1. Successfully sends admin notification email when EmailJS is configured', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue('OK'),
    });

    const result = await service.sendQuoteEnquiryNotification(mockQuoteData);

    expect(result.sent).toBe(true);
    expect(result.status).toBe('sent');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://api.emailjs.com/api/v1.0/email/send');
    expect(options.method).toBe('POST');
    expect(options.headers).toMatchObject({
      'Content-Type': 'application/json',
      origin: 'https://ssrsolarpower.com',
    });

    const body = JSON.parse(options.body);
    expect(body.service_id).toBe('test_service_id');
    expect(body.template_id).toBe('test_template_id');
    expect(body.user_id).toBe('test_public_key');
    expect(body.template_params.to_email).toBe('info@ssrsolarpower.com');
    expect(body.template_params.quote_number).toBe('SSR-2026-TEST01');
    expect(body.template_params.client_name).toBe('Anurag Sharma');
  });

  it('2. Gracefully handles EmailJS API failure without throwing exceptions', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: jest.fn().mockResolvedValue('Invalid template ID'),
    });

    const result = await service.sendQuoteEnquiryNotification(mockQuoteData);

    expect(result.sent).toBe(false);
    expect(result.status).toBe('failed');
    expect(result.error).toContain('Invalid template ID');
  });

  it('3. Gracefully skips notification when credentials are not configured', async () => {
    // Override configService to simulate missing credentials
    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    delete process.env.EMAILJS_SERVICE_ID;
    delete process.env.VITE_EMAILJS_SERVICE_ID;
    delete process.env.EMAILJS_TEMPLATE_ID;
    delete process.env.VITE_EMAILJS_TEMPLATE_ID;
    delete process.env.EMAILJS_PUBLIC_KEY;
    delete process.env.VITE_EMAILJS_PUBLIC_KEY;

    global.fetch = jest.fn();

    const result = await service.sendQuoteEnquiryNotification(mockQuoteData);

    expect(result.sent).toBe(false);
    expect(result.status).toBe('skipped');
    expect(result.reason).toContain('missing configuration');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('4. Supports VITE_EMAILJS_* environment variable fallback aliases', async () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      const viteEnv: Record<string, string> = {
        VITE_EMAILJS_SERVICE_ID: 'vite_service_123',
        VITE_EMAILJS_TEMPLATE_ID: 'vite_template_456',
        VITE_EMAILJS_PUBLIC_KEY: 'vite_key_789',
      };
      return viteEnv[key];
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue('OK'),
    });

    const result = await service.sendQuoteEnquiryNotification(mockQuoteData);

    expect(result.sent).toBe(true);
    expect(result.status).toBe('sent');

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.service_id).toBe('vite_service_123');
    expect(body.template_id).toBe('vite_template_456');
    expect(body.user_id).toBe('vite_key_789');
  });
});
