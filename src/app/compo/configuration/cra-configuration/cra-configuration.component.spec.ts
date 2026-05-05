import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';



import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CraConfigurationComponent } from './cra-configuration.component';

describe('CraConfigurationComponent', () => {
  let component: CraConfigurationComponent;
  let fixture: ComponentFixture<CraConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CraConfigurationComponent ],
      imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule, CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DataSharingService, useValue: {
          userConnected: { esn: {}, role: 'ADMIN' },
          userConnected$: { subscribe: (next: any) => { if (next) { next(null); } return { unsubscribe: () => {} }; } },
          infos$: { subscribe: (next: any) => { if (next) { next([]); } return { unsubscribe: () => {} }; } },
          errors$: { subscribe: (next: any) => { if (next) { next([]); } return { unsubscribe: () => {} }; } },
          esnCurrentReady$: { subscribe: (next: any) => { if (next) { next(null); } return { unsubscribe: () => {} }; } },
          idEsnCurrent$: { subscribe: (next: any) => { if (next) { next(null); } return { unsubscribe: () => {} }; } },
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
          router: { url: '/configuration' },
          gotoLogin: () => {},
          idEsnCurrent: null,
          isLoggedIn: () => true,
          getLastUserName: () => 'test',
          majManagerOfUserCurent: () => {}
        } },
        { provide: ConsultantService, useValue: {} },
        DatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
