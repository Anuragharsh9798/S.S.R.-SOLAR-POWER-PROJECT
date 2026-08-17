import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  private inMemoryReviews: Map<string, any> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    const id = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const reviewRecord = {
      id,
      name: dto.name,
      location: dto.location,
      rating: dto.rating || 5,
      systemSizeKw: dto.systemSizeKw,
      solarType: dto.solarType,
      quote: dto.quote,
      isVerified: false,
      isApproved: false, // Requires admin review before public display
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inMemoryReviews.set(id, reviewRecord);

    try {
      const created = await this.prisma.review.create({
        data: reviewRecord,
      });
      this.logger.log(`New review submitted for approval by ${dto.name}`);
      return {
        message: 'Thank you! Your review has been submitted for approval.',
        reviewId: created.id,
        isApproved: false,
      };
    } catch (err) {
      this.logger.warn(`Review saved in memory cache. DB notice: ${err.message}`);
      return {
        message: 'Thank you! Your review has been submitted for approval.',
        reviewId: id,
        isApproved: false,
      };
    }
  }

  async findAllPublic() {
    try {
      return await this.prisma.review.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      this.logger.warn(`Reviews DB lookup notice: ${err.message}`);
      return Array.from(this.inMemoryReviews.values()).filter((r) => r.isApproved);
    }
  }

  async approveReview(id: string, isApproved: boolean) {
    try {
      const updated = await this.prisma.review.update({
        where: { id },
        data: { isApproved, isVerified: true },
      });
      return updated;
    } catch {
      const existing = this.inMemoryReviews.get(id);
      if (!existing) {
        throw new NotFoundException(`Review with ID "${id}" not found`);
      }
      const updated = { ...existing, isApproved, isVerified: true, updatedAt: new Date() };
      this.inMemoryReviews.set(id, updated);
      return updated;
    }
  }
}
