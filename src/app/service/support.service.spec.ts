import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SupportService } from './support.service';

describe('SupportService', () => {
  let service: SupportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupportService]
    });
    service = TestBed.inject(SupportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tickets', () => {
    const dummyResponse = { body: { result: [] } } as any;
    service.findAll().subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne((request: any) => request.url.includes('/support/'));
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should add a ticket', () => {
    const ticket = { subject: 'Test' };
    const dummyResponse = { body: { result: ticket } } as any;
    service.addTicket(ticket).subscribe(data => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne((request: any) => request.url.includes('/support/'));
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });
});
