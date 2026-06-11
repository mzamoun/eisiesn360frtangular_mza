import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerService } from './logger.service';



import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule] }));

  it('should be created', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service).toBeTruthy();
  });
});

// faire plusieurs tests à uniformName
describe('uniformName', () => {
  it('should return empty string when name is empty', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service.uniformName('')).toBe('');
  });

  it('should return uppercase string when name is not empty', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service.uniformName('test')).toBe('TEST');
  });

  it('should return uppercase string when name has spaces', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service.uniformName('test test')).toBe('TEST TEST');
  });

  it('should return trim uppercase string when name has spaces', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service.uniformName('test test   aaa  ')).toBe('TEST TEST AAA');
  });

});
