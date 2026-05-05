import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { MsgService } from 'src/app/service/msg.service';



import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MsgFormComponent } from './msg-form.component';

describe('MsgFormComponent', () => {
  let component: MsgFormComponent;
  let fixture: ComponentFixture<MsgFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgFormComponent ],
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
        { provide: ConsultantService, useValue: {
          majMsg: () => {}
        } },
        { provide: MsgService, useValue: {
          getMsg: () => null,
          save: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
        } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
