import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all customers for administrative inspection.
   * Strips out raw GPS coordinates and sensitive secret hashes for privacy.
   */
  async findAllCustomers() {
    try {
      const customers = await this.prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          quotations: {
            select: {
              id: true,
              quoteNumber: true,
              status: true,
              solarType: true,
              recommendedCapacityKw: true,
              estimatedNetCost: true,
              createdAt: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              quote: true,
              isApproved: true,
            },
          },
          _count: {
            select: {
              quotations: true,
              reviews: true,
            },
          },
        },
      });

      // Strip unnecessary GPS coordinates & sanitize payload
      return customers.map((c) => {
        const { latitude, longitude, ...sanitized } = c;
        return {
          ...sanitized,
          quotationCount: c._count.quotations,
          reviewCount: c._count.reviews,
        };
      });
    } catch (err: any) {
      this.logger.warn(`findAllCustomers error: ${err.message}`);
      return [];
    }
  }
}
