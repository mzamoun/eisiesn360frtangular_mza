import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerService } from './logger.service';



import { TestBed } from '@angular/core/testing';

import { MsgHistoService } from './msgHisto.service';

describe('MsgHistoService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule] }));

  it('should be created', () => {
    const service: MsgHistoService = TestBed.get(MsgHistoService);
    expect(service).toBeTruthy();
  });
});
