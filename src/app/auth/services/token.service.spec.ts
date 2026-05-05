import { RouterTestingModule } from '@angular/router/testing';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoggerService } from 'src/app/service/logger.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Credentials } from '../credentials';

describe('TokenService', () => {
  let injector: TestBed;
  let service: TokenService;
  let httpMock: HttpTestingController;
  let apiUrl = environment.apiUrl;
  let HttpResponseMock: HttpResponse<any> = {
    body: null,
    type: null,
    clone:null,
    status: 200,
    statusText: null,
    url: null,
    ok: true,
    headers: new HttpHeaders({ 'authorization': 'bearer token' })
  };

  beforeEach(() => {
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
        { provide: ConsultantService, useValue: {} },TokenService]
    });
    injector = getTestBed();
    service = injector.get(TokenService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: TokenService = TestBed.get(TokenService);
    expect(service).toBeTruthy();
  });

  it('should call login endpoint', () => {
    service.getResponseHeaders(new Credentials('', ''))
    .subscribe((res: HttpResponse<any>) => {
      expect(res.headers.get('authorization')).toEqual('bearer token');
    });

    const req = httpMock.expectOne(apiUrl + '/login');
    expect(req.request.method).toBe("POST");
    req.flush({}, HttpResponseMock);
  });

  it('should call logout endpoint', () => {
    service.logout().subscribe(() => {});

    const req = httpMock.expectOne(apiUrl + '/logout');
    expect(req.request.method).toBe("GET");
    req.flush("");
  });
});
