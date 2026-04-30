import { Injectable } from '@angular/core';

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

  constructor(private router: Router, private utils: UtilsService
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

    if (err.status === 401 || errorStatus === 401) {
      const msgTitle = "Erreur 401 : Vérifiez vos données!";
      const msgBody  = "Identifiants incorrects : " + backendMsg;
      this.dataSharingService.addError(new MyError(msgTitle, msgBody));
      this.dataSharingService.redirectToUrl = this.router.url;
      this.utils.showNotification("error", backendMsg);
      this.dataSharingService.logout();
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
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
