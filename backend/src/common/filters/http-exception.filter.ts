import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = process.env.NODE_ENV === 'production';

    let message: any = isHttpException
      ? exception.getResponse()
      : 'Internal server error occurred';

    // Mask sensitive details in production for 500 errors
    if (!isHttpException) {
      this.logger.error(
        `Unhandled Exception on ${request.method} ${request.url}:`,
        exception instanceof Error ? exception.stack : String(exception),
      );

      if (isProduction) {
        message = 'An unexpected server error occurred. Please try again later.';
      } else {
        message =
          exception instanceof Error
            ? exception.message
            : 'Internal server error';
      }
    } else {
      this.logger.warn(
        `HttpException [${status}] on ${request.method} ${request.url}: ${JSON.stringify(message)}`,
      );
    }

    // Format normalized error payload
    const errorResponse = {
      statusCode: status,
      error:
        typeof message === 'object' && message.error
          ? message.error
          : HttpStatus[status] || 'Error',
      message:
        typeof message === 'object' && message.message
          ? message.message
          : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Sanitize response to prevent leaking any residual password/token fields in error messages
    const sanitizedJson = this.sanitizeOutput(errorResponse);

    response.status(status).json(sanitizedJson);
  }

  private sanitizeOutput(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    const sensitiveKeys = ['password', 'passwordHash', 'token', 'secret', 'authorization', 'apiKey'];
    const copy = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key of Object.keys(copy)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        copy[key] = '[REDACTED]';
      } else if (typeof copy[key] === 'object') {
        copy[key] = this.sanitizeOutput(copy[key]);
      }
    }
    return copy;
  }
}
