import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
/// <reference types="jasmine" />

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenService } from '../auth/services/token.service';
import { AuthorizationService } from '../authorization/service/authorization.service';
import { ActivityService } from './activity.service';
import { ClientService } from './client.service';
import { ConsultantService } from './consultant.service';
import { DataSharingService } from './data-sharing.service';
import { EsnService } from './esn.service';
import { LoggerService } from './logger.service';
import { MsgService } from './msg.service';
import { NotificationFacade } from './notification.facade';
import { UiFeedbackFacade } from './ui-feedback.facade';
import { UtilsService } from './utils.service';
import { UtilsIhmService } from './utilsIhm.service';

describe('DataSharingService - isPublicRoute', () => {
  let service: DataSharingService;
  let loggerStub: any;
  let routerStub: any;

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

    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DataSharingService, useValue: {
          userConnected: { esn: { id: 1 }, role: 'ADMIN' },
          userConnected$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          infos$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          errors$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          esnCurrentReady$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          idEsnCurrent$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          listNotifications$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          isUserLoggedInFct: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          logger: { debug: () => {}, error: () => {}, info: () => {} },
          clearErrors: () => {},
          clearInfosErrors: () => {},
          addError: () => {},
          addErrorTxt: () => {},
          addInfo: () => {},
          delInfo: () => {},
          setAdminConsultant: () => {},
          isLoggedIn: () => true,
          isPublicRoute: () => false,
          getLastUserName: () => 'test',
          majManagerOfUserCurent: () => {},
          gotoLogin: () => {},
          gotoMyHome: () => {},
          router: { url: '/test', navigate: () => {} },
          idEsnCurrent: 1
        } },
        DataSharingService,
        UiFeedbackFacade,
        NotificationFacade,
        { provide: LoggerService, useValue: loggerStub },
        { provide: Router, useValue: routerStub },
        { provide: AuthorizationService, useValue: {} },
        { provide: UtilsIhmService, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: ConsultantService, useValue: {} },
        { provide: ActivityService, useValue: {} },
        { provide: EsnService, useValue: {} },
        { provide: ClientService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: MsgService, useValue: {} }
      ]
    });

    service = TestBed.inject(DataSharingService);
  });

  it('should return true for exact /login match', () => {
    expect(service.isPublicRoute('/login')).toBe(true);
  });

  it('should return true for exact /inscription match', () => {
    expect(service.isPublicRoute('/inscription')).toBe(true);
  });

  it('should return false for /loginXYZ (not exact match)', () => {
    expect(service.isPublicRoute('/loginXYZ')).toBe(false);
  });

  it('should return false for /login/admin (sub-path of /login)', () => {
    expect(service.isPublicRoute('/login/admin')).toBe(false);
  });

  it('should return true for /validateEmail with token', () => {
    expect(service.isPublicRoute('/validateEmail/abc123')).toBe(true);
  });

  it('should return true for /resetPassword with token', () => {
    expect(service.isPublicRoute('/resetPassword/xyz789')).toBe(true);
  });

  it('should return true for /validateEmail with complex token', () => {
    expect(service.isPublicRoute('/validateEmail/a-b-c-123-456')).toBe(true);
  });

  it('should return true for /resetPassword with UUID token', () => {
    expect(service.isPublicRoute('/resetPassword/550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should return false for /validateEmail without token', () => {
    expect(service.isPublicRoute('/validateEmail')).toBe(false);
  });

  it('should return false for /resetPassword without token', () => {
    expect(service.isPublicRoute('/resetPassword')).toBe(false);
  });

  it('should return false for /validateEmail/ without token code', () => {
    expect(service.isPublicRoute('/validateEmail/')).toBe(false);
  });

  it('should handle /login with query parameters', () => {
    expect(service.isPublicRoute('/login?redirect=/home&x=1')).toBe(true);
  });

  it('should handle /inscription with fragment', () => {
    expect(service.isPublicRoute('/inscription#section')).toBe(true);
  });

  it('should handle /validateEmail/token with query params', () => {
    expect(service.isPublicRoute('/validateEmail/token123?next=/home')).toBe(true);
  });

  it('should handle /resetPassword/token with fragment', () => {
    expect(service.isPublicRoute('/resetPassword/resetCode#confirm')).toBe(true);
  });

  it('should return false for /dashboard (non-public route)', () => {
    expect(service.isPublicRoute('/dashboard')).toBe(false);
  });

  it('should return false for /my-profile (non-public route)', () => {
    expect(service.isPublicRoute('/my-profile')).toBe(false);
  });

  it('should return false for /home (non-public route)', () => {
    expect(service.isPublicRoute('/home')).toBe(false);
  });

  it('should return false for /admin (non-public route)', () => {
    expect(service.isPublicRoute('/admin')).toBe(false);
  });

  it('should distinguish /login from /logina', () => {
    expect(service.isPublicRoute('/login')).toBe(true);
    expect(service.isPublicRoute('/logina')).toBe(false);
  });

  it('should distinguish /inscription from /inscriptiona', () => {
    expect(service.isPublicRoute('/inscription')).toBe(true);
    expect(service.isPublicRoute('/inscriptiona')).toBe(false);
  });

  it('should return false for /log (not a public route)', () => {
    expect(service.isPublicRoute('/log')).toBe(false);
  });

  it('should return false for /validate (not a public route)', () => {
    expect(service.isPublicRoute('/validate')).toBe(false);
  });

  it('should return false for null (defaults to /)', () => {
    expect(service.isPublicRoute(null)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(service.isPublicRoute('')).toBe(false);
  });

  it('should handle paths without leading slashes', () => {
    expect(service.isPublicRoute('login')).toBe(true);
  });

  it('should be case-sensitive (/LOGIN vs /login)', () => {
    expect(service.isPublicRoute('/LOGIN')).toBe(false);
    expect(service.isPublicRoute('/Login')).toBe(false);
  });
});
