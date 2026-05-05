import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';



import { TestBed } from '@angular/core/testing';

import { ActivityService } from './activity.service';

import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';

describe('ActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule],
    providers: [
      { provide: DataSharingService, useValue: {
        userConnected: { esn: { id: 1 }, role: 'ADMIN' },
        userConnected$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
        infos$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
        errors$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
        esnCurrentReady$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
        isUserLoggedInFct: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
        logger: { debug: () => {}, error: () => {}, info: () => {} },
        clearErrors: () => {}, clearInfosErrors: () => {}, addError: () => {},
        addErrorTxt: () => {}, addInfo: () => {}, delInfo: () => {},
        setAdminConsultant: () => {}, isLoggedIn: () => true,
        isPublicRoute: () => false, getLastUserName: () => 'test',
        majManagerOfUserCurent: () => {}, gotoLogin: () => {},
        gotoMyHome: () => {}, router: { url: '/test', navigate: () => {} }
      } },
      { provide: ConsultantService, useValue: { findAll: () => ({ subscribe: (fn: any) => fn({ body: { result: [] } }) }) } }
    ]
  }));

  it('should be created', () => {
    const service: ActivityService = TestBed.get(ActivityService);
    expect(service).toBeTruthy();
  });
});
