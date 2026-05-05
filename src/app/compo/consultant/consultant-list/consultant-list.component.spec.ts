import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';



import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPaginationModule } from 'ngx-pagination';
import { ConsultantListComponent } from './consultant-list.component';

describe('ConsultantListComponent', () => {
  let component: ConsultantListComponent;
  let fixture: ComponentFixture<ConsultantListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultantListComponent ],
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule, NgxPaginationModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DataSharingService, useValue: {
          userConnected: { esn: {}, role: 'ADMIN' },
          userConnected$: { subscribe: (next: any) => { if (next) { next(null); } return { unsubscribe: () => {} }; } },
          infos$: { subscribe: (next: any) => { if (next) { next([]); } return { unsubscribe: () => {} }; } },
          errors$: { subscribe: (next: any) => { if (next) { next([]); } return { unsubscribe: () => {} }; } },
          esnCurrentReady$: { subscribe: (next: any) => { if (next) { next(null); } return { unsubscribe: () => {} }; } },
          isUserLoggedInFct: { subscribe: (next: any) => { if (next) { next(false); } return { unsubscribe: () => {} }; } },
          logger: { debug: () => {}, error: () => {}, info: () => {} },
          clearErrors: () => {},
          clearInfosErrors: () => {},
          addInfo: () => {},
          delInfo: () => {},
          addError: () => {},
          addErrorTxt: () => {},
          setAdminConsultant: () => {},
          isPublicRoute: () => false,
          router: { url: '/consultant' },
          gotoLogin: () => {},
          isLoggedIn: () => true,
          getLastUserName: () => 'test',
          majManagerOfUserCurent: () => {}
        } },
        { provide: ConsultantService, useValue: {
          AFF_ALL: 'ALL',
          findAll: () => ({ subscribe: (next: any) => next({ body: { result: [] } }) }),
          findAllByEsn: () => ({ subscribe: (next: any) => next({ body: { result: [] } }) }),
          getRoles: () => ({ subscribe: (next: any) => next({ body: { result: [] } }) }),
          setConsultant: () => {},
          setManagerSelected: () => {},
          deleteById: () => ({ subscribe: (next: any) => next({}) })
        } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
