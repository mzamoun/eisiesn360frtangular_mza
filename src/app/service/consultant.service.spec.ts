import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DataSharingService } from './data-sharing.service';
import { ActivityService } from './activity.service';
import { UtilsService } from './utils.service';

import { TestBed, inject } from '@angular/core/testing';

import { ConsultantService } from './consultant.service';
import { Consultant } from '../model/consultant';
import { Activity } from '../model/activity';

describe('ConsultantService', () => {
  let service: ConsultantService;
  let httpMock: HttpTestingController;
  let mockDataSharingService: any;
  let mockActivityService: any;
  let mockUtilsService: any;
  let mockLoggerService: any;

  beforeEach(() => {
    mockLoggerService = {
      debug: jasmine.createSpy('debug'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      warn: jasmine.createSpy('warn')
    };

    mockUtilsService = {
      getDate: jasmine.createSpy('getDate').and.callFake((date) => date),
      addDays: jasmine.createSpy('addDays').and.callFake((date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      })
    };

    mockActivityService = {
      save: jasmine.createSpy('save').and.callFake(() => ({
        subscribe: jasmine.createSpy('subscribe').and.callFake((cb) => cb({ body: { result: {} } }))
      }))
    };

    mockDataSharingService = {
      userConnected: { esn: { id: 1 }, role: 'ADMIN' },
      userConnected$: { subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy('unsubscribe') }) },
      infos$: { subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy('unsubscribe') }) },
      errors$: { subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy('unsubscribe') }) },
      esnCurrentReady$: { subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy('unsubscribe') }) },
      idEsnCurrent$: { subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy('unsubscribe') }) },
      listNotifications$: { subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy('unsubscribe') }) },
      isUserLoggedInFct: { subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy('unsubscribe') }) },
      logger: mockLoggerService,
      clearErrors: jasmine.createSpy('clearErrors'),
      clearInfosErrors: jasmine.createSpy('clearInfosErrors'),
      addError: jasmine.createSpy('addError'),
      addErrorTxt: jasmine.createSpy('addErrorTxt'),
      addInfo: jasmine.createSpy('addInfo'),
      delInfo: jasmine.createSpy('delInfo'),
      setAdminConsultant: jasmine.createSpy('setAdminConsultant'),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
      isPublicRoute: jasmine.createSpy('isPublicRoute').and.returnValue(false),
      getLastUserName: jasmine.createSpy('getLastUserName').and.returnValue('test'),
      majManagerOfUserCurent: jasmine.createSpy('majManagerOfUserCurent'),
      gotoLogin: jasmine.createSpy('gotoLogin'),
      gotoMyHome: jasmine.createSpy('gotoMyHome'),
      router: { url: '/test', navigate: jasmine.createSpy('navigate') },
      idEsnCurrent: 1,
      activityService: mockActivityService
    };

    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: DataSharingService, useValue: mockDataSharingService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: UtilsService, useValue: mockUtilsService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    service = TestBed.inject(ConsultantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('majActivityList', () => {
    it('should adjust activity dates when entryDate is after activity.dateDeb', () => {
      const consultant = new Consultant();
      consultant.entryDate = new Date('2026-03-03');
      
      const activity = new Activity();
      activity.dateDeb = new Date('2017-09-18');
      activity.dateFin = new Date('2018-09-18');
      
      consultant.listActivity = [activity];

      service.majActivityList(consultant);

      expect(activity.dateDeb).toEqual(consultant.entryDate);
      expect(mockActivityService.save).toHaveBeenCalledWith(activity);
    });

    it('should adjust activity dates when entryDate is after activity.dateFin', () => {
      const consultant = new Consultant();
      consultant.entryDate = new Date('2026-03-03');
      
      const activity = new Activity();
      activity.dateDeb = new Date('2015-09-18');
      activity.dateFin = new Date('2016-09-18');
      
      consultant.listActivity = [activity];

      service.majActivityList(consultant);

      expect(activity.dateDeb).toEqual(consultant.entryDate);
      expect(activity.dateFin.getFullYear()).toBe(consultant.entryDate.getFullYear() + 1);
      expect(mockActivityService.save).toHaveBeenCalledWith(activity);
    });

    it('should not adjust dates when activity dates are valid', () => {
      const consultant = new Consultant();
      consultant.entryDate = new Date('2026-03-03T00:00:00');
      
      const activity = new Activity();
      activity.dateDeb = new Date('2026-03-03T00:00:00'); // Same as entryDate
      activity.dateFin = new Date('2027-03-03T00:00:00'); // After entryDate
      
      consultant.listActivity = [activity];

      service.majActivityList(consultant);

      expect(mockActivityService.save).not.toHaveBeenCalled();
    });

    it('should handle null/undefined activity dates', () => {
      const consultant = new Consultant();
      consultant.entryDate = new Date('2026-03-03');
      
      const activity = new Activity();
      activity.dateDeb = null;
      activity.dateFin = null;
      
      consultant.listActivity = [activity];

      service.majActivityList(consultant);

      expect(activity.dateDeb).toEqual(consultant.entryDate);
      expect(activity.dateFin.getFullYear()).toBe(consultant.entryDate.getFullYear() + 1);
    });

    it('should handle consultant without activities', () => {
      const consultant = new Consultant();
      consultant.entryDate = new Date('2026-03-03');
      consultant.listActivity = null;

      expect(() => service.majActivityList(consultant)).not.toThrow();
    });

    it('should handle empty activity list', () => {
      const consultant = new Consultant();
      consultant.entryDate = new Date('2026-03-03');
      consultant.listActivity = [];

      service.majActivityList(consultant);

      expect(mockActivityService.save).not.toHaveBeenCalled();
    });
  });

  describe('addYear', () => {
    it('should add one year to a date', () => {
      const date = new Date('2026-03-03');
      const result = service.addYear(date, 1);
      
      expect(result.getFullYear()).toBe(2027);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(3);
    });

    it('should add multiple years to a date', () => {
      const date = new Date('2026-03-03');
      const result = service.addYear(date, 5);
      
      expect(result.getFullYear()).toBe(2031);
    });

    it('should not mutate the original date', () => {
      const date = new Date('2026-03-03');
      const originalYear = date.getFullYear();
      
      service.addYear(date, 1);
      
      expect(date.getFullYear()).toBe(originalYear);
    });
  });
});
