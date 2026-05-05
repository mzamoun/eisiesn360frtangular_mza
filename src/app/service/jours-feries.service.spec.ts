import { TestBed } from '@angular/core/testing';
import { JoursFeriesService } from './jours-feries.service';

describe('JoursFeriesService', () => {
  let service: JoursFeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoursFeriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── Algorithme de Pâques ─────────────────────────────────────────────────

  it('should calculate Easter 2025 as April 20', () => {
    const easter = service.getEasterDate(2025);
    expect(easter.getMonth()).toBe(3);  // April (0-indexed)
    expect(easter.getDate()).toBe(20);
  });

  it('should calculate Easter 2024 as March 31', () => {
    const easter = service.getEasterDate(2024);
    expect(easter.getMonth()).toBe(2);  // March
    expect(easter.getDate()).toBe(31);
  });

  // ─── France ───────────────────────────────────────────────────────────────

  it('should return 11 jours fériés for France 2025', () => {
    const feries = service.getJoursFeries(2025, 'FR');
    expect(feries.length).toBe(11);
  });

  it('should include 1er janvier for France', () => {
    const feries = service.getJoursFeries(2025, 'FR');
    const jour = feries.find(f => f.date.getMonth() === 0 && f.date.getDate() === 1);
    expect(jour).toBeTruthy();
    expect(jour.label).toContain("An");
  });

  it('should include 14 juillet (Fête Nationale) for France', () => {
    const feries = service.getJoursFeries(2025, 'FR');
    const jour = feries.find(f => f.date.getMonth() === 6 && f.date.getDate() === 14);
    expect(jour).toBeTruthy();
  });

  // ─── isJourFerie ──────────────────────────────────────────────────────────

  it('should identify 1er mai 2025 as jour ferie for FR', () => {
    expect(service.isJourFerie(new Date(2025, 4, 1), 'FR')).toBeTrue();
  });

  it('should identify 2 mai 2025 as NOT jour ferie for FR', () => {
    expect(service.isJourFerie(new Date(2025, 4, 2), 'FR')).toBeFalse();
  });

  // ─── Pays-Bas ─────────────────────────────────────────────────────────────

  it('should return jours feries for NL', () => {
    const feries = service.getJoursFeries(2025, 'NL');
    expect(feries.length).toBeGreaterThan(5);
  });

  // ─── Allemagne ────────────────────────────────────────────────────────────

  it('should include 3 October as Tag der Deutschen Einheit for DE', () => {
    const feries = service.getJoursFeries(2025, 'DE');
    const jour = feries.find(f => f.date.getMonth() === 9 && f.date.getDate() === 3);
    expect(jour).toBeTruthy();
  });

  // ─── Royaume-Uni ─────────────────────────────────────────────────────────

  it('should return jours feries for GB', () => {
    const feries = service.getJoursFeries(2025, 'GB');
    expect(feries.length).toBeGreaterThan(5);
  });

  // ─── UK alias ────────────────────────────────────────────────────────────

  it('should accept UK as alias for GB', () => {
    const feriesGB = service.getJoursFeries(2025, 'GB');
    const feriesUK = service.getJoursFeries(2025, 'UK');
    expect(feriesGB.length).toBe(feriesUK.length);
  });

  // ─── Fallback ─────────────────────────────────────────────────────────────

  it('should fallback to FR for unknown country', () => {
    const feriesFR = service.getJoursFeries(2025, 'FR');
    const feriesXX = service.getJoursFeries(2025, 'XX');
    expect(feriesXX.length).toBe(feriesFR.length);
  });

  // ─── countJoursOuvres ────────────────────────────────────────────────────

  it('should count correct working days for a full week without holiday', () => {
    // Week of 3-7 March 2025 (no holiday in FR)
    const count = service.countJoursOuvres(new Date(2025, 2, 3), new Date(2025, 2, 7), 'FR');
    expect(count).toBe(5);
  });

  it('should exclude 1er mai from working days in FR', () => {
    // 28 April - 2 May 2025: 1 May is holiday → 4 working days
    const count = service.countJoursOuvres(new Date(2025, 3, 28), new Date(2025, 4, 2), 'FR');
    expect(count).toBe(4);
  });
});
