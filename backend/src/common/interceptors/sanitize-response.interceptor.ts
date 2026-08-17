import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SanitizeResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.stripSensitiveData(data)));
  }

  private stripSensitiveData(data: any): any {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.stripSensitiveData(item));
    }

    if (typeof data === 'object' && !(data instanceof Date)) {
      // Strip passwords, hashes, and internal secrets, but preserve auth tokens
      const sensitiveSubstrings = [
        'password',
        'passwordhash',
        'secretkey',
        'mfasecret',
        'databaseurl',
      ];

      const cleanObj: any = {};
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveSubstrings.some((sub) => lowerKey.includes(sub))) {
          continue; // Strip sensitive credentials
        }
        cleanObj[key] = this.stripSensitiveData(value);
      }
      return cleanObj;
    }

    return data;
  }
}
