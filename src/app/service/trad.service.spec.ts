import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerService } from './logger.service';



import { TestBed } from '@angular/core/testing';

import { TradService } from './trad.service';

describe('TradService', () => {
  let service: TradService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule] });
    service = TestBed.inject(TradService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
