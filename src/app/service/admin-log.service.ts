import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminLogService {

  private readonly logUrl = environment.apiUrl + '/admin/logs';
  private readonly lineCountSubject = new BehaviorSubject<number>(-1);
  private lineCountRequest$: Observable<number> | null = null;

  constructor(private http: HttpClient) {}

  tail(lines: number): Observable<string[]> {
    const safeLines = Math.max(1, Math.min(5000, Number(lines) || 200));
    const params = new HttpParams().set('lines', String(safeLines));

    return this.http
      .get(this.logUrl + '/tail', { params, responseType: 'text' })
      .pipe(map((raw: string) => this.normalizeToLines(raw)));
  }

  getLineCount(forceRefresh = false): Observable<number> {
    if (!this.lineCountRequest$ || forceRefresh) {
      this.lineCountRequest$ = this.http
      .get(this.logUrl + '/count', { responseType: 'text' })
      .pipe(
        map((raw: string) => this.normalizeToCount(raw)),
        tap((count: number) => this.lineCountSubject.next(count)),
        shareReplay(1)
      );
    }

    return this.lineCountRequest$;
  }

  refreshLineCount(): Observable<number> {
    return this.getLineCount(true);
  }

  lineCount$(): Observable<number> {
    return this.lineCountSubject.asObservable();
  }

  getLineCountSnapshot(): number {
    return this.lineCountSubject.value;
  }

  private normalizeToLines(raw: string): string[] {
    if (!raw) {
      return [];
    }

    const fromJson = this.extractFromJson(raw);
    if (fromJson) {
      return fromJson;
    }

    return this.splitLines(raw);
  }

  private extractFromJson(raw: string): string[] | null {
    try {
      const parsed = JSON.parse(raw);
      const result = parsed?.body?.result ?? parsed?.result ?? parsed;

      if (Array.isArray(result)) {
        return result.map((line: any) => String(line));
      }

      if (typeof result === 'string') {
        return this.splitLines(result);
      }

      if (Array.isArray(result?.lines)) {
        return result.lines.map((line: any) => String(line));
      }
    } catch {
      return null;
    }

    return null;
  }

  private splitLines(text: string): string[] {
    return text
      .replace(/\r/g, '')
      .split('\n')
      .filter((line: string) => line !== undefined && line !== null);
  }

  private normalizeToCount(raw: string): number {
    if (!raw) {
      return -1;
    }

    const directCount = Number(raw);
    if (!Number.isNaN(directCount)) {
      return Math.max(0, Math.trunc(directCount));
    }

    try {
      const parsed = JSON.parse(raw);
      const result =
        parsed?.body?.result ??
        parsed?.body?.object ??
        parsed?.result ??
        parsed?.object ??
        parsed?.count ??
        parsed;

      const count = Number(
        result?.count ??
        result?.value ??
        result
      );

      if (!Number.isNaN(count)) {
        return Math.max(0, Math.trunc(count));
      }
    } catch {
      return -1;
    }

    return -1;
  }
}
