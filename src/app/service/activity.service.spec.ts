import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivityService } from './activity.service';
import { Activity } from '../model/activity';
import { Consultant } from '../model/consultant';
import { Project } from '../model/project';
import { LoggerService } from './logger.service';
import { UtilsService } from './utils.service';
import { DataSharingService } from './data-sharing.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpMock: HttpTestingController;
  let mockLoggerService: any;
  let mockUtilsService: any;
  let mockDataSharingService: any;

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

    mockDataSharingService = {
      userConnected: { id: 1, username: 'testuser' }
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DataSharingService, useValue: mockDataSharingService }
      ]
    });

    service = TestBed.inject(ActivityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Activity getter/setter', () => {
    it('should set and get activity', () => {
      const testActivity = new Activity();
      testActivity.id = 123;
      
      service.setActivity(testActivity);
      const retrieved = service.getActivity();
      
      expect(retrieved).toBe(testActivity);
      expect(retrieved.id).toBe(123);
    });
  });

  describe('findAllByConsultant', () => {
    it('should fetch all activities when idConsultant is 0', () => {
      service.findAllByConsultant(0).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/all'));
      expect(req.request.method).toBe('GET');
      req.flush({ result: [] });
    });

    it('should fetch activities by consultant id when idConsultant > 0', () => {
      service.findAllByConsultant(5).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/idConsultant/5'));
      expect(req.request.method).toBe('GET');
      req.flush({ result: [] });
    });

    it('should call logger.debug with correct parameters', () => {
      service.findAllByConsultant(10).subscribe();
      
      expect(mockLoggerService.debug).toHaveBeenCalledWith('findAllByConsultant idConsultant : ', 10);
      
      const req = httpMock.expectOne(request => request.url.includes('/activity/idConsultant/10'));
      req.flush({ result: [] });
    });
  });

  describe('findAll', () => {
    it('should fetch all activities', () => {
      service.findAll().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/all'));
      expect(req.request.method).toBe('GET');
      req.flush({ result: [] });
    });
  });

  describe('findById', () => {
    it('should fetch activity by id', () => {
      service.findById(42).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/42'));
      expect(req.request.method).toBe('GET');
      req.flush({ result: { id: 42 } });
    });
  });

  describe('save', () => {
    it('should POST when activity id is 0 or negative', () => {
      const activity = new Activity();
      activity.id = 0;

      service.save(activity).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/'));
      expect(req.request.method).toBe('POST');
      req.flush({ result: {} });
    });

    it('should PUT when activity id is positive', () => {
      const activity = new Activity();
      activity.id = 5;

      service.save(activity).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/'));
      expect(req.request.method).toBe('PUT');
      req.flush({ result: {} });
    });
  });

  describe('addMultipleActivity', () => {
    it('should POST multiple activities', () => {
      const activities = [new Activity(), new Activity()];

      service.addMultipleActivity(activities).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/addMultipleActivity'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(activities);
      req.flush({ result: {} });
    });
  });

  describe('deleteById', () => {
    it('should DELETE activity by id', () => {
      service.deleteById(7).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/7'));
      expect(req.request.method).toBe('DELETE');
      req.flush({ result: {} });
    });
  });

  describe('deleteAll', () => {
    it('should DELETE all activities', () => {
      service.deleteAll().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => request.url.includes('/activity/'));
      expect(req.request.method).toBe('DELETE');
      req.flush({ result: {} });
    });
  });

  describe('getFilteredActivity', () => {
    it('should fetch filtered activities by consultant username', () => {
      service.getFilteredActivity('john.doe').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/activity/list/filtered') &&
        request.url.includes('createdByUserId=1') &&
        request.url.includes('consultant.username=john.doe')
      );
      expect(req.request.method).toBe('GET');
      req.flush({ result: [] });
    });
  });

  describe('getListActivityOfUser', () => {
    it('should fetch activities for a specific consultant', () => {
      const consultant = new Consultant();
      consultant.username = 'testuser';

      service.getListActivityOfUser(consultant).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/activity/list/filtered') &&
        request.url.includes('consultant.username=testuser')
      );
      expect(req.request.method).toBe('GET');
      req.flush({ result: [] });
    });
  });

  describe('getListActivityOfProject', () => {
    it('should fetch activities for a specific project', () => {
      const project = new Project();
      project.name = 'TestProject';

      service.getListActivityOfProject(project).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(request => 
        request.url.includes('/activity/list/filtered') &&
        request.url.includes('project.name=TestProject')
      );
      expect(req.request.method).toBe('GET');
      req.flush({ result: [] });
    });
  });
});