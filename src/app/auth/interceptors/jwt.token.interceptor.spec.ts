/// <reference types="jasmine" />

import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MyError } from 'src/app/resource/MyError';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { JwtTokenInterceptor } from './jwt.token.interceptor';

describe('JwtTokenInterceptor (security)', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  let loggerStub: any;
  let routerStub: any;
  let utilsStub: any;
  let utilsIhmStub: any;
  let dataSharingServiceStub: any;

  beforeEach(() => {
    loggerStub = {
      debug: jasmine.createSpy('debug'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      warn: jasmine.createSpy('warn')
    };

    routerStub = {
      url: '/dashboard',
      navigate: jasmine.createSpy('navigate').and.resolveTo(true)
    };

    utilsStub = {
      showNotification: jasmine.createSpy('showNotification')
    };

    utilsIhmStub = {
      confirmDialog: jasmine.createSpy('confirmDialog')
    };

    dataSharingServiceStub = {
      getToken: jasmine.createSpy('getToken').and.returnValue('fake-token'),
      addError: jasmine.createSpy('addError'),
      logout: jasmine.createSpy('logout'),
      redirectToUrl: null
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JwtTokenInterceptor,
        { provide: LoggerService, useValue: loggerStub },
        { provide: Router, useValue: routerStub },
        { provide: UtilsService, useValue: utilsStub },
        { provide: UtilsIhmService, useValue: utilsIhmStub },
        { provide: DataSharingService, useValue: dataSharingServiceStub },
        { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('handles 401 with standard error payload', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({ status: 401, message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    // Interceptor catches 401 and calls error handlers
    expect(dataSharingServiceStub.addError).toHaveBeenCalled();
    expect(dataSharingServiceStub.logout).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
    expect(utilsStub.showNotification).toHaveBeenCalledWith('error', jasmine.any(String));
  });

  it('handles 401 with missing error.message payload safely', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    // Should still handle error gracefully with fallback message
    expect(dataSharingServiceStub.addError).toHaveBeenCalled();
    const errorArg = dataSharingServiceStub.addError.calls.mostRecent().args[0] as MyError;
    expect(errorArg.title).toContain('401');
    expect(errorArg.msg).toBeTruthy();
    expect(dataSharingServiceStub.logout).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('handles 401 with err.error as string (not object) - safeguard', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    // Simulate text/plain error body from proxy/gateway
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    // Should extract message safely without crashing
    expect(dataSharingServiceStub.addError).toHaveBeenCalled();
    expect(dataSharingServiceStub.logout).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('does NOT redirect to login on status 0 (network error)', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.error(new ErrorEvent('Network error', { message: 'Network error' }), { status: 0, statusText: 'Unknown Error' });

    // Should add error but NOT logout or redirect to login
    expect(dataSharingServiceStub.addError).toHaveBeenCalled();
    expect(dataSharingServiceStub.logout).not.toHaveBeenCalled();
    expect(routerStub.navigate).not.toHaveBeenCalled();
  });

  it('does NOT redirect to login on 500 API error', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({ status: 500, message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });

    // Should add error but NOT logout or redirect
    expect(dataSharingServiceStub.addError).toHaveBeenCalled();
    expect(dataSharingServiceStub.logout).not.toHaveBeenCalled();
    expect(routerStub.navigate).not.toHaveBeenCalled();
  });

  it('does NOT redirect if already on /login (prevents redirect loop)', () => {
    routerStub.url = '/login';

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    // Should logout but NOT navigate if already on login
    expect(dataSharingServiceStub.addError).toHaveBeenCalled();
    expect(dataSharingServiceStub.logout).toHaveBeenCalled();
    expect(routerStub.navigate).not.toHaveBeenCalled();
  });

  it('adds Authorization header with Bearer token to outgoing requests', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    expect(dataSharingServiceStub.getToken).toHaveBeenCalled();
    req.flush({});
  });

  it('shows user notification on 401 error', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({ message: 'Bad credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(utilsStub.showNotification).toHaveBeenCalledWith('error', jasmine.any(String));
  });

  it('extracts error message safely from various payload formats', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    // Payload with nested/non-standard structure
    req.flush({ data: { message: 'Custom error' } }, { status: 401, statusText: 'Unauthorized' });

    expect(dataSharingServiceStub.addError).toHaveBeenCalled();
    const errorArg = dataSharingServiceStub.addError.calls.mostRecent().args[0] as MyError;
    // Should have fallback message even with malformed payload
    expect(errorArg.msg).toBeTruthy();
  });

  it('sets redirectToUrl for login redirect recovery', () => {
    routerStub.url = '/dashboard';

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    // Should save current URL for post-login redirect
    expect(dataSharingServiceStub.redirectToUrl).toBe('/dashboard');
  });
});
