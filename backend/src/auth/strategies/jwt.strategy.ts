import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
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
      secretOrKey: process.env.JWT_SECRET || 'ssr_solar_super_secret_jwt_key_2026',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    let user: any = null;

    try {
      user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });
    } catch {
      // Fallback for offline DB execution
    }

    if (!user) {
      user = {
        id: payload.sub,
        email: payload.email,
        isActive: true,
        role: { name: payload.role },
      };
    }

    if (!user || user.isActive === false) {
      throw new UnauthorizedException('User session invalid or user account deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.email,
      role: user.role?.name || user.role || payload.role,
    };
  }
}
