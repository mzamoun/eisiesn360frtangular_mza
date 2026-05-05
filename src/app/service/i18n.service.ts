import { Injectable } from '@angular/core';

export interface PaysLangue {
  pays: string;     // code ISO 3166-1 alpha-2 (ex: "FR", "NL", "DZ")
  lang: string;     // code langue IETF (ex: "fr", "en", "ar")
}

/**
 * Service i18n - mapping pays / langue.
 * Permet de résoudre la langue à utiliser pour un utilisateur selon son pays.
 * Fallback : 'en' si le pays est inconnu.
 */
@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private readonly mapPaysLangue: PaysLangue[] = [
    // Pays francophones
    { pays: 'FR', lang: 'fr' },   // France
    { pays: 'BE', lang: 'fr' },   // Belgique
    { pays: 'CH', lang: 'fr' },   // Suisse (fr)
    { pays: 'LU', lang: 'fr' },   // Luxembourg
    { pays: 'CA', lang: 'fr' },   // Canada (fr)
    { pays: 'DZ', lang: 'ar' },   // Algérie
    { pays: 'TN', lang: 'ar' },   // Tunisie
    { pays: 'MA', lang: 'ar' },   // Maroc
    { pays: 'LY', lang: 'ar' },   // Libye
    { pays: 'MR', lang: 'ar' },   // Mauritanie
    { pays: 'SN', lang: 'fr' },   // Sénégal
    { pays: 'CI', lang: 'fr' },   // Côte d'Ivoire
    { pays: 'CM', lang: 'fr' },   // Cameroun

    // Pays anglophones
    { pays: 'GB', lang: 'en' },   // Royaume-Uni
    { pays: 'UK', lang: 'en' },   // alias courant pour GB
    { pays: 'US', lang: 'en' },   // États-Unis
    { pays: 'AU', lang: 'en' },   // Australie
    { pays: 'NZ', lang: 'en' },   // Nouvelle-Zélande
    { pays: 'IE', lang: 'en' },   // Irlande

    // Autres pays européens cibles ESN
    { pays: 'NL', lang: 'en' },   // Pays-Bas (EN de travail)
    { pays: 'DE', lang: 'en' },   // Allemagne (EN de travail)
    { pays: 'ES', lang: 'en' },   // Espagne (EN de travail)
    { pays: 'IT', lang: 'en' },   // Italie (EN de travail)
    { pays: 'PL', lang: 'en' },   // Pologne (EN de travail)
    { pays: 'PT', lang: 'en' },   // Portugal (EN de travail)
    { pays: 'SE', lang: 'en' },   // Suède (EN de travail)
    { pays: 'NO', lang: 'en' },   // Norvège (EN de travail)
    { pays: 'DK', lang: 'en' },   // Danemark (EN de travail)
  ];

  /**
   * Retourne la langue recommandée pour un pays donné.
   * @param pays code ISO 3166-1 alpha-2 (insensible à la casse)
   * @returns code langue (ex: 'fr', 'en', 'ar'), 'en' si pays inconnu
   */
  getLangueByPays(pays: string): string {
    if (!pays) return 'en';
    const found = this.mapPaysLangue.find(
      p => p.pays.toLowerCase() === pays.toLowerCase()
    );
    return found ? found.lang : 'en';
  }

  /**
   * Retourne la liste complète des mappings pays/langue.
   */
  getAllMappings(): PaysLangue[] {
    return this.mapPaysLangue;
  }

  /**
   * Retourne tous les pays configurés pour une langue donnée.
   */
  getPaysByLangue(lang: string): string[] {
    return this.mapPaysLangue
      .filter(p => p.lang === lang)
      .map(p => p.pays);
  }
}
