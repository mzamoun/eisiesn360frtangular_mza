import { TestBed } from '@angular/core/testing';
import { UtilsIhmService } from './utilsIhm.service';
import { LoggerService } from './logger.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UtilsIhmService', () => {
  let service: UtilsIhmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsIhmService,
        { provide: LoggerService, useValue: { debug: () => {}, error: () => {}, info: () => {}, warn: () => {} } },
        { provide: NgbModal, useValue: { open: () => ({ componentInstance: {}, result: { then: () => {}, catch: () => {} } }) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => {} }) }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(UtilsIhmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
