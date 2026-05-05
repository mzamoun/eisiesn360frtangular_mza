import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return "fr" for France (FR)', () => {
    expect(service.getLangueByPays('FR')).toBe('fr');
  });

  it('should return "ar" for Algeria (DZ)', () => {
    expect(service.getLangueByPays('DZ')).toBe('ar');
  });

  it('should return "en" for Netherlands (NL)', () => {
    expect(service.getLangueByPays('NL')).toBe('en');
  });

  it('should return "en" for United Kingdom (UK)', () => {
    expect(service.getLangueByPays('UK')).toBe('en');
  });

  it('should be case-insensitive', () => {
    expect(service.getLangueByPays('fr')).toBe('fr');
    expect(service.getLangueByPays('dz')).toBe('ar');
  });

  it('should return "en" as fallback for unknown country', () => {
    expect(service.getLangueByPays('XX')).toBe('en');
    expect(service.getLangueByPays('')).toBe('en');
    expect(service.getLangueByPays(null)).toBe('en');
  });

  it('should return all pays for langue "fr"', () => {
    const pays = service.getPaysByLangue('fr');
    expect(pays).toContain('FR');
    expect(pays).toContain('BE');
    expect(pays).not.toContain('DZ');
  });

  it('should return full mapping list', () => {
    const all = service.getAllMappings();
    expect(all.length).toBeGreaterThan(0);
  });
});
