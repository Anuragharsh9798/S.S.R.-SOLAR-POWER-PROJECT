import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Argon2Service } from './argon2.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'ssr_solar_super_secret_jwt_key_2026',
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Argon2Service, JwtStrategy, RolesGuard],
  exports: [AuthService, Argon2Service, RolesGuard, JwtModule],
})
export class AuthModule {}
