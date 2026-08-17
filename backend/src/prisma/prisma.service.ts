import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/ssr_solar_db?schema=public';
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL database via Prisma 7.');
    } catch (error) {
      this.logger.warn(
        `Prisma database service initialized. Ensure PostgreSQL instance is reachable on process.env.DATABASE_URL. (${error.message})`,
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
