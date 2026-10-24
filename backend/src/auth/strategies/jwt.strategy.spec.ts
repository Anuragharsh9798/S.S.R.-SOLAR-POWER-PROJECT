import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';
import { envValidationSchema } from '../../config/env.validation';
import { RoleEnum } from '../enums/role.enum';

describe('JwtStrategy & JWT Security Verification', () => {
  let strategy: JwtStrategy;
  let prismaMock: {
    user: {
      findUnique: jest.Mock;
    };
  };
  let authServiceMock: {
    findUserById: jest.Mock;
  };

  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'ssr_solar_super_secret_jwt_key_2026_at_least_32_chars';

    prismaMock = {
      user: {
        findUnique: jest.fn(),
      },
    };

    authServiceMock = {
      findUserById: jest.fn(),
    };

    strategy = new JwtStrategy(
      prismaMock as unknown as PrismaService,
      authServiceMock as unknown as AuthService,
    );
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('1. Missing or Invalid JWT_SECRET Validation', () => {
    it('MUST fail application startup if JWT_SECRET is missing during strategy instantiation', () => {
      delete process.env.JWT_SECRET;

      expect(() => {
        new JwtStrategy(
          prismaMock as unknown as PrismaService,
          authServiceMock as unknown as AuthService,
        );
      }).toThrow(/JWT_SECRET environment variable is missing or invalid/);
    });

    it('MUST fail environment validation schema if JWT_SECRET is omitted', () => {
      const config = {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/test_db',
      };

      const result = envValidationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('"JWT_SECRET" is required');
    });

    it('MUST fail environment validation schema if JWT_SECRET is shorter than 32 characters', () => {
      const config = {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/test_db',
        JWT_SECRET: 'short_insecure_secret_123',
      };

      const result = envValidationSchema.validate(config);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('"JWT_SECRET" length must be at least 32 characters long');
    });
  });

  describe('2. Token Referencing Nonexistent Database User', () => {
    it('MUST reject with 401 Unauthorized and NEVER synthesize a user or Super Admin', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      authServiceMock.findUserById.mockReturnValue(null);

      const payload = {
        sub: 'nonexistent-user-uuid',
        email: 'attacker@evil.com',
        role: 'SUPER_ADMIN',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow(
        'User session invalid or user account does not exist',
      );
    });
  });

  describe('3. Disabled or Ineligible User Handling', () => {
    it('MUST reject token if user is deactivated in database (isActive === false)', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'deactivated-user-id',
        email: 'deactivated@ssrsolar.com',
        fullName: 'Deactivated User',
        isActive: false,
        role: { name: RoleEnum.STAFF },
      });

      const payload = {
        sub: 'deactivated-user-id',
        email: 'deactivated@ssrsolar.com',
        role: 'STAFF',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow('User account has been deactivated');
    });

    it('MUST reject token if user has no assigned role in database', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-no-role',
        email: 'norole@ssrsolar.com',
        fullName: 'No Role User',
        isActive: true,
        role: null,
      });

      const payload = {
        sub: 'user-no-role',
        email: 'norole@ssrsolar.com',
        role: 'ADMIN',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow(
        'User account does not have a valid assigned role',
      );
    });
  });

  describe('4. Valid Existing Users & Role Enforcement', () => {
    it('MUST return verified database user details with correct role', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'valid-admin-id',
        email: 'admin@ssrsolar.com',
        fullName: 'SSR System Admin',
        isActive: true,
        role: { name: RoleEnum.ADMIN },
      });

      const payload = {
        sub: 'valid-admin-id',
        email: 'admin@ssrsolar.com',
        role: 'ADMIN',
      };

      const result = await strategy.validate(payload);
      expect(result).toEqual({
        id: 'valid-admin-id',
        email: 'admin@ssrsolar.com',
        fullName: 'SSR System Admin',
        role: RoleEnum.ADMIN,
      });
    });

    it('MUST enforce database role and IGNORE forged role claim in token payload', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'staff-user-id',
        email: 'staff@ssrsolar.com',
        fullName: 'SSR Staff Member',
        isActive: true,
        role: { name: RoleEnum.STAFF },
      });

      // Token claims SUPER_ADMIN, but DB record is STAFF
      const forgedPayload = {
        sub: 'staff-user-id',
        email: 'staff@ssrsolar.com',
        role: RoleEnum.SUPER_ADMIN,
      };

      const result = await strategy.validate(forgedPayload);
      expect(result.role).toBe(RoleEnum.STAFF);
      expect(result.role).not.toBe(RoleEnum.SUPER_ADMIN);
    });
  });

  describe('5. Database Lookup Failures', () => {
    it('MUST reject with 401 Unauthorized when database lookup fails/throws and NEVER grant access', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('PostgreSQL connection timeout'));

      const payload = {
        sub: 'some-user-id',
        email: 'user@ssrsolar.com',
        role: 'SUPER_ADMIN',
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Authentication verification failed: database lookup error',
      );
    });
  });
});
