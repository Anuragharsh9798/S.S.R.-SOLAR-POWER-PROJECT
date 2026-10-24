import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Argon2Service } from './argon2.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RoleEnum } from './enums/role.enum';

describe('AuthService - Admin Seeding & Credential Protection', () => {
  let service: AuthService;
  let prismaMock: {
    user: {
      count: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      upsert: jest.Mock;
    };
    role: {
      findUnique: jest.Mock;
      upsert: jest.Mock;
    };
  };
  let argon2Mock: {
    hashPassword: jest.Mock;
    verifyPassword: jest.Mock;
  };

  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = { ...originalEnv };

    prismaMock = {
      user: {
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
      },
      role: {
        findUnique: jest.fn().mockResolvedValue({ id: 'role-admin', name: RoleEnum.ADMIN }),
        upsert: jest.fn(),
      },
    };

    argon2Mock = {
      hashPassword: jest.fn().mockResolvedValue('$argon2id$v=19$m=65536,t=3,p=4$newMockHash'),
      verifyPassword: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        { provide: Argon2Service, useValue: argon2Mock },
        { provide: AuditLogService, useValue: { logAction: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('seedDefaultAdmin() in Production', () => {
    it('1. MUST strictly exit without creating accounts when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production';
      process.env.INITIAL_ADMIN_PASSWORD = 'AnySecretPassword123!';

      await service.seedDefaultAdmin();

      expect(prismaMock.user.count).not.toHaveBeenCalled();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it('2. onModuleInit MUST NOT invoke seedDefaultAdmin when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production';
      const seedAdminSpy = jest.spyOn(service, 'seedDefaultAdmin');
      jest.spyOn(service, 'seedDefaultRoles').mockResolvedValue(undefined as any);

      await service.onModuleInit();

      expect(seedAdminSpy).not.toHaveBeenCalled();
    });
  });

  describe('seedDefaultAdmin() in Non-Production', () => {
    it('3. MUST skip seeding when INITIAL_ADMIN_PASSWORD is not configured', async () => {
      process.env.NODE_ENV = 'development';
      delete process.env.INITIAL_ADMIN_PASSWORD;

      await service.seedDefaultAdmin();

      expect(prismaMock.user.count).not.toHaveBeenCalled();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it('4. MUST skip seeding and NOT overwrite existing database users when DB is not empty', async () => {
      process.env.NODE_ENV = 'development';
      process.env.INITIAL_ADMIN_PASSWORD = 'DevPasswordSecure123!';
      prismaMock.user.count.mockResolvedValue(3); // Existing users present

      await service.seedDefaultAdmin();

      expect(prismaMock.user.count).toHaveBeenCalled();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('createUser() Credential Protection', () => {
    it('5. MUST preserve existing user credentials and NEVER overwrite password hash', async () => {
      const existingUser = {
        id: 'existing-admin-id',
        email: 'admin@ssrsolar.com',
        phone: '+919876543210',
        fullName: 'Original SSR Admin',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$originalSecureAdminHash',
        role: { name: RoleEnum.ADMIN },
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      const result = await service.createUser({
        email: 'admin@ssrsolar.com',
        phone: '+919876543210',
        password: 'AttemptedNewPassword123!',
        fullName: 'Attempted Overwrite Admin',
        roleName: RoleEnum.ADMIN,
      });

      // Assert password was NOT re-hashed and DB create/upsert was NOT executed
      expect(argon2Mock.hashPassword).not.toHaveBeenCalled();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
      expect(result.passwordHash).toBe(existingUser.passwordHash);
      expect(result.fullName).toBe('Original SSR Admin');
    });
  });
});
