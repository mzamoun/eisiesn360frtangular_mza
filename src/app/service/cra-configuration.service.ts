import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CraConfiguration } from "../model/cra-configuration";
import { GenericResponse } from "../model/response/genericResponse";

@Injectable({
  providedIn: 'root'
})
export class CraConfigurationService {

  craConfigurationUrl: string;

  constructor(private http: HttpClient) {
    this.craConfigurationUrl = environment.apiUrl + "/cra-configuration"
  }

  public getCraConfigByMonth(month: string): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.craConfigurationUrl + "/" + month);
  }

  public getCraConfigByEsnIdAndMonth(esnId: number, month: string): Observable<GenericResponse> {
    console.log("getCraConfigByEsnIdAndMonth : esnId : ", esnId, " month : ", month)
    return this.http.get<GenericResponse>(this.craConfigurationUrl + "/" + esnId + "/" + month );
  }

  public updateCraConfiguration(craConfiguration: CraConfiguration): Observable<GenericResponse> {
    if (craConfiguration.id > 0) {
      return this.http.put<GenericResponse>(this.craConfigurationUrl + "/", craConfiguration);
    } else {
      return this.http.post<GenericResponse>(this.craConfigurationUrl + "/", craConfiguration);
    }
  }

}
