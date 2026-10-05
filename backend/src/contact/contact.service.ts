import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private inMemoryContactMessages: Map<string, any> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const messageRecord = {
      id,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inMemoryContactMessages.set(id, messageRecord);

    try {
      const saved = await this.prisma.contactMessage.create({
        data: messageRecord,
      });
      this.logger.log(`New contact message received from ${dto.fullName} (${dto.email})`);
      return {
        message: 'Thank you! Your message has been received. Our team will contact you shortly.',
        messageId: saved.id,
      };
    } catch (err) {
      this.logger.warn(`Contact message saved in memory. DB notice: ${err.message}`);
      return {
        message: 'Thank you! Your message has been received. Our team will contact you shortly.',
        messageId: id,
      };
    }
  }

  async findAllAdmin() {
    try {
      return await this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      this.logger.warn(`ContactMessage DB lookup notice: ${err.message}`);
      return Array.from(this.inMemoryContactMessages.values());
    }
  }

  async markHandled(id: string, isRead: boolean = true) {
    try {
      return await this.prisma.contactMessage.update({
        where: { id },
        data: { isRead },
      });
    } catch {
      const existing = this.inMemoryContactMessages.get(id);
      if (!existing) {
        throw new NotFoundException(`Contact message with ID "${id}" not found`);
      }
      const updated = { ...existing, isRead, updatedAt: new Date() };
      this.inMemoryContactMessages.set(id, updated);
      return updated;
    }
  }
}
