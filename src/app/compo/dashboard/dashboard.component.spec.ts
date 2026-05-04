/// <reference types="jasmine" />

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AuthorizationService } from 'src/app/authorization/service/authorization.service';
import { ActivityService } from 'src/app/service/activity.service';
import { ClientService } from 'src/app/service/client.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { DocumentService } from 'src/app/service/document.service';
import { EsnService } from 'src/app/service/esn.service';
import { LoggerService } from 'src/app/service/logger.service';
import { MsgService } from 'src/app/service/msg.service';
import { ProjectService } from 'src/app/service/project.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { DashBoardComponent } from './dashboard.component';

function okResponse(result: any) {
  return of({ body: { result } } as any);
}

describe('DashBoardComponent (integration)', () => {
  let fixture: ComponentFixture<DashBoardComponent>;
  let component: DashBoardComponent;

  let userConnectedSubject: BehaviorSubject<any>;
  let esnCurrentReadySubject: BehaviorSubject<any>;

  let dataSharingServiceStub: any;
  let authzStub: any;
  let loggerStub: any;
  let routerStub: any;
  let utilsIhmStub: any;

  let clientServiceStub: any;
  let projectServiceStub: any;
  let activityServiceStub: any;
  let consultantServiceStub: any;
  let craServiceStub: any;
  let esnServiceStub: any;
  let documentServiceStub: any;

  beforeEach(waitForAsync(() => {
    userConnectedSubject = new BehaviorSubject<any>(null);
    esnCurrentReadySubject = new BehaviorSubject<any>(null);

    authzStub = {
      hasPermission: jasmine.createSpy('hasPermission').and.returnValue(true)
    };

    loggerStub = {
      debug: jasmine.createSpy('debug'),
      error: jasmine.createSpy('error'),
      warn: jasmine.createSpy('warn'),
      info: jasmine.createSpy('info')
    };

    routerStub = {
      navigate: jasmine.createSpy('navigate').and.resolveTo(true)
    };

    utilsIhmStub = {
      confirmDialog: jasmine.createSpy('confirmDialog')
    };

    clientServiceStub = {
      findAll: jasmine.createSpy('findAll').and.returnValue(okResponse([{ id: 1 }])),
      findAllAll: jasmine.createSpy('findAllAll').and.returnValue(okResponse([{ id: 1 }, { id: 2 }]))
    };

    projectServiceStub = {
      findAll: jasmine.createSpy('findAll').and.returnValue(okResponse([{ id: 10 }]))
    };

    activityServiceStub = {
      findAll: jasmine.createSpy('findAll').and.returnValue(okResponse([{ id: 20, typeName: 'MISSION' }]))
    };

    consultantServiceStub = {
      findAll: jasmine.createSpy('findAll').and.returnValue(okResponse([{ id: 1 }, { id: 2 }])),
      findAllByEsn: jasmine.createSpy('findAllByEsn').and.returnValue(okResponse([
        { id: 7, role: 'MANAGER', esnId: 42 },
        { id: 8, role: 'CONSULTANT', esnId: 42, adminConsultantId: 7 }
      ]))
    };

    craServiceStub = {
      findAll: jasmine.createSpy('findAll').and.returnValue(okResponse([]))
    };

    esnServiceStub = {
      findAll: jasmine.createSpy('findAll').and.returnValue(okResponse([{ id: 42 }]))
    };

    documentServiceStub = {
      findAllByConsultant: jasmine.createSpy('findAllByConsultant').and.returnValue(okResponse([]))
    };

    dataSharingServiceStub = {
      userConnected: null,
      idEsnCurrent: null,
      userConnected$: userConnectedSubject.asObservable(),
      esnCurrentReady$: esnCurrentReadySubject.asObservable(),
      forceRefreshNotifications: jasmine.createSpy('forceRefreshNotifications'),
      getNotifications: jasmine.createSpy('getNotifications').and.callFake((ok: Function) => {
        if (ok) {
          ok([{ id: 100 }, { id: 101 }]);
        }
      }),
      getListNotifications: jasmine.createSpy('getListNotifications').and.returnValue([{ id: 100 }, { id: 101 }]),
      addInfo: jasmine.createSpy('addInfo'),
      delInfo: jasmine.createSpy('delInfo'),
      addError: jasmine.createSpy('addError'),
      setListCra: jasmine.createSpy('setListCra'),
      majListCra: jasmine.createSpy('majListCra'),
      majEsnOnConsultant: jasmine.createSpy('majEsnOnConsultant').and.callFake((ok: Function) => {
        if (ok) {
          ok();
        }
      }),
      clientWarningShown: false,
      projectWarningShown: false,
      missionActivityWarningShown: false,
      managerWarningShown: false,
      consultantWarningShown: false
    };

    TestBed.configureTestingModule({
      declarations: [DashBoardComponent],
      providers: [
        { provide: AuthorizationService, useValue: authzStub },
        { provide: MsgService, useValue: {} },
        { provide: ClientService, useValue: clientServiceStub },
        { provide: ProjectService, useValue: projectServiceStub },
        { provide: ActivityService, useValue: activityServiceStub },
        { provide: ConsultantService, useValue: consultantServiceStub },
        { provide: CraService, useValue: craServiceStub },
        { provide: EsnService, useValue: esnServiceStub },
        { provide: DocumentService, useValue: documentServiceStub },
        { provide: DataSharingService, useValue: dataSharingServiceStub },
        { provide: LoggerService, useValue: loggerStub },
        { provide: UtilsIhmService, useValue: utilsIhmStub },
        { provide: Router, useValue: routerStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(DashBoardComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DashBoardComponent);
    component = fixture.componentInstance;
  }));

  it('loads notification count on init for ADMIN context', fakeAsync(() => {
    const adminUser = { id: 1, role: 'ADMIN' } as any;
    dataSharingServiceStub.userConnected = adminUser;
    userConnectedSubject.next(adminUser);

    fixture.detectChanges();
    tick(3100);

    const notificationSection = component.sections.find(s => s.title === 'Notifications');

    expect(dataSharingServiceStub.forceRefreshNotifications).toHaveBeenCalled();
    expect(dataSharingServiceStub.getNotifications).toHaveBeenCalled();
    expect(notificationSection?.count).toBe(2);
  }));

  it('does not reload counts for duplicate esn id emissions', fakeAsync(() => {
    const managerUser = { id: 7, role: 'MANAGER', esnId: 42 } as any;
    dataSharingServiceStub.userConnected = managerUser;
    dataSharingServiceStub.idEsnCurrent = 42;
    userConnectedSubject.next(managerUser);

    fixture.detectChanges();
    tick(3100);

    expect(dataSharingServiceStub.forceRefreshNotifications).toHaveBeenCalledTimes(1);

    esnCurrentReadySubject.next({ id: 42 } as any);
    tick(3100);
    esnCurrentReadySubject.next({ id: 42 } as any);
    tick(3100);

    expect(dataSharingServiceStub.forceRefreshNotifications).toHaveBeenCalledTimes(1);
  }));
});
