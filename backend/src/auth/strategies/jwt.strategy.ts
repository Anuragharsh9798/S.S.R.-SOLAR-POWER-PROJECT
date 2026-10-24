import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.trim().length === 0) {
      throw new Error('JWT_SECRET environment variable is missing or invalid. Application startup aborted.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (request && request.cookies && request.cookies['access_token']) {
            return request.cookies['access_token'];
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload: missing subject identifier');
    }

    let user: any = null;

    try {
      user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });
    } catch {
      // Database lookup failure: MUST NOT grant access or synthesize user
      throw new UnauthorizedException('Authentication verification failed: database lookup error');
    }

    // In non-production testing environment, check in-memory verified test users
    if (!user && process.env.NODE_ENV !== 'production' && this.authService) {
      user = this.authService.findUserById(payload.sub);
    }

    // Token references a nonexistent user: MUST NOT synthesize a user or grant access
    if (!user) {
      throw new UnauthorizedException('User session invalid or user account does not exist');
    }

    // Disabled user: MUST NOT grant access
    if (user.isActive === false) {
      throw new UnauthorizedException('User account has been deactivated');
    }

    // Extract verified role strictly from user record; NEVER trust unverified token payload
    const userRole = user.role?.name || user.roleName || (typeof user.role === 'string' ? user.role : null);
    if (!userRole) {
      throw new UnauthorizedException('User account does not have a valid assigned role');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.email,
      role: userRole,
    };
  }
}
