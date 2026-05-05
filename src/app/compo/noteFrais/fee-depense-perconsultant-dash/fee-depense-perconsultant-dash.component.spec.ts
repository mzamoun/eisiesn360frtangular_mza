import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';



import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDepensePerconsultantDashComponent } from './fee-depense-perconsultant-dash.component';
import { FormsModule } from '@angular/forms';

describe('FeeDepensePerconsultantDashComponent', () => {
  let component: FeeDepensePerconsultantDashComponent;
  let fixture: ComponentFixture<FeeDepensePerconsultantDashComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ FeeDepensePerconsultantDashComponent ],
      imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule, FormsModule],
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
        { provide: ConsultantService, useValue: { findAll: () => ({ subscribe: (fn: any) => fn({ body: { result: [] } }) }), findAllByEsn: () => ({ subscribe: (fn: any) => fn({ body: { result: [] } }) }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDepensePerconsultantDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
