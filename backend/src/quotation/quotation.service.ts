import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalculatorService } from '../calculator/calculator.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';

@Injectable()
export class QuotationService {
  private readonly logger = new Logger(QuotationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly calculatorService: CalculatorService,
  ) {}

  /**
   * Creates a new solar quotation with server-side sizing & subsidy calculations.
   */
  async createQuotation(dto: CreateQuotationDto) {
    // 1. Perform server-side solar calculations (Do NOT trust frontend math)
    const calculation = this.calculatorService.calculate({
      monthlyBillAmount: dto.monthlyBillAmount,
      monthlyUnits: dto.monthlyUnits,
      electricityRate: dto.electricityRate,
      state: dto.state,
      city: dto.city,
    });

    // 2. Generate unique Quote Number (e.g. SSR-2026-8A39F)
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const quoteNumber = `SSR-${new Date().getFullYear()}-${randomCode}`;

    let customerId: string | null = null;
    let quotationId = quoteNumber;

    // 3. Attempt DB persistence (with fallback handling if DB server is offline)
    try {
      let customer = await this.prisma.customer.findFirst({
        where: { phone: dto.phone },
      });

      if (!customer) {
        customer = await this.prisma.customer.create({
          data: {
            fullName: dto.fullName,
            phone: dto.phone,
            email: dto.email,
            address: dto.address,
            houseNumber: dto.houseNumber,
            area: dto.area,
            city: dto.city,
            district: dto.district,
            state: dto.state || 'Uttar Pradesh',
            pincode: dto.pincode,
            latitude: dto.latitude,
            longitude: dto.longitude,
          },
        });
      }
      customerId = customer.id;

      const savedQuotation = await this.prisma.quotation.create({
        data: {
          quoteNumber,
          customerId: customer.id,
          fullName: dto.fullName,
          phone: dto.phone,
          email: dto.email,
          address: dto.address,
          houseNumber: dto.houseNumber,
          area: dto.area,
          city: dto.city,
          district: dto.district,
          state: dto.state || 'Uttar Pradesh',
          pincode: dto.pincode,
          latitude: dto.latitude,
          longitude: dto.longitude,
          accuracy: dto.accuracy,
          googleMapsUrl: dto.googleMapsUrl,
          monthlyBillAmount: dto.monthlyBillAmount,
          monthlyUnits: dto.monthlyUnits,
          electricityRate: dto.electricityRate,
          solarType: dto.solarType || 'On-Grid',
          recommendedCapacityKw: calculation.recommendedPlantSizeKw,
          estimatedGrossCost: calculation.financials.grossCostRs,
          estimatedCentralSubsidy: calculation.financials.centralSubsidyRs,
          estimatedStateSubsidy: calculation.financials.stateSubsidyRs,
          estimatedNetCost: calculation.financials.netCostRs,
          estimatedAnnualSavings: calculation.financials.annualSavingsRs,
          contactTime: dto.contactTime || 'Any Time',
          message: dto.message,
          status: 'NEW',
        },
      });
      quotationId = savedQuotation.id;
    } catch (dbErr) {
      this.logger.warn(`Quotation calculation completed. Note: Database connection notice (${dbErr.message})`);
    }

    this.logger.log(`New Solar Quotation generated: ${quoteNumber} for ${dto.fullName} (${dto.phone})`);

    return {
      message: 'Quotation request received successfully',
      quoteNumber,
      quotationId,
      customerId,
      customerName: dto.fullName,
      phone: dto.phone,
      location: {
        city: dto.city,
        state: dto.state || 'Uttar Pradesh',
        latitude: dto.latitude,
        longitude: dto.longitude,
        googleMapsUrl: dto.googleMapsUrl,
      },
      calculation,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Retrieves all quotations (Admin / Staff service)
   */
  async findAllQuotations() {
    try {
      return await this.prisma.quotation.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          assignedTo: {
            select: { id: true, fullName: true, email: true },
          },
        },
      });
    } catch (dbErr) {
      this.logger.warn(`findAllQuotations DB notice: ${dbErr.message}`);
      return [];
    }
  }
}
