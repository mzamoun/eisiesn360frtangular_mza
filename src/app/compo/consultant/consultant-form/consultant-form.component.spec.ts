import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';



import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConsultantFormComponent } from './consultant-form.component';

describe('ConsultantFormComponent', () => {
  let component: ConsultantFormComponent;
  let fixture: ComponentFixture<ConsultantFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultantFormComponent ],
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule, FormsModule],
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
          getConsultant: () => null,
          majAdminConsultant: () => {},
          findNotAdminConsultant: () => ({ subscribe: (fn: any) => { fn({ body: { result: [] } }); return { unsubscribe: () => {} }; } }),
          getRoles: () => ({ subscribe: (fn: any) => { fn({ body: { result: [] } }); return { unsubscribe: () => {} }; } }),
          save: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
        } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
