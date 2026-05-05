/**
 * Test Helpers - Stub et Configuration réutilisables pour les specs
 * Centralise la configuration TestBed pour éviter duplication et assurer cohérence
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UtilsService } from '../service/utils.service';
import { UtilsIhmService } from '../service/utilsIhm.service';

/**
 * Imports de modules pour HTTP testing
 */
export const HTTP_TEST_IMPORTS = [HttpClientTestingModule];

/**
 * Imports de modules pour routing testing
 */
export const ROUTER_TEST_IMPORTS = [RouterTestingModule];

/**
 * Imports pour Material Dialog
 */
export const MATERIAL_DIALOG_IMPORTS = [BrowserAnimationsModule];

/**
 * Imports pour Material DatePicker
 */
export const MATERIAL_DATE_IMPORTS = [MatNativeDateModule];

/**
 * Stub pour MatDialog
 */
export const MAT_DIALOG_STUB = {
  provide: MatDialog,
  useValue: {
    open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(null) }),
    closeAll: jasmine.createSpy('closeAll')
  }
};

/**
 * Stub pour UtilsIhmService
 */
export const UTILS_IHM_SERVICE_STUB = {
  provide: UtilsIhmService,
  useValue: {
    showError: jasmine.createSpy('showError'),
    showSuccess: jasmine.createSpy('showSuccess'),
    showWarning: jasmine.createSpy('showWarning'),
    showInfo: jasmine.createSpy('showInfo')
  }
};

/**
 * Stub pour UtilsService
 */
export const UTILS_SERVICE_STUB = {
  provide: UtilsService,
  useValue: {
    navigate: jasmine.createSpy('navigate'),
    navigateWithParam: jasmine.createSpy('navigateWithParam'),
    openUrl: jasmine.createSpy('openUrl')
  }
};

/**
 * Stub pour Router
 */
export const ROUTER_STUB = {
  provide: Router,
  useValue: {
    navigate: jasmine.createSpy('navigate'),
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
    url: '/test'
  }
};

/**
 * Stub pour ActivatedRoute
 */
export const ACTIVATED_ROUTE_STUB = {
  provide: ActivatedRoute,
  useValue: {
    snapshot: {
      params: {},
      queryParams: {},
      fragment: null,
      data: {}
    },
    params: of({}),
    queryParams: of({}),
    fragment: of(null),
    data: of({})
  }
};

/**
 * Configuration courante pour spec simples : HTTP + Router + NO_ERRORS_SCHEMA
 */
export const COMMON_TEST_SETUP = {
  imports: [...HTTP_TEST_IMPORTS, ...ROUTER_TEST_IMPORTS],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [UTILS_IHM_SERVICE_STUB, UTILS_SERVICE_STUB, ROUTER_STUB, ACTIVATED_ROUTE_STUB]
};
