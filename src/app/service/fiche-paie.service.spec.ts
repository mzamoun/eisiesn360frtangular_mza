import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FichePaieService } from './fiche-paie.service';

import { FichePaie } from '../model/fiche-paie';

describe('FichePaieService', () => {
  let service: FichePaieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FichePaieService]
    });
    service = TestBed.inject(FichePaieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all fiches de paie', () => {
    const dummyResponse = { body: { result: [] } } as any;
    service.findAll().subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne((request: any) => request.url.includes('/fiche-paie/'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should save a new fiche de paie', () => {
    const fichePaie = new FichePaie();
    const dummyResponse = { body: { result: fichePaie } } as any;
    service.save(fichePaie).subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne((request: any) => request.url.includes('/fiche-paie/'));
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });
});
