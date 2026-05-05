import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementRef } from '@angular/core';
import { AuthorizationDirective } from './authorization.directive';

describe('AuthorizationDirective', () => {
  it('should create an instance', () => {
    const loggerStub: any = { debug: jasmine.createSpy('debug') };
    const authzStub: any = { hasPermission: jasmine.createSpy('hasPermission').and.returnValue(true) };
    const elementRefStub = { nativeElement: { style: {} } } as ElementRef;

    const directive = new AuthorizationDirective(loggerStub, authzStub, elementRefStub);
    expect(directive).toBeTruthy();
  });
});
