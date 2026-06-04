import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FichePaie } from '../model/fiche-paie';
import { GenericResponse } from '../model/response/genericResponse';

@Injectable({ providedIn: 'root' })
export class FichePaieService {
  private fichePaieUrl: string;
  private craUrl: string;

  constructor(private http: HttpClient) {
    this.fichePaieUrl = environment.apiUrl + '/fiche-paie/';
    this.craUrl = environment.apiUrl + '/cra/';
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.fichePaieUrl);
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.fichePaieUrl + id);
  }

  public findByConsultant(idConsultant: number, year?: number): Observable<GenericResponse> {
    const suffix = year != null ? ('?year=' + year) : '';
    return this.http.get<GenericResponse>(this.fichePaieUrl + 'consultant/' + idConsultant + suffix);
  }

  public save(fichePaie: FichePaie): Observable<GenericResponse> {
    if (fichePaie?.id && fichePaie.id > 0) {
      return this.http.put<GenericResponse>(this.fichePaieUrl, fichePaie);
    }
    return this.http.post<GenericResponse>(this.fichePaieUrl, fichePaie);
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.fichePaieUrl + id);
  }

  public simulateFranceCadreSyntec(fichePaie: FichePaie): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.fichePaieUrl + 'simulate/france/cadre-syntec', fichePaie);
  }

  public generateFromCra(idCra: number, payload?: FichePaie): Observable<Blob> {
    return this.http.post(this.craUrl + 'generate-fiche-paie-from-cra/' + idCra, payload || null, {
      responseType: 'blob'
    });
  }
}
