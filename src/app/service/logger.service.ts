import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private readonly redactedKeys = [
    'password',
    'passwd',
    'pwd',
    'token',
    'authorization',
    'secret',
    'email',
    'mail',
    'credential',
    'code',
  ];

  debug(message?: any, ...optionalParams: any[]): void {
    if (!this.isDebugEnabled()) {
      return;
    }
    console.debug(this.sanitize(message), ...optionalParams.map(value => this.sanitize(value)));
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (!this.isDebugEnabled()) {
      return;
    }
    console.info(this.sanitize(message), ...optionalParams.map(value => this.sanitize(value)));
  }

  warn(message?: any, ...optionalParams: any[]): void {
    console.warn(this.sanitize(message), ...optionalParams.map(value => this.sanitize(value)));
  }

  error(message?: any, ...optionalParams: any[]): void {
    console.error(this.sanitize(message), ...optionalParams.map(value => this.sanitize(value)));
  }

  private isDebugEnabled(): boolean {
    return !!(environment as any).enableDebugLogs;
  }

  private sanitize(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (Array.isArray(value)) {
      return value.map(item => this.sanitize(item));
    }

    if (typeof value === 'object') {
      const sanitizedObj: any = {};
      Object.keys(value).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (this.redactedKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
          sanitizedObj[key] = '[REDACTED]';
        } else {
          sanitizedObj[key] = this.sanitize(value[key]);
        }
      });
      return sanitizedObj;
    }

    return value;
  }

  private sanitizeString(input: string): string {
    if (!input) {
      return input;
    }

    const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    const bearerPattern = /Bearer\s+[A-Za-z0-9\-_.=]+/gi;

    return input
      .replace(emailPattern, '[REDACTED_EMAIL]')
      .replace(bearerPattern, 'Bearer [REDACTED_TOKEN]');
  }
}
