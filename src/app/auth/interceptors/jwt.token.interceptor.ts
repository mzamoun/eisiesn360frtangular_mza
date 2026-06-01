import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/service/logger.service';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { catchError } from "rxjs/operators";
import { MyError } from 'src/app/resource/MyError';

import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { UtilsService } from "../../service/utils.service";

@Injectable({ providedIn: 'root' })
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(private logger: LoggerService, private router: Router, private utils: UtilsService
    , private utilsIhmService: UtilsIhmService
    , private dataSharingService: DataSharingService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //////////console.log("intercept", request, next)
    let interceptedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.dataSharingService.getToken()}`
      }
    });

    return next.handle(interceptedRequest).pipe(catchError(x => this.handleErrors(x)));
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  // {
  //   if(this.auth.isLoggedIn())
  //   {
  //     request = request.clone({ headers: request.headers.set( 'Authorization', 'Bearer '+this.auth.getToken())});
  //   }
  //   else
  //   {
  //     this.router.navigate(['/login']);
  //   }
  //   return next.handle(request).pipe(catchError(x => this.handleErrors(x)));
  // }

  private handleErrors(err: HttpErrorResponse): Observable<any> {
    // Extraction sécurisée : err.error peut être null, une string ou un objet selon le backend/proxy
    const errorPayload = err.error && typeof err.error === 'object' ? err.error : null;
    const errorStatus  = errorPayload?.status ?? null;
    const backendMsg   = errorPayload?.message ?? err.message ?? 'Erreur inconnue';
    const requestUrl = (err.url || '').toLowerCase();
    const isAuthRequest = requestUrl.includes('/login')
      || requestUrl.includes('/auth/')
      || requestUrl.includes('/token');
    const hasToken = !!this.dataSharingService.getToken();

    if (err.status === 401 || errorStatus === 401) {
      this.logger.error('JWT 401 intercepted', {
        url: err.url,
        routerUrl: this.router.url,
        isAuthRequest,
        hasToken
      });
      const msgTitle = 'Erreur 401 : Non autorise';
      const msgBody  = backendMsg;
      this.dataSharingService.addError(new MyError(msgTitle, msgBody));
      this.dataSharingService.redirectToUrl = this.router.url;
      this.utils.showNotification("error", backendMsg);

      // Deconnecter seulement sur echec d'authentification explicite
      // (login/token) ou absence de token local.
      if (isAuthRequest || !hasToken) {
        this.dataSharingService.logout();
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
      return of(null);
    }

    // Erreurs réseau (status 0) ou serveur (4xx/5xx hors 401) :
    // ne pas rediriger vers /login pour éviter de recréer le dashboard et rejouer toutes les requêtes.
    const title = err.status ? `Erreur ${err.status} : ${err.name}` : 'Erreur réseau';
    this.dataSharingService.addError(new MyError(title, backendMsg));
    return of(null);
  }
}
