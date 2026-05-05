import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [MatDialogModule, 
        RouterTestingModule,
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DataSharingService, useValue: {
          userConnected: { esn: {}, role: 'ADMIN' },
          userConnected$: { subscribe: (next: any) => { if (next) { next(null); } return { unsubscribe: () => {} }; } },
          infos$: { subscribe: (next: any) => { if (next) { next([]); } return { unsubscribe: () => {} }; } },
          errors$: { subscribe: (next: any) => { if (next) { next([]); } return { unsubscribe: () => {} }; } },
          esnCurrentReady$: { subscribe: (next: any) => { if (next) { next(null); } return { unsubscribe: () => {} }; } },
          listNotifications$: { subscribe: (next: any) => { if (next) { next([]); } return { unsubscribe: () => {} }; } },
          isUserLoggedInFct: { subscribe: (next: any) => { if (next) { next(false); } return { unsubscribe: () => {} }; } },
          logger: { debug: () => {}, error: () => {}, info: () => {} },
          clearErrors: () => {},
          clearInfosErrors: () => {},
          addInfo: () => {},
          delInfo: () => {},
          addError: () => {},
          addErrorTxt: () => {},
          setAdminConsultant: () => {},
          setHeaderComponent: () => {},
          isPublicRoute: () => false,
          router: { url: '/header' },
          gotoLogin: () => {},
          majEsnOnConsultant: (onSuccess: any) => onSuccess && onSuccess(null),
          notifyEsnCurrentReady: () => {},
          saveTokenUser: () => {},
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
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
