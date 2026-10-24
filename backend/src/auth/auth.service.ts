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
    if (process.env.NODE_ENV !== 'production') {
      await this.seedDefaultAdmin();
    }
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
    // In production, automated default admin credential seeding is strictly disabled
    if (process.env.NODE_ENV === 'production') {
      this.logger.log('Production environment detected: automated credential seeding disabled.');
      return;
    }

    // Explicitly require INITIAL_ADMIN_PASSWORD in development/test to seed initial accounts
    const devPassword = process.env.INITIAL_ADMIN_PASSWORD;
    if (!devPassword) {
      this.logger.log(
        'Automated initial admin seeding skipped: INITIAL_ADMIN_PASSWORD environment variable is not set.',
      );
      return;
    }

    try {
      // Only seed initial accounts if the database user table is completely empty
      const existingUserCount = await this.prisma.user.count().catch(() => 0);
      if (existingUserCount > 0) {
        this.logger.log('Existing users detected in database; initial admin seeding skipped.');
        return;
      }

      await this.createUser({
        email: process.env.INITIAL_SUPERADMIN_EMAIL || 'superadmin@ssrsolar.com',
        phone: '+919876543209',
        password: devPassword,
        fullName: 'SSR Solar Super Admin',
        roleName: RoleEnum.SUPER_ADMIN,
      });
      await this.createUser({
        email: process.env.INITIAL_ADMIN_EMAIL || 'admin@ssrsolar.com',
        phone: '+919876543210',
        password: devPassword,
        fullName: 'SSR Solar Admin',
        roleName: RoleEnum.ADMIN,
      });
      await this.createUser({
        email: process.env.INITIAL_STAFF_EMAIL || 'staff@ssrsolar.com',
        phone: '+919876543211',
        password: devPassword,
        fullName: 'SSR Solar Staff',
        roleName: RoleEnum.STAFF,
      });
      this.logger.log('Development initial test accounts verified.');
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
      sameSite: 'lax',
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
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'Logout successful',
    };
  }

  async createUser(data: { email: string; phone: string; password: string; fullName: string; roleName: RoleEnum }) {
    // 1. If user already exists in database, NEVER overwrite passwordHash or existing credentials
    try {
      const existingDbUser = await this.prisma.user.findUnique({
        where: { email: data.email },
        include: { role: true },
      });

      if (existingDbUser) {
        this.logger.log(`Account ${data.email} already exists; preserving existing credentials.`);
        this.inMemoryUsers.set(data.email, existingDbUser);
        return existingDbUser;
      }
    } catch {
      // Fallback for offline DB execution
    }

    // 2. If user already exists in in-memory session store, preserve existing credentials
    if (this.inMemoryUsers.has(data.email)) {
      this.logger.log(`In-memory user ${data.email} already exists; preserving existing credentials.`);
      return this.inMemoryUsers.get(data.email);
    }

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
        const dbUser = await this.prisma.user.create({
          data: {
            email: data.email,
            phone: data.phone,
            fullName: data.fullName,
            passwordHash,
            roleId: role.id,
            isActive: true,
          },
          include: { role: true },
        });
        this.inMemoryUsers.set(data.email, dbUser);
        return dbUser;
      }
    } catch (err) {
      this.logger.warn(`DB User creation notice for ${data.email}: ${err.message}`);
    }

    return memUser;
  }

  findUserById(id: string): any {
    for (const user of this.inMemoryUsers.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }
}
