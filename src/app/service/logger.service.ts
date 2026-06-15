import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private readonly maxSanitizeDepth = 6;

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

  constructor(private utils: UtilsService) {

  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (!this.isDebugEnabled()) {
      return;
    }
    console.log(this.sanitize(message), ...optionalParams.map(value => this.sanitize(value)));
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
    // que signifie !! : https://stackoverflow.com/questions/1068280/convert-a-value-to-boolean-in-javascript
    return !!(environment as any).enableDebugLogs;
  }

  /**
   * TODO : ajouter date heure (HH:MM:SS) au debut 
   * @param value 
   * @param seen 
   * @param depth 
   * @returns 
   */
  private sanitize(value: any, seen: WeakSet<object> = new WeakSet<object>(), depth: number = 0): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (depth >= this.maxSanitizeDepth) {
      return '[MaxDepthReached]';
    }

    if (Array.isArray(value)) {
      return value.map(item => this.sanitize(item, seen, depth + 1));
    }

    if (typeof value === 'object') {
      if (value instanceof Date) {
        return value;
      }

      if (seen.has(value)) {
        return '[Circular]';
      }

      seen.add(value);
      const sanitizedObj: any = {};
      Object.keys(value).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (this.redactedKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
          sanitizedObj[key] = '[REDACTED]';
        } else {
          sanitizedObj[key] = this.sanitize(value[key], seen, depth + 1);
        }
      });

      seen.delete(value);
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

    const dh = this.getDateNow()

    return dh + " " + input
      .replace(emailPattern, '[REDACTED_EMAIL]')
      .replace(bearerPattern, 'Bearer [REDACTED_TOKEN]');
  }

  getDateNow() {
    let d: Date = new Date();

    const pad = (n: number) => String(n).padStart(2, '0');

    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
  }
}
