import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerService } from './logger.service';



import { TestBed } from '@angular/core/testing';

import { CraFormsService } from './cra-forms.service';

describe('CraFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule] }));

  it('should be created', () => {
    const service: CraFormsService = TestBed.get(CraFormsService);
    expect(service).toBeTruthy();
  });
});
