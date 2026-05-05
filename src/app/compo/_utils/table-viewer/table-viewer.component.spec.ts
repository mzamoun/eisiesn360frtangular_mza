import { RouterTestingModule } from '@angular/router/testing';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';



import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewerComponent } from './table-viewer.component';

describe('TableViewerComponent', () => {
  let component: TableViewerComponent;
  let fixture: ComponentFixture<TableViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableViewerComponent ],
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule],
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
        { provide: ConsultantService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
