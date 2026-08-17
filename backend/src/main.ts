import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 0. Cookie Parser Middleware for HttpOnly authentication cookies
  app.use(cookieParser());

  // 1. Helmet Security Headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // 2. Request Payload Size Limits (Mitigate DoS & Memory Exhaustion Attacks)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // 3. CORS Security & Origin Allowlist
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(
          new Error(`Origin ${origin} not allowed by CORS security policy`),
        );
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 4. Global Validation Pipe (Strips unexpected fields to prevent Mass Assignment Attacks)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Security-hardened backend running on http://localhost:${port}`);
}
bootstrap();
