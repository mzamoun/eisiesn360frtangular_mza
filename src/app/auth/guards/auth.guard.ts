import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/app/service/logger.service';

import { DataSharingService } from 'src/app/service/data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private logger: LoggerService, private authService: DataSharingService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let url: string = state.url;

    this.logger.debug("AuthGuard canActivate url=", url)
    
    // Routes publiques qui n'ont pas besoin d'authentification
    if (this.authService.isPublicRoute(url)) {
      return true;
    }
    
    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {
    //////////this.logger.debug("checkLogin url", url)
    if (this.authService.isLoggedIn()) {
      this.logger.debug("checkLogin OK url = ", url)
      // return true;
      // this.router.navigate(['/home']);
      // this.router.navigate([ '/#/'+ url ]);
      return true;
    }
    //////////this.logger.debug("checkLogin KO")
    this.authService.redirectToUrl = url;
    // this.router.navigate(['/login']);
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
