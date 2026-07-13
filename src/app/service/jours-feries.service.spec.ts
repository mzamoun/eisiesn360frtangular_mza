import { TestBed } from '@angular/core/testing';
import { JoursFeriesService, JourFerie } from './jours-feries.service';

describe('JoursFeriesService', () => {
  let service: JoursFeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoursFeriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJoursFeries', () => {
    it('should return French holidays for FR', () => {
      const holidays = service.getJoursFeries(2024, 'FR');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('FR');
      expect(holidays[0].label).toBe("Jour de l'An");
    });

    it('should return French holidays for BE', () => {
      const holidays = service.getJoursFeries(2024, 'BE');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('BE');
    });

    it('should return Dutch holidays for NL', () => {
      const holidays = service.getJoursFeries(2024, 'NL');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('NL');
      expect(holidays[0].label).toBe('Nieuwjaarsdag');
    });

    it('should return UK holidays for GB', () => {
      const holidays = service.getJoursFeries(2024, 'GB');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('GB');
    });

    it('should return UK holidays for UK alias', () => {
      const holidays = service.getJoursFeries(2024, 'UK');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('GB');
    });

    it('should return German holidays for DE', () => {
      const holidays = service.getJoursFeries(2024, 'DE');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('DE');
    });

    it('should return Canadian holidays for CA', () => {
      const holidays = service.getJoursFeries(2024, 'CA');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('CA');
    });

    it('should return Algerian holidays for DZ', () => {
      const holidays = service.getJoursFeries(2024, 'DZ');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('DZ');
    });

    it('should return Tunisian holidays for TN', () => {
      const holidays = service.getJoursFeries(2024, 'TN');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('TN');
    });

    it('should return Moroccan holidays for MA', () => {
      const holidays = service.getJoursFeries(2024, 'MA');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('MA');
    });

    it('should default to French holidays for unknown country', () => {
      const holidays = service.getJoursFeries(2024, 'XX');
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('FR');
    });

    it('should be case insensitive for country code', () => {
      const holidaysLower = service.getJoursFeries(2024, 'fr');
      const holidaysUpper = service.getJoursFeries(2024, 'FR');
      expect(holidaysLower.length).toEqual(holidaysUpper.length);
    });

    it('should handle null country code', () => {
      const holidays = service.getJoursFeries(2024, null as any);
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0].pays).toBe('FR');
    });
  });

  describe('isJourFerie', () => {
    it('should return true for French New Year', () => {
      const newYear = new Date(2024, 0, 1); // January 1st, 2024
      expect(service.isJourFerie(newYear, 'FR')).toBe(true);
    });

    it('should return false for regular working day', () => {
      const regularDay = new Date(2024, 0, 8); // January 8th, 2024 (Monday)
      expect(service.isJourFerie(regularDay, 'FR')).toBe(false);
    });

    it('should return true for Dutch King\'s Day', () => {
      const kingsDay = new Date(2024, 3, 27); // April 27th, 2024
      expect(service.isJourFerie(kingsDay, 'NL')).toBe(true);
    });

    it('should return false for Dutch King\'s Day in France', () => {
      const kingsDay = new Date(2024, 3, 27); // April 27th, 2024
      expect(service.isJourFerie(kingsDay, 'FR')).toBe(false);
    });

    it('should return true for Christmas in multiple countries', () => {
      const christmas = new Date(2024, 11, 25); // December 25th, 2024
      expect(service.isJourFerie(christmas, 'FR')).toBe(true);
      expect(service.isJourFerie(christmas, 'DE')).toBe(true);
      expect(service.isJourFerie(christmas, 'CA')).toBe(true);
    });
  });

  describe('countJoursOuvres', () => {
    it('should count business days excluding weekends', () => {
      const start = new Date(2024, 0, 8); // Monday
      const end = new Date(2024, 0, 12); // Friday
      const count = service.countJoursOuvres(start, end, 'FR');
      expect(count).toBe(5); // Monday to Friday
    });

    it('should exclude holidays from business days', () => {
      const start = new Date(2024, 0, 1); // Monday (New Year)
      const end = new Date(2024, 0, 5); // Friday
      const count = service.countJoursOuvres(start, end, 'FR');
      expect(count).toBe(4); // 5 days minus New Year
    });

    it('should return 0 for same day weekend', () => {
      const saturday = new Date(2024, 0, 6); // Saturday
      const count = service.countJoursOuvres(saturday, saturday, 'FR');
      expect(count).toBe(0);
    });

    it('should handle date range across months', () => {
      const start = new Date(2024, 0, 29); // Monday
      const end = new Date(2024, 1, 2); // Friday
      const count = service.countJoursOuvres(start, end, 'FR');
      expect(count).toBe(5);
    });

    it('should handle date range across years', () => {
      const start = new Date(2023, 11, 29); // Friday
      const end = new Date(2024, 0, 2); // Tuesday
      const count = service.countJoursOuvres(start, end, 'FR');
      expect(count).toBe(2); // Friday, Monday, Tuesday (weekend excluded - Saturday and Sunday)
    });
  });

  describe('getEasterDate', () => {
    it('should calculate correct Easter date for 2024', () => {
      const easter = service.getEasterDate(2024);
      expect(easter.getFullYear()).toBe(2024);
      expect(easter.getMonth()).toBe(2); // March
      expect(easter.getDate()).toBe(31); // March 31st, 2024
    });

    it('should calculate correct Easter date for 2025', () => {
      const easter = service.getEasterDate(2025);
      expect(easter.getFullYear()).toBe(2025);
      expect(easter.getMonth()).toBe(3); // April
      expect(easter.getDate()).toBe(20); // April 20th, 2025
    });

    it('should calculate correct Easter date for 2023', () => {
      const easter = service.getEasterDate(2023);
      expect(easter.getFullYear()).toBe(2023);
      expect(easter.getMonth()).toBe(3); // April
      expect(easter.getDate()).toBe(9); // April 9th, 2023
    });
  });

  describe('Specific holiday calculations', () => {
    it('should include Easter Monday for France', () => {
      const holidays = service.getJoursFeries(2024, 'FR');
      const easterMonday = holidays.find(h => h.label === 'Lundi de Pâques');
      expect(easterMonday).toBeDefined();
      expect(easterMonday!.date.getMonth()).toBe(3); // April
      expect(easterMonday!.date.getDate()).toBe(1); // April 1st, 2024
    });

    it('should include Ascension for France', () => {
      const holidays = service.getJoursFeries(2024, 'FR');
      const ascension = holidays.find(h => h.label === 'Ascension');
      expect(ascension).toBeDefined();
      expect(ascension!.date.getMonth()).toBe(4); // May
    });

    it('should include Whit Monday for France', () => {
      const holidays = service.getJoursFeries(2024, 'FR');
      const whitMonday = holidays.find(h => h.label === 'Lundi de Pentecôte');
      expect(whitMonday).toBeDefined();
      expect(whitMonday!.date.getMonth()).toBe(4); // May
    });

    it('should include Belgian specific holidays', () => {
      const holidays = service.getJoursFeries(2024, 'BE');
      const belgianNational = holidays.find(h => h.label === 'Fête Nationale belge');
      expect(belgianNational).toBeDefined();
      expect(belgianNational!.date.getMonth()).toBe(6); // July
      expect(belgianNational!.date.getDate()).toBe(21);
    });

    it('should include Canadian specific holidays', () => {
      const holidays = service.getJoursFeries(2024, 'CA');
      const canadaDay = holidays.find(h => h.label === 'Fête du Canada');
      expect(canadaDay).toBeDefined();
      expect(canadaDay!.date.getMonth()).toBe(6); // July
      expect(canadaDay!.date.getDate()).toBe(1);
    });

    it('should include Algerian specific holidays', () => {
      const holidays = service.getJoursFeries(2024, 'DZ');
      const independence = holidays.find(h => h.label === 'Fête de l\'Indépendance');
      expect(independence).toBeDefined();
      expect(independence!.date.getMonth()).toBe(6); // July
      expect(independence!.date.getDate()).toBe(5);
    });
  });
});