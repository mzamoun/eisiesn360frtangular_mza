import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisService } from 'src/app/service/note-frais.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent (integration)', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  let listNotificationsSubject: BehaviorSubject<any[]>;
  let dataSharingServiceStub: any;

  beforeEach(waitForAsync(() => {
    listNotificationsSubject = new BehaviorSubject<any[]>([]);

    dataSharingServiceStub = {
      userConnected: { id: 5, role: 'CONSULTANT', admin: false },
      listNotifications$: listNotificationsSubject.asObservable(),
      getNotifications: jasmine.createSpy('getNotifications').and.callFake((ok: Function) => {
        if (ok) {
          ok(listNotificationsSubject.value);
        }
      }),
      saveNotification: jasmine.createSpy('saveNotification'),
      deleteNotification: jasmine.createSpy('deleteNotification'),
      isCurrentUserAdmin: jasmine.createSpy('isCurrentUserAdmin').and.returnValue(false),
      logger: {
        debug: jasmine.createSpy('debug'),
        error: jasmine.createSpy('error'),
        warn: jasmine.createSpy('warn'),
        info: jasmine.createSpy('info')
      }
    };

    TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      providers: [
        { provide: UtilsService, useValue: {} },
        { provide: DataSharingService, useValue: dataSharingServiceStub },
        { provide: UtilsIhmService, useValue: { confirmYesNo: jasmine.createSpy('confirmYesNo') } },
        { provide: CraService, useValue: {} },
        { provide: NoteFraisService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: NgbModal, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(NotificationComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it('subscribes to notifications and filters unread when requested', () => {
    component.isOnlyNotViewed = true;
    listNotificationsSubject.next([
      { id: 1, viewed: false },
      { id: 2, viewed: true },
      { id: 3, viewed: false }
    ] as any);

    fixture.detectChanges();

    expect(dataSharingServiceStub.getNotifications).toHaveBeenCalled();
    expect(component.myList.length).toBe(2);
    expect(component.title).toContain('(2)');
  });

  it('toggles viewed state and saves notification', () => {
    const notification = { id: 10, viewed: false } as any;

    fixture.detectChanges();
    component.changeViewed(notification);

    expect(notification.viewed).toBeTrue();
    expect(dataSharingServiceStub.saveNotification).toHaveBeenCalledWith(notification, undefined, undefined);
  });

  it('starts and stops refresh loop and fetches notifications periodically', fakeAsync(() => {
    fixture.detectChanges();
    expect(dataSharingServiceStub.getNotifications).toHaveBeenCalledTimes(1);

    component.refreshEverySec = 1;
    component.refresh();
    expect(component.refreshStarted).toBeTrue();

    tick(5000);
    expect(dataSharingServiceStub.getNotifications).toHaveBeenCalledTimes(2);

    component.refresh();
    expect(component.refreshStarted).toBeFalse();
  }));
});
