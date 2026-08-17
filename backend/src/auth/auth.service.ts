import { Injectable, UnauthorizedException, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { Argon2Service } from './argon2.service';
import { AuditLogService, AuditAction } from '../audit-log/audit-log.service';
import { LoginDto } from './dto/login.dto';
import { RoleEnum } from './enums/role.enum';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private inMemoryUsers: Map<string, any> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly argon2Service: Argon2Service,
    private readonly auditLogService: AuditLogService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultRoles();
    await this.seedDefaultAdmin();
  }

  async seedDefaultRoles() {
    try {
      const roles = Object.values(RoleEnum);
      for (const roleName of roles) {
        await this.prisma.role.upsert({
          where: { name: roleName },
          update: {},
          create: {
            name: roleName,
            description: `${roleName} System Role`,
          },
        });
      }
      this.logger.log('Default RBAC roles verified.');
    } catch (err) {
      this.logger.warn(`Role seeding notice: ${err.message}`);
    }
  }

  async seedDefaultAdmin() {
    try {
      await this.createUser({
        email: 'superadmin@ssrsolar.com',
        phone: '+919876543209',
        password: 'SuperAdminPassword123!',
        fullName: 'SSR Solar Super Admin',
        roleName: RoleEnum.SUPER_ADMIN,
      });
      await this.createUser({
        email: 'admin@ssrsolar.com',
        phone: '+919876543210',
        password: 'AdminPassword123!',
        fullName: 'SSR Solar Admin',
        roleName: RoleEnum.ADMIN,
      });
      await this.createUser({
        email: 'staff@ssrsolar.com',
        phone: '+919876543211',
        password: 'StaffPassword123!',
        fullName: 'SSR Solar Staff',
        roleName: RoleEnum.STAFF,
      });
      this.logger.log('Default Super Admin, Admin & Staff accounts verified.');
    } catch (err) {
      this.logger.warn(`Admin account seeding notice: ${err.message}`);
    }
  }

  async validateUser(email: string, pass: string) {
    let user: any = null;

    try {
      user = await this.prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });
    } catch {
      user = this.inMemoryUsers.get(email);
    }

    if (!user && this.inMemoryUsers.has(email)) {
      user = this.inMemoryUsers.get(email);
    }

    if (!user || user.isActive === false) {
      await this.auditLogService.logAction({
        action: AuditAction.FAILED_LOGIN,
        userEmail: email,
        details: { reason: 'User not found or inactive' },
      });
      throw new UnauthorizedException('Invalid email address or password');
    }

    const isPasswordValid = await this.argon2Service.verifyPassword(
      user.passwordHash || user.password_hash,
      pass,
    );

    if (!isPasswordValid) {
      await this.auditLogService.logAction({
        action: AuditAction.FAILED_LOGIN,
        userEmail: email,
        details: { reason: 'Invalid password credential' },
      });
      throw new UnauthorizedException('Invalid email address or password');
    }

    return user;
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const roleName = user.role?.name || user.roleName || RoleEnum.STAFF;

    const payload = {
      sub: user.id,
      email: user.email,
      role: roleName,
    };

    const token = this.jwtService.sign(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    await this.auditLogService.logAction({
      action: AuditAction.LOGIN,
      userId: user.id,
      userEmail: user.email,
      details: { role: roleName },
    });

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: roleName,
      },
      token,
    };
  }

  logout(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      message: 'Logout successful',
    };
  }

  async createUser(data: { email: string; phone: string; password: string; fullName: string; roleName: RoleEnum }) {
    const passwordHash = await this.argon2Service.hashPassword(data.password);
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const memUser = {
      id,
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      passwordHash,
      isActive: true,
      role: { name: data.roleName },
      roleName: data.roleName,
    };

    this.inMemoryUsers.set(data.email, memUser);

    try {
      const role = await this.prisma.role.findUnique({ where: { name: data.roleName } });
      if (role) {
        return await this.prisma.user.create({
          data: {
            email: data.email,
            phone: data.phone,
            fullName: data.fullName,
            passwordHash,
            roleId: role.id,
          },
          include: { role: true },
        });
      }
    } catch {
      // Memory fallback
    }

    return memUser;
  }
}
