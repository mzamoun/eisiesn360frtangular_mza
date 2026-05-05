import { Injectable } from '@angular/core';

export interface JourFerie {
  date: Date;
  label: string;
  pays: string;
}

/**
 * Service de calcul local des jours fériés par pays.
 * Permet un calcul offline des jours fériés pour les pays ESN cibles.
 * Pays supportés : FR, NL, GB (UK), DE, CA, BE, DZ, TN, MA
 */
@Injectable({
  providedIn: 'root'
})
export class JoursFeriesService {

  /**
   * Retourne les jours fériés pour une année et un pays donnés.
   * @param year Année (ex: 2025)
   * @param pays Code ISO 3166-1 alpha-2 (ex: 'FR', 'NL')
   */
  getJoursFeries(year: number, pays: string): JourFerie[] {
    const code = (pays || 'FR').toUpperCase();
    switch (code) {
      case 'FR':
      case 'BE':
        return this.getJoursFeriesFR(year, code);
      case 'NL':
        return this.getJoursFeriesNL(year);
      case 'GB':
      case 'UK':
        return this.getJoursFeriesGB(year);
      case 'DE':
        return this.getJoursFeriesDE(year);
      case 'CA':
        return this.getJoursFeriesCA(year);
      case 'DZ':
        return this.getJoursFeriesDZ(year);
      case 'TN':
        return this.getJoursFeriesTN(year);
      case 'MA':
        return this.getJoursFeriesMA(year);
      default:
        return this.getJoursFeriesFR(year, 'FR');
    }
  }

  /**
   * Retourne vrai si la date est un jour férié pour le pays.
   */
  isJourFerie(date: Date, pays: string): boolean {
    const feries = this.getJoursFeries(date.getFullYear(), pays);
    return feries.some(f =>
      f.date.getDate() === date.getDate() &&
      f.date.getMonth() === date.getMonth() &&
      f.date.getFullYear() === date.getFullYear()
    );
  }

  /**
   * Compte les jours ouvrés (hors week-ends et jours fériés) entre deux dates.
   */
  countJoursOuvres(from: Date, to: Date, pays: string): number {
    const feries = this.getJoursFeries(from.getFullYear(), pays)
      .concat(this.getJoursFeries(to.getFullYear(), pays));
    let count = 0;
    const current = new Date(from);
    while (current <= to) {
      const day = current.getDay();
      if (day !== 0 && day !== 6 && !this.isJourFerie(current, pays)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  // ─── France (et Belgique pour les communs) ─────────────────────────────────

  private getJoursFeriesFR(year: number, pays: string): JourFerie[] {
    const easter = this.getEasterDate(year);
    const jours: JourFerie[] = [
      { date: new Date(year, 0, 1),  label: "Jour de l'An",         pays },
      { date: this.addDays(easter, 1),  label: "Lundi de Pâques",   pays },
      { date: new Date(year, 4, 1),  label: "Fête du Travail",       pays },
      { date: new Date(year, 4, 8),  label: "Victoire 1945",         pays },
      { date: this.addDays(easter, 39), label: "Ascension",          pays },
      { date: this.addDays(easter, 50), label: "Lundi de Pentecôte", pays },
      { date: new Date(year, 6, 14), label: "Fête Nationale",        pays },
      { date: new Date(year, 7, 15), label: "Assomption",            pays },
      { date: new Date(year, 10, 1), label: "Toussaint",             pays },
      { date: new Date(year, 10, 11),label: "Armistice",             pays },
      { date: new Date(year, 11, 25),label: "Noël",                  pays },
    ];
    if (pays === 'BE') {
      jours.push({ date: new Date(year, 6, 21), label: "Fête Nationale belge", pays });
      jours.push({ date: new Date(year, 11, 26), label: "Deuxième jour de Noël", pays });
    }
    return jours;
  }

  // ─── Pays-Bas ──────────────────────────────────────────────────────────────

  private getJoursFeriesNL(year: number): JourFerie[] {
    const easter = this.getEasterDate(year);
    return [
      { date: new Date(year, 0, 1),  label: "Nieuwjaarsdag",           pays: 'NL' },
      { date: this.addDays(easter, -2), label: "Goede Vrijdag",        pays: 'NL' },
      { date: easter,                label: "Eerste Paasdag",           pays: 'NL' },
      { date: this.addDays(easter, 1),  label: "Tweede Paasdag",       pays: 'NL' },
      { date: new Date(year, 3, 27), label: "Koningsdag",              pays: 'NL' },
      { date: new Date(year, 4, 5),  label: "Bevrijdingsdag",          pays: 'NL' },
      { date: this.addDays(easter, 39), label: "Hemelvaartsdag",       pays: 'NL' },
      { date: this.addDays(easter, 49), label: "Eerste Pinksterdag",   pays: 'NL' },
      { date: this.addDays(easter, 50), label: "Tweede Pinksterdag",   pays: 'NL' },
      { date: new Date(year, 11, 25), label: "Eerste Kerstdag",        pays: 'NL' },
      { date: new Date(year, 11, 26), label: "Tweede Kerstdag",        pays: 'NL' },
    ];
  }

  // ─── Royaume-Uni ───────────────────────────────────────────────────────────

  private getJoursFeriesGB(year: number): JourFerie[] {
    const easter = this.getEasterDate(year);
    return [
      { date: new Date(year, 0, 1),     label: "New Year's Day",       pays: 'GB' },
      { date: this.addDays(easter, -2), label: "Good Friday",          pays: 'GB' },
      { date: this.addDays(easter, 1),  label: "Easter Monday",        pays: 'GB' },
      { date: this.getFirstMonday(year, 4), label: "Early May Bank Holiday", pays: 'GB' },
      { date: this.getLastMonday(year, 4),  label: "Spring Bank Holiday",    pays: 'GB' },
      { date: this.getLastMonday(year, 7),  label: "Summer Bank Holiday",    pays: 'GB' },
      { date: new Date(year, 11, 25),   label: "Christmas Day",        pays: 'GB' },
      { date: new Date(year, 11, 26),   label: "Boxing Day",           pays: 'GB' },
    ];
  }

  // ─── Allemagne (jours fériés fédéraux uniquement) ──────────────────────────

  private getJoursFeriesDE(year: number): JourFerie[] {
    const easter = this.getEasterDate(year);
    return [
      { date: new Date(year, 0, 1),     label: "Neujahrstag",          pays: 'DE' },
      { date: this.addDays(easter, -2), label: "Karfreitag",           pays: 'DE' },
      { date: this.addDays(easter, 1),  label: "Ostermontag",          pays: 'DE' },
      { date: new Date(year, 4, 1),     label: "Tag der Arbeit",       pays: 'DE' },
      { date: this.addDays(easter, 39), label: "Christi Himmelfahrt",  pays: 'DE' },
      { date: this.addDays(easter, 50), label: "Pfingstmontag",        pays: 'DE' },
      { date: new Date(year, 9, 3),     label: "Tag der Deutschen Einheit", pays: 'DE' },
      { date: new Date(year, 11, 25),   label: "1. Weihnachtstag",     pays: 'DE' },
      { date: new Date(year, 11, 26),   label: "2. Weihnachtstag",     pays: 'DE' },
    ];
  }

  // ─── Canada (fédéral + Québec) ─────────────────────────────────────────────

  private getJoursFeriesCA(year: number): JourFerie[] {
    const easter = this.getEasterDate(year);
    return [
      { date: new Date(year, 0, 1),     label: "Jour de l'An",         pays: 'CA' },
      { date: this.addDays(easter, -2), label: "Vendredi saint",       pays: 'CA' },
      { date: this.addDays(easter, 1),  label: "Lundi de Pâques",      pays: 'CA' },
      { date: this.getFirstMonday(year, 4), label: "Fête des Patriotes (QC)", pays: 'CA' },
      { date: new Date(year, 5, 24),    label: "Saint-Jean-Baptiste (QC)", pays: 'CA' },
      { date: new Date(year, 6, 1),     label: "Fête du Canada",       pays: 'CA' },
      { date: this.getFirstMonday(year, 8), label: "Fête du Travail",  pays: 'CA' },
      { date: new Date(year, 9, 11),    label: "Thanksgiving",         pays: 'CA' },
      { date: new Date(year, 10, 11),   label: "Jour du Souvenir",     pays: 'CA' },
      { date: new Date(year, 11, 25),   label: "Noël",                 pays: 'CA' },
      { date: new Date(year, 11, 26),   label: "Lendemain de Noël",    pays: 'CA' },
    ];
  }

  // ─── Algérie ───────────────────────────────────────────────────────────────

  private getJoursFeriesDZ(year: number): JourFerie[] {
    return [
      { date: new Date(year, 0, 1),  label: "Nouvel An",              pays: 'DZ' },
      { date: new Date(year, 0, 12), label: "Yennayer (Nouvel An berbère)", pays: 'DZ' },
      { date: new Date(year, 4, 1),  label: "Fête du Travail",        pays: 'DZ' },
      { date: new Date(year, 5, 19), label: "Révolution du 19 juin",  pays: 'DZ' },
      { date: new Date(year, 6, 5),  label: "Fête de l'Indépendance", pays: 'DZ' },
      { date: new Date(year, 10, 1), label: "Révolution du 1er novembre", pays: 'DZ' },
    ];
  }

  // ─── Tunisie ───────────────────────────────────────────────────────────────

  private getJoursFeriesTN(year: number): JourFerie[] {
    return [
      { date: new Date(year, 0, 1),  label: "Nouvel An",              pays: 'TN' },
      { date: new Date(year, 2, 20), label: "Fête de l'Indépendance", pays: 'TN' },
      { date: new Date(year, 3, 9),  label: "Fête des Martyrs",       pays: 'TN' },
      { date: new Date(year, 4, 1),  label: "Fête du Travail",        pays: 'TN' },
      { date: new Date(year, 5, 1),  label: "Fête de la Victoire",    pays: 'TN' },
      { date: new Date(year, 6, 25), label: "Fête de la République",  pays: 'TN' },
      { date: new Date(year, 7, 13), label: "Fête de la Femme",       pays: 'TN' },
    ];
  }

  // ─── Maroc ─────────────────────────────────────────────────────────────────

  private getJoursFeriesMA(year: number): JourFerie[] {
    return [
      { date: new Date(year, 0, 1),  label: "Nouvel An",              pays: 'MA' },
      { date: new Date(year, 0, 11), label: "Manifeste de l'Indépendance", pays: 'MA' },
      { date: new Date(year, 4, 1),  label: "Fête du Travail",        pays: 'MA' },
      { date: new Date(year, 6, 30), label: "Fête du Trône",          pays: 'MA' },
      { date: new Date(year, 7, 14), label: "Allégeance Oued Ed-Dahab", pays: 'MA' },
      { date: new Date(year, 7, 20), label: "Révolution du Roi",      pays: 'MA' },
      { date: new Date(year, 7, 21), label: "Fête de la Jeunesse",    pays: 'MA' },
      { date: new Date(year, 9, 6),  label: "Marche Verte",           pays: 'MA' },
      { date: new Date(year, 10, 18), label: "Fête de l'Indépendance", pays: 'MA' },
    ];
  }

  // ─── Utilitaires ───────────────────────────────────────────────────────────

  /**
   * Calcul de la date de Pâques (algorithme de Meeus/Jones/Butcher).
   */
  getEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month, day);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private getFirstMonday(year: number, month: number): Date {
    const d = new Date(year, month, 1);
    const day = d.getDay();
    const diff = day === 1 ? 0 : (8 - day) % 7;
    return new Date(year, month, 1 + diff);
  }

  private getLastMonday(year: number, month: number): Date {
    const lastDay = new Date(year, month + 1, 0);
    const day = lastDay.getDay();
    const diff = day === 1 ? 0 : (day === 0 ? 6 : day - 1);
    return new Date(year, month + 1, 0 - diff);
  }
}
