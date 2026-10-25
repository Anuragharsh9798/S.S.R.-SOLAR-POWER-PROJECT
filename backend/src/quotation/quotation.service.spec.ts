import { Test, TestingModule } from '@nestjs/testing';
import { QuotationService } from './quotation.service';
import { PrismaService } from '../prisma/prisma.service';
import { CalculatorService } from '../calculator/calculator.service';
import { MailService } from '../mail/mail.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';

describe('QuotationService - Email Notification Integration', () => {
  let service: QuotationService;
  let mailService: MailService;
  let prismaService: PrismaService;

  const mockDto: CreateQuotationDto = {
    fullName: 'Rahul Singh',
    phone: '9876543210',
    email: 'rahul@example.com',
    address: 'Civil Lines, Mau',
    city: 'Mau',
    state: 'Uttar Pradesh',
    monthlyBillAmount: 6000,
    solarType: 'On-Grid Solar',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotationService,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findFirst: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({ id: 'cust-123' }),
            },
            quotation: {
              create: jest.fn().mockResolvedValue({ id: 'quote-456' }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        {
          provide: CalculatorService,
          useValue: {
            calculate: jest.fn().mockReturnValue({
              recommendedPlantSizeKw: 6,
              financials: {
                grossCostRs: 330000,
                centralSubsidyRs: 78000,
                stateSubsidyRs: 30000,
                netCostRs: 222000,
                annualSavingsRs: 77760,
              },
            }),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendQuoteEnquiryNotification: jest.fn().mockResolvedValue({
              sent: true,
              status: 'sent',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<QuotationService>(QuotationService);
    mailService = module.get<MailService>(MailService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('1. Triggers MailService with correct quote details on quotation creation', async () => {
    const result = await service.createQuotation(mockDto);

    expect(result.quoteNumber).toMatch(/^SSR-\d{4}-[A-Z0-9]+$/);
    expect(result.customerName).toBe('Rahul Singh');
    expect(result.emailNotification).toEqual({
      sent: true,
      status: 'sent',
    });

    expect(mailService.sendQuoteEnquiryNotification).toHaveBeenCalledTimes(1);
    expect(mailService.sendQuoteEnquiryNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        quoteNumber: result.quoteNumber,
        fullName: 'Rahul Singh',
        phone: '9876543210',
        email: 'rahul@example.com',
        address: 'Civil Lines, Mau',
        solarType: 'On-Grid Solar',
      }),
    );
  });

  it('2. Preserves quotation creation even if email notification fails', async () => {
    jest.spyOn(mailService, 'sendQuoteEnquiryNotification').mockResolvedValue({
      sent: false,
      status: 'failed',
      error: 'SMTP connection timeout',
    });

    const result = await service.createQuotation(mockDto);

    // Quotation MUST still be generated and returned successfully
    expect(result.quoteNumber).toBeDefined();
    expect(result.message).toBe('Quotation request received successfully');
    expect(result.emailNotification).toEqual({
      sent: false,
      status: 'failed',
      error: 'SMTP connection timeout',
    });
  });
});
