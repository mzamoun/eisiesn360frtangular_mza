import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TableService } from './table.service';
import { LoggerService } from './logger.service';
import { UtilsService } from './utils.service';
import { DataSharingService } from './data-sharing.service';

describe('TableService', () => {
  let service: TableService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TableService,
        { provide: LoggerService, useValue: { debug: () => {}, error: () => {}, info: () => {}, warn: () => {} } },
        { provide: UtilsService, useValue: { getDate: (d: any) => d } },
        { provide: DataSharingService, useValue: { userConnected: {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(TableService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tables', () => {
    const dummyTables = ['client', 'project'];
    service.getTables(
      (tables: any) => {
        expect(tables).toEqual(dummyTables);
      },
      () => {}
    );

    const req = httpMock.expectOne((request: any) => request.url.includes('/tables/'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyTables);
  });
});
