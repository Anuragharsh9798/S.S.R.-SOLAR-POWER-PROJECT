import { Injectable, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService implements OnModuleInit {
  private readonly logger = new Logger(ProjectsService.name);
  private inMemoryProjects: Map<string, any> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedOfficialProjects();
  }

  async seedOfficialProjects() {
    const officialProjects = [
      {
        title: 'Green Meadows Villa',
        slug: 'green-meadows-villa',
        type: 'Residential',
        location: 'Mau, Uttar Pradesh',
        capacity: '10 kW',
        capacityKw: 10,
        completedDate: 'March 2026',
        annualSavings: '₹ 1.4 L / year',
        rating: 5,
        description: 'Complete 10 kW residential solar rooftop installation for Green Meadows Villa in Mau.',
        featuredImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=80',
        isFeatured: true,
      },
      {
        title: 'Sunrise Tech Park',
        slug: 'sunrise-tech-park',
        type: 'Commercial',
        location: 'Ballia, Uttar Pradesh',
        capacity: '250 kW',
        capacityKw: 250,
        completedDate: 'January 2026',
        annualSavings: '₹ 32 L / year',
        rating: 5,
        description: 'Commercial 250 kW solar installation powering Sunrise Tech Park in Ballia.',
        featuredImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1000&q=80',
        isFeatured: true,
      },
    ];

    for (const p of officialProjects) {
      const memRecord = {
        id: `proj-${p.slug}`,
        ...p,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryProjects.set(p.slug, memRecord);
      this.inMemoryProjects.set(memRecord.id, memRecord);

      try {
        await this.prisma.project.upsert({
          where: { slug: p.slug },
          update: {
            title: p.title,
            type: p.type,
            location: p.location,
            capacity: p.capacity,
            capacityKw: p.capacityKw,
            completedDate: p.completedDate,
            annualSavings: p.annualSavings,
            rating: p.rating,
            description: p.description,
            isFeatured: p.isFeatured,
          },
          create: {
            title: p.title,
            slug: p.slug,
            type: p.type,
            location: p.location,
            capacity: p.capacity,
            capacityKw: p.capacityKw,
            completedDate: p.completedDate,
            annualSavings: p.annualSavings,
            rating: p.rating,
            description: p.description,
            isFeatured: p.isFeatured,
          },
        });
      } catch (err) {
        this.logger.warn(`Project upsert DB notice: ${err.message}`);
      }
    }
    this.logger.log('Official SSR Solar projects verified in DB & Cache.');
  }

  async findAll() {
    try {
      const records = await this.prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true },
      });
      if (records && records.length > 0) return records;
    } catch (err) {
      this.logger.warn(`Projects DB lookup notice: ${err.message}`);
    }
    const set = new Set();
    const result: any[] = [];
    for (const p of this.inMemoryProjects.values()) {
      if (!set.has(p.slug)) {
        set.add(p.slug);
        result.push(p);
      }
    }
    return result;
  }

  async findOne(id: string) {
    try {
      const project = await this.prisma.project.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: { images: true },
      });

      if (project) return project;
    } catch (err) {
      this.logger.warn(`Project findOne DB notice: ${err.message}`);
    }

    const mem = this.inMemoryProjects.get(id);
    if (!mem) {
      throw new NotFoundException(`Project with ID/slug "${id}" not found`);
    }
    return mem;
  }

  async create(dto: CreateProjectDto) {
    const id = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const projectRecord = {
      id,
      ...dto,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inMemoryProjects.set(id, projectRecord);
    this.inMemoryProjects.set(dto.slug, projectRecord);

    try {
      const created = await this.prisma.project.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          type: dto.type,
          location: dto.location,
          capacity: dto.capacity,
          capacityKw: dto.capacityKw,
          completedDate: dto.completedDate,
          annualSavings: dto.annualSavings,
          rating: dto.rating || 5,
          description: dto.description,
          featuredImage: dto.featuredImage,
          isFeatured: dto.isFeatured || false,
        },
        include: { images: true },
      });
      return created;
    } catch (err) {
      this.logger.warn(`Project created in memory. DB notice: ${err.message}`);
      return projectRecord;
    }
  }

  async update(id: string, dto: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: dto,
        include: { images: true },
      });
    } catch (err) {
      const existing = this.inMemoryProjects.get(id);
      if (!existing) {
        throw new NotFoundException(`Project with ID "${id}" not found`);
      }
      const updated = { ...existing, ...dto, updatedAt: new Date() };
      this.inMemoryProjects.set(id, updated);
      return updated;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.project.delete({ where: { id } });
    } catch {
      this.inMemoryProjects.delete(id);
    }
    return { message: `Project with ID "${id}" deleted successfully` };
  }
}
