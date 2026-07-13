import { TestBed } from '@angular/core/testing';
import { I18nService, PaysLangue } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLangueByPays', () => {
    it('should return French for France (FR)', () => {
      expect(service.getLangueByPays('FR')).toBe('fr');
    });

    it('should return French for Belgium (BE)', () => {
      expect(service.getLangueByPays('BE')).toBe('fr');
    });

    it('should return French for Switzerland (CH)', () => {
      expect(service.getLangueByPays('CH')).toBe('fr');
    });

    it('should return French for Luxembourg (LU)', () => {
      expect(service.getLangueByPays('LU')).toBe('fr');
    });

    it('should return French for Canada (CA)', () => {
      expect(service.getLangueByPays('CA')).toBe('fr');
    });

    it('should return Arabic for Algeria (DZ)', () => {
      expect(service.getLangueByPays('DZ')).toBe('ar');
    });

    it('should return Arabic for Tunisia (TN)', () => {
      expect(service.getLangueByPays('TN')).toBe('ar');
    });

    it('should return Arabic for Morocco (MA)', () => {
      expect(service.getLangueByPays('MA')).toBe('ar');
    });

    it('should return Arabic for Libya (LY)', () => {
      expect(service.getLangueByPays('LY')).toBe('ar');
    });

    it('should return Arabic for Mauritania (MR)', () => {
      expect(service.getLangueByPays('MR')).toBe('ar');
    });

    it('should return English for United Kingdom (GB)', () => {
      expect(service.getLangueByPays('GB')).toBe('en');
    });

    it('should return English for UK alias', () => {
      expect(service.getLangueByPays('UK')).toBe('en');
    });

    it('should return English for United States (US)', () => {
      expect(service.getLangueByPays('US')).toBe('en');
    });

    it('should return English for Australia (AU)', () => {
      expect(service.getLangueByPays('AU')).toBe('en');
    });

    it('should return English for Netherlands (NL)', () => {
      expect(service.getLangueByPays('NL')).toBe('en');
    });

    it('should return English for Germany (DE)', () => {
      expect(service.getLangueByPays('DE')).toBe('en');
    });

    it('should return English for Spain (ES)', () => {
      expect(service.getLangueByPays('ES')).toBe('en');
    });

    it('should return English for Italy (IT)', () => {
      expect(service.getLangueByPays('IT')).toBe('en');
    });

    it('should return English for Poland (PL)', () => {
      expect(service.getLangueByPays('PL')).toBe('en');
    });

    it('should return English for Portugal (PT)', () => {
      expect(service.getLangueByPays('PT')).toBe('en');
    });

    it('should return English for Sweden (SE)', () => {
      expect(service.getLangueByPays('SE')).toBe('en');
    });

    it('should return English for Norway (NO)', () => {
      expect(service.getLangueByPays('NO')).toBe('en');
    });

    it('should return English for Denmark (DK)', () => {
      expect(service.getLangueByPays('DK')).toBe('en');
    });

    it('should be case insensitive', () => {
      expect(service.getLangueByPays('fr')).toBe('fr');
      expect(service.getLangueByPays('Fr')).toBe('fr');
      expect(service.getLangueByPays('FR')).toBe('fr');
      expect(service.getLangueByPays('gb')).toBe('en');
      expect(service.getLangueByPays('GB')).toBe('en');
    });

    it('should return English as default for unknown country', () => {
      expect(service.getLangueByPays('XX')).toBe('en');
      expect(service.getLangueByPays('ZZ')).toBe('en');
      expect(service.getLangueByPays('UNKNOWN')).toBe('en');
    });

    it('should return English for null or empty string', () => {
      expect(service.getLangueByPays('')).toBe('en');
      expect(service.getLangueByPays(null as any)).toBe('en');
      expect(service.getLangueByPays(undefined as any)).toBe('en');
    });
  });

  describe('getAllMappings', () => {
    it('should return all country-language mappings', () => {
      const mappings = service.getAllMappings();
      expect(mappings.length).toBeGreaterThan(0);
      expect(mappings[0].pays).toBeDefined();
      expect(mappings[0].lang).toBeDefined();
    });

    it('should contain expected mappings', () => {
      const mappings = service.getAllMappings();
      const frMapping = mappings.find(m => m.pays === 'FR');
      const usMapping = mappings.find(m => m.pays === 'US');
      const dzMapping = mappings.find(m => m.pays === 'DZ');

      expect(frMapping).toBeDefined();
      expect(frMapping!.lang).toBe('fr');

      expect(usMapping).toBeDefined();
      expect(usMapping!.lang).toBe('en');

      expect(dzMapping).toBeDefined();
      expect(dzMapping!.lang).toBe('ar');
    });

    it('should return consistent results on multiple calls', () => {
      const firstCall = service.getAllMappings();
      const secondCall = service.getAllMappings();
      expect(firstCall.length).toBe(secondCall.length);
      expect(firstCall).toEqual(secondCall);
    });
  });

  describe('getPaysByLangue', () => {
    it('should return all French-speaking countries', () => {
      const frenchCountries = service.getPaysByLangue('fr');
      expect(frenchCountries.length).toBeGreaterThan(0);
      expect(frenchCountries).toContain('FR');
      expect(frenchCountries).toContain('BE');
      expect(frenchCountries).toContain('CA');
    });

    it('should return all English-speaking countries', () => {
      const englishCountries = service.getPaysByLangue('en');
      expect(englishCountries.length).toBeGreaterThan(0);
      expect(englishCountries).toContain('GB');
      expect(englishCountries).toContain('US');
      expect(englishCountries).toContain('NL');
      expect(englishCountries).toContain('DE');
    });

    it('should return all Arabic-speaking countries', () => {
      const arabicCountries = service.getPaysByLangue('ar');
      expect(arabicCountries.length).toBeGreaterThan(0);
      expect(arabicCountries).toContain('DZ');
      expect(arabicCountries).toContain('TN');
      expect(arabicCountries).toContain('MA');
    });

    it('should return empty array for unknown language', () => {
      const unknownCountries = service.getPaysByLangue('xx');
      expect(unknownCountries).toEqual([]);
    });

    it('should handle null or empty language', () => {
      expect(service.getPaysByLangue('')).toEqual([]);
      expect(service.getPaysByLangue(null as any)).toEqual([]);
    });

    it('should return unique country codes', () => {
      const frenchCountries = service.getPaysByLangue('fr');
      const uniqueCountries = [...new Set(frenchCountries)];
      expect(frenchCountries.length).toBe(uniqueCountries.length);
    });
  });

  describe('Mapping completeness', () => {
    it('should have all European ESN target countries', () => {
      const mappings = service.getAllMappings();
      const targetCountries = ['FR', 'NL', 'GB', 'DE', 'CA', 'BE', 'DZ', 'TN', 'MA'];
      
      targetCountries.forEach(country => {
        const mapping = mappings.find(m => m.pays === country);
        expect(mapping).toBeDefined();
        expect(mapping!.lang).toMatch(/^(fr|en|ar)$/);
      });
    });

    it('should have valid language codes', () => {
      const mappings = service.getAllMappings();
      const validLangs = ['fr', 'en', 'ar'];
      
      mappings.forEach(mapping => {
        expect(validLangs).toContain(mapping.lang);
      });
    });

    it('should have valid country codes (2 letters)', () => {
      const mappings = service.getAllMappings();
      
      mappings.forEach(mapping => {
        expect(mapping.pays).toMatch(/^[A-Z]{2}$/);
      });
    });
  });

  describe('PaysLangue interface', () => {
    it('should respect PaysLangue interface structure', () => {
      const mappings = service.getAllMappings();
      mappings.forEach(mapping => {
        expect(mapping.pays).toBeDefined();
        expect(mapping.lang).toBeDefined();
        expect(typeof mapping.pays).toBe('string');
        expect(typeof mapping.lang).toBe('string');
      });
    });
  });
});