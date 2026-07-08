import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/service/logger.service';

import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';
import { Credentials } from '../credentials';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'response'
};
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private logger: LoggerService, private http: HttpClient) {
  }

  public getResponseHeaders(credentials: Credentials): Observable<HttpResponse<any>> {
    const loginUrl = API_URL + '/login';
    const payload = {
      username: credentials.username,
      login: credentials.username,
      password: credentials.password
    };
    return this.http.post<HttpResponse<any>>(loginUrl, payload, httpOptions);
  }

  public logout() {
    let logoutUrl = API_URL + '/logout';
    return this.http.get(logoutUrl, {responseType: 'text'});
  }
}
