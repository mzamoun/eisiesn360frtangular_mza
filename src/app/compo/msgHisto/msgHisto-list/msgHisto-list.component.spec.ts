import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConsultantService } from 'src/app/service/consultant.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MsgHistoService } from '../../../service/msgHisto.service';
import { MsgHistoListComponent } from './msgHisto-list.component';

describe('MsgHistoListComponent', () => {
  let component: MsgHistoListComponent;
  let fixture: ComponentFixture<MsgHistoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MsgHistoListComponent],
      imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ConsultantService, useValue: {} },
        { provide: MsgHistoService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: UtilsIhmService, useValue: {} },
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
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(MsgHistoListComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgHistoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
