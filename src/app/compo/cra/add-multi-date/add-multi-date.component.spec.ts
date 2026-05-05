import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';



import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { AddMultiDateComponent } from './add-multi-date.component';

describe('AddMultiDateComponent', () => {
  let component: AddMultiDateComponent;
  let fixture: ComponentFixture<AddMultiDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultiDateComponent ],
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule],
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
          getService: () => null,
          isPublicRoute: () => false,
          router: { url: '/cra' },
          gotoLogin: () => {},
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
    fixture = TestBed.createComponent(AddMultiDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
