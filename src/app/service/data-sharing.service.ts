import { LoggerService } from './logger.service';


import { Injectable, Injector } from '@angular/core';

import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from "rxjs";
import { Credentials } from '../auth/credentials';
import { TokenService } from '../auth/services/token.service';
import { CraStateService, ServiceLocator } from "../core/core";
import { CraContext } from "../core/model/cra-context";
import { HeaderComponent } from '../layout/header/header.component';
import { Activity } from '../model/activity';
import { ActivityType } from '../model/activityType';
import { Consultant } from "../model/consultant";
import { Cra } from '../model/cra';
import { CraDayActivity } from '../model/cra-day-activity';
import { NoteFrais } from '../model/noteFrais';
import { Project } from '../model/project';
import { MyError } from '../resource/MyError';
import { ActivityService } from './activity.service';
import { ConsultantService } from './consultant.service';
import { UtilsService } from "./utils.service";

import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Esn } from '../model/esn';
import { Mail } from '../model/Mail';
import { Notification } from "../model/notification";
import { GenericResponse } from "../model/response/genericResponse";
import { ClientService } from './client.service';
// CraService importé en lazy via Injector pour éviter la dépendance circulaire
import { CraService } from './cra.service';
import { EsnService } from './esn.service';

import { MsgService } from './msg.service';
import { NotificationFacade } from './notification.facade';
import { UiFeedbackFacade } from './ui-feedback.facade';
import { UtilsIhmService } from './utilsIhm.service';


/**
 * Copyright (C) 2020-@year@ by Eisi Cnsulting.
 * All rights reserved.
 *
 * Eisi Headquarters:
 * 6 RUE DES DEUX COMMUNES
 * 91480 QUINCY SOUS SENART

 * Created at 18/04/2020 19:15
 * @author Saber Ben Khalifa <saber.khalifa@eisi-consulting.fr>
 **/

@Injectable({
  providedIn: 'root'
})
export class DataSharingService implements CraStateService, ServiceLocator {

  // Routes publiques — correspondance exacte (ex: /login)
  private readonly EXACT_PUBLIC_ROUTES: string[] = [
    '/login',
    '/inscription',
  ];

  // Routes publiques — correspondance par préfixe (token/code en suffixe, ex: /validateEmail/abc123)
  private readonly PREFIX_PUBLIC_ROUTES: string[] = [
    '/validateEmail',
    '/resetPassword',
  ];

  headerComponent: HeaderComponent;

  craContext: BehaviorSubject<CraContext> = new BehaviorSubject<CraContext>(null);
  public serviceRegistry: Map<string, any> = new Map<string, any>();
  public userSelectedActivity: Consultant;

  private esnCurrentReadySource = new BehaviorSubject<Esn>(null);
  private idEsnCurrentSource = new BehaviorSubject<number>(null);
  private currentCraSource = new BehaviorSubject<Cra>(null);
  private listCraSource = new BehaviorSubject<Cra[]>([]);
  private userConnectedSource = new BehaviorSubject<Consultant>(null);

  // -- Délégation aux facades (refactor progressif) --
  get infos$() { return this.uiFeedback.infos$; }
  get errors$() { return this.uiFeedback.errors$; }
  get listNotifications$() { return this.notificationFacade.listNotifications$; }
  esnCurrentReady$ = this.esnCurrentReadySource.asObservable();
  idEsnCurrent$ = this.idEsnCurrentSource.asObservable();
  currentCra$ = this.currentCraSource.asObservable();
  listCra$ = this.listCraSource.asObservable();
  userConnected$ = this.userConnectedSource.asObservable();

  isAdd: string;
  typeCra: string;
  currentFee: NoteFrais;
  fromNotif: boolean;
  isDisableSearchStrInput: boolean = false;
  activityTypes: ActivityType[];
  projects: Project[];
  missionActivityWarningShown: boolean = false;
  clientWarningShown: boolean = false;
  projectWarningShown: boolean = false;
  managerWarningShown: boolean = false;
  consultantWarningShown: boolean = false;

  redirectToUrl: string = '';
  authorization: string;
  userConnected: Consultant;
  isUserLoggedInFct: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  esnCurrent: Esn;
  private _idEsnCurrent: number = null;
  IsAddEsnAndResp: boolean = false;
  esnSaved: Esn;
  respEsnSaved: Consultant;
  passRespEsnSaved: string;
  consultantSelected: Consultant;
  private isHydratingStoredUserEsn = false;

  get idEsnCurrent(): number {
    return this._idEsnCurrent;
  }

  set idEsnCurrent(value: number) {
    this._idEsnCurrent = value;
    this.idEsnCurrentSource.next(value);
  }

  private syncEsnFromUser(user: Consultant): void {
    const esn = user?.esn || null;
    this.esnCurrent = esn;
    this.idEsnCurrent = esn?.id || null;
    this.emitEsnCurrentIfChanged(esn);
  }

  private emitEsnCurrentIfChanged(esn: Esn): void {
    const currentEsn = this.esnCurrentReadySource.value;
    const currentId = currentEsn?.id || null;
    const nextId = esn?.id || null;
    if (currentId === nextId) {
      return;
    }
    this.esnCurrentReadySource.next(esn);
  }

  private get craService(): CraService {
    return this.injector.get(CraService);
  }

  constructor(
    public router: Router
    , private injector: Injector
    , private utils: UtilsService
    , private utilsIhmService: UtilsIhmService
    , private consultantService: ConsultantService
    , private activityService: ActivityService
    , private esnService: EsnService
    , private clientService: ClientService
    , private tokenService: TokenService
    , private http: HttpClient
    , public logger: LoggerService
    , private msgService: MsgService
    , public uiFeedback: UiFeedbackFacade
    , public notificationFacade: NotificationFacade
  ) {
    this.logger.debug("data-sharing constructor deb")
    // Hook : DataSharingService enrichit les CRA dans les notifications après chaque fetch
    this.notificationFacade.postLoadHook = () => this.majListNotifications();
    this.getCurrentUserFromLocaleStorage()

    // Push initial userConnected value to observers
    if (this.userConnected) {
      this.userConnectedSource.next(this.userConnected);
      this.isUserLoggedInFct.next(true);
    }

  }

  navigateTo(url) {
    this.router.navigate([url]);
  }

  gotoLogin() {
    this.logger.debug("navigate to login ")
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }

  }

  public isPublicRoute(url: string): boolean {
    const path = this.normalizePath(url);
    // Correspondance exacte (/login, /inscription)
    if (this.EXACT_PUBLIC_ROUTES.includes(path)) {
      return true;
    }
    // Correspondance préfixe uniquement pour les routes tokenisées (/validateEmail/xxx, /resetPassword/xxx)
    return this.PREFIX_PUBLIC_ROUTES.some(prefix => path.startsWith(prefix + '/'));
  }

  private normalizePath(url: string): string {
    if (!url) return '/';

    // Supporte "/login?x=1" ou URL absolue
    try {
      const parsed = new URL(url, window.location.origin);
      return this.cleanPath(parsed.pathname);
    } catch {
      // Fallback si ce n'est pas une URL standard
      const pathOnly = url.split('?')[0].split('#')[0];
      return this.cleanPath(pathOnly);
    }
  }

  private cleanPath(path: string): string {
    let p = (path || '/').trim();

    if (!p.startsWith('/')) p = '/' + p;
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

    return p;
  }

  gotoMyProfile() {
    this.logger.debug("navigate to myProfile ")
    this.router.navigate(['/my-profile'])
  }

  gotoMyHome() {
    this.logger.debug("navigate to home ")
    this.navigateToHomeWhenReady();
  }

  private navigateToHomeWhenReady(): void {
    const user = this.userConnected;
    if (!user || user.role === 'ADMIN' || user.esn || !user.esnId) {
      this.router.navigate(['/home']);
      return;
    }

    this.majEsnOnConsultant(
      () => {
        if (this.userConnected) {
          this.syncEsnFromUser(this.userConnected);
          this.saveTokenUser(this.userConnected);
        }
        this.router.navigate(['/home']);
      },
      () => {
        this.router.navigate(['/home']);
      }
    );
  }

  getCurrentUserFromLocaleStorage(): Consultant {
    let value = localStorage.getItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED);
    if (value != null && value != undefined) {
      if (value == 'true') {
        this.isUserLoggedInFct.next(true);
      } else {
        this.isUserLoggedInFct.next(false);
      }
    } else {
      this.isUserLoggedInFct.next(false);
    }
    let userStr = localStorage.getItem(UtilsService.TOKEN_STORAGE_USER);
    if (userStr) {
      this.setUserConnected(JSON.parse(userStr))
    }

    return this.userConnected
  }

  private hydrateStoredUserEsnIfNeeded(): void {
    const user = this.userConnected;
    if (!user || user.role === 'ADMIN' || user.esn || !user.esnId || this.isHydratingStoredUserEsn) {
      return;
    }

    this.isHydratingStoredUserEsn = true;
    this.esnService.majEsnOnConsultant(
      user,
      () => {
        this.isHydratingStoredUserEsn = false;
        this.userConnected = user;
        this.syncEsnFromUser(user);
        this.userConnectedSource.next(user);
        this.isUserLoggedInFct.next(true);
        this.saveTokenUser(user);
      },
      () => {
        this.isHydratingStoredUserEsn = false;
      }
    );
  }

  addInfo(info: string) {
    this.uiFeedback.addInfo(info);
  }

  delInfo(info: string) {
    this.uiFeedback.delInfo(info);
  }


  addErrorTxt(errorTxt: string) {
    this.uiFeedback.addErrorTxt(errorTxt);
  }

  addError(error: MyError) {
    this.uiFeedback.addError(error);
  }

  delError(error: MyError) {
    this.uiFeedback.delError(error);
  }


  /** Efface toutes les infos */
  clearInfos() {
    this.uiFeedback.clearInfos();
  }

  /** Efface toutes les erreurs */
  clearErrors() {
    this.uiFeedback.clearErrors();
  }

  clearInfosErrors() {
    this.uiFeedback.clearInfosErrors();
  }

  /***
   * this method used when you need to share current cra in other component
   * @param craContext
   */
  onCraInit(craContext: CraContext): void {
    this.craContext.next(craContext);
  }

  /***
   *This method used to get the current cra context
   */
  getCurrentCraContext(): Observable<CraContext> {
    return of<CraContext>(this.craContext.getValue());
  }

  /***
   * This method used to destroy the current cra context
   */
  onCraDestroy(): void {
    this.craContext.next(null)
  }

  /***
   * Get the current CRA value
   */
  getCurrentCra(): Cra {
    return this.currentCraSource.value;
  }

  /***
   * Notify subscribers when CRA is updated
   */
  notifyCraUpdated(cra: Cra): void {
    this.currentCraSource.next(cra);
  }

  /***
   * Get the current list of CRA
   */
  getListCra(): Cra[] {
    return this.listCraSource.value;
  }

  /***
   * Set and notify subscribers of new CRA list
   */
  setListCra(list: Cra[]): void {
    this.listCraSource.next(list);
  }

  showCra(cra: Cra) {
    let label = "navigate to cra_form with cra id=" + cra.id
    this.logger.debug(label + " START - cra: ", cra)
    if (!cra) {
      this.logger.debug(label + " ERROR - cra NULL !", cra)
      return
    }

    this.currentCraSource.next(cra);
    this.isAdd = "";
    this.typeCra = cra.type;

    this.logger.debug(label + " avant navigate to cra_form", cra)
    this.addInfo(label)
    this.router.navigate(["/cra_form"]).then(
      success => {
        this.delInfo(label)
        this.logger.debug(label + " navigate to cra_form success", cra)
      },
      error => {
        this.delInfo(label)
        this.logger.debug(label + " ERROR - navigate to cra_form", cra, error)
      }
    );

    this.logger.debug(label + " END - navigate to cra_form", cra)
  }

  showFee(fee: NoteFrais) {
    this.currentFee = fee;
    this.isAdd = "";
    this.router.navigate(["/notefrais_form"]).then(
      success => {
        this.logger.debug("navigate to notefrais_form success", fee)
      },
      error => {
        this.logger.debug("ERROR - navigate to notefrais_form", fee, error)
      }
    );
  }

  /**
   * @param cra 
   * @param tms : 500 
   * @param isReturnIfSameCra : false
   * @returns 
   */
  showCraViaLoading(cra: Cra, tms = 500, isReturnIfSameCra = false) {

    if (isReturnIfSameCra) {
      let lastCra: Cra = this.currentCraSource.value;
      if (lastCra && lastCra.id == cra.id) {
        return;
      }
    }

    //pour bien rafraichir la page.
    this.showLoading();

    setTimeout(() => {
      this.showCra(cra);
    }, tms);
  }

  /**
 * 
 * @param fee 
 * @param tms : 500 
 * @param isReturnIfSameCra : false
 * @returns 
 */
  showFeeViaLoading(fee: NoteFrais, tms = 500, isReturnIfSameFee = false) {

    if (isReturnIfSameFee) {
      let lastFee: NoteFrais = this.currentFee;
      if (lastFee && lastFee.id == fee.id) {
        return;
      }
    }

    //pour bien rafraichir la page.
    this.showLoading();

    setTimeout(() => {
      this.showFee(fee);
    }, tms);
  }


  /***
   * This method used to add service in the registry
   * @param service
   */
  addService<T>(service: T): void {
    this.serviceRegistry.set(service.constructor.name, service);
  }

  /***
   * Invoked to get service form the registry
   * @param service
   */
  getService<T>(service: string): T {
    return this.serviceRegistry.get(service);
  }

  public setHeaderComponent(h: HeaderComponent) {
    this.headerComponent = h;
  }
  public notifyHeaderComponent() {
    if (this.headerComponent) this.headerComponent.getNotifications();
  }

  showNotificationsAll() {
    this.clearInfos();
    this.router.navigate(['/notification']);
  }

  showLoading() {
    this.clearInfos();
    this.router.navigate(['/loading']);
  }

  public adminConsultant = {}
  public majAdminConsultantFct(consultant: Consultant, manager: Consultant): void {
    this.majAdminConsultantId(consultant, manager)
  }

  public majAdminConsultantId(consultant: Consultant, manager: Consultant): void {
    if (consultant == null) {
      return
    }

    this.adminConsultant[consultant.id] = manager;
    consultant.adminConsultant = manager;
    consultant.adminConsultantId = manager?.id;
  }

  isCurrenUserRespOrAdmin() {
    let currentUser = this.userConnected
    return currentUser?.role == "RESPONSIBLE_ESN" || currentUser?.role == "ADMIN"
  }

  isCurrentUserAdmin() {
    let currentUser = this.userConnected
    return currentUser?.role == "ADMIN"
  }

  getLastUserName() {
    return this.getValueOfKey(UtilsService.TOKEN_STORAGE_KEY_LAST_USERNAME);
  }

  /**
   * 
   * @param credentials 
   * @param caller : objet appelant 
   */
  login(credentials: Credentials, caller: any = null): void {
    let label = "Tentative de connexion en cours..."
    this.addInfo(label)
    this.tokenService.getResponseHeaders(credentials)
      .subscribe(res => {
        this.delInfo(label)
        // this.logger.debug("++++++++++++++++login:", credentials, res);
        if (caller) {
          caller.info = "Info : res=" + JSON.stringify(res)
        }

        if (res.status == 200) {
          this.authorization = res.headers.get('authorization');
          // //////////this.logger.debug("login: authorization: ", this.authorization);
          this.saveToken(this.authorization);
          this.isUserLoggedInFct.next(true);

          this.setKey(UtilsService.TOKEN_STORAGE_KEY_LAST_USERNAME, credentials.username)
          this.saveLastLoginHistory(credentials.username)

          this.getConsultantConnectedAndHisInfos(credentials.username, caller);

        } else {
          if (caller) {
            caller.error = "ERROR : res=" + JSON.stringify(res)
          }
        }
      }, error => {
        this.delInfo(label)
        if (caller) {
          caller.error = "ERROR : error=" + JSON.stringify(error)
          //////this.logger.debug("error:", credentials, error);
        }
      }
      );
  }

  saveLastLoginHistory(username: string): void {
    const key = UtilsService.TOKEN_STORAGE_KEY_LAST_LOGINS;
    const now = new Date().toISOString();
    let logins: { username: string; date: string }[] = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) logins = JSON.parse(raw);
    } catch (_) { logins = []; }
    // Insert new entry at top, keep max 5 unique entries
    logins = [{ username, date: now }, ...logins.filter(l => l.username !== username)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(logins));
  }

  public logout(): void {
    this.logger.debug("DataSharingService logout() called");
    localStorage.removeItem(UtilsService.TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(UtilsService.TOKEN_STORAGE_KEY);
    localStorage.removeItem(UtilsService.TOKEN_STORAGE_USER);
    localStorage.removeItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED);
    localStorage.removeItem(UtilsService.DEFAULT_LOCALE);
    this.isUserLoggedInFct.next(false);
    this.setUserConnected(null)
    this.router.navigate(["/login"]);
    this.logger.debug("DataSharingService logout() finished");
  }

  findConsultantByUsername(username: string, fctOk: Function, fctKo: Function) {
    let user: Consultant = null;
    this.logger.debug("data-sharing : findConsultantByUsername username:", username)
    this.consultantService.findConsultantByUsername(username).subscribe(
      data => {
        if (data && data.body) {
          user = data.body.result;
          if (fctOk) fctOk(data, user);
        }
      }, error => {
        if (fctKo) fctKo(error);
      }
    );
  }

  majEsnOnConsultant(fctSuccess: Function = null, fctErr: Function) {
    this.esnService.majEsnOnConsultant(this.userConnected, fctSuccess, fctErr)
  }

  /**
   * 
   * @param username 
   * @param caller : object appelant 
   */
  getConsultantConnectedAndHisInfos(username: string, caller: any) {

    this.logger.debug("getConsultantConnectedAndHisInfos username:", username)

    this.consultantService.getConsultantAndHisInfos(username).subscribe(
      data => {
        if (data) {
          this.setUserConnected(data.body.result)

          this.majEsnOnConsultant(() => {
            if (this.userConnected) {
              this.syncEsnFromUser(this.userConnected);
              this.saveTokenUser(this.userConnected);
            }
            this.navigateToHomeWhenReady();
          }, (error) => {
            this.addErrorTxt(JSON.stringify(error))
            this.navigateToHomeWhenReady();
          })
          if (caller) {
            caller.info = "Info : res=" + JSON.stringify(this.userConnected.fullName)
          }

          if (!this.utils.isEmpty(this.userConnected.adminConsultantUsernameFct)) {

            this.findConsultantByUsername(this.userConnected.adminConsultantUsernameFct,
              (data, user) => {
                this.logger.debug("findConsultantByUsername data : ", data)
                this.logger.debug("findConsultantByUsername user : ", user)
                this.majAdminConsultantFct(this.userConnected, user);
                this.userConnected.adminConsultant = user
                this.logger.debug("findConsultantByUsername userConnected.adminConsultant : ", this.userConnected.adminConsultant)
                this.saveTokenUser(this.userConnected);
              },
              (error) => {
                this.logger.debug("findConsultantByUsername: error ", error);
                if (caller) {
                  caller.error = "ERROR : error=" + JSON.stringify(error)
                }
              }
            );
          }
        }
      }, error => {
        this.logger.debug("findConsultantByUsername: error ", error);
        if (caller) {
          caller.error = "ERROR : error=" + JSON.stringify(error)
        }
      }
    );
  }

  private setKey(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getValueOfKey(key: string): string {
    let value: string = localStorage.getItem(key);
    return value;
  }

  private saveToken(token: string) {
    ////////////this.logger.debug("saveToken: token=", token);
    sessionStorage.setItem(UtilsService.TOKEN_STORAGE_KEY, token);
    localStorage.removeItem(UtilsService.TOKEN_STORAGE_KEY);
  }

  public getToken(): string {
    let token: string = sessionStorage.getItem(UtilsService.TOKEN_STORAGE_KEY);
    if (!token) {
      const legacyToken = localStorage.getItem(UtilsService.TOKEN_STORAGE_KEY);
      if (legacyToken) {
        sessionStorage.setItem(UtilsService.TOKEN_STORAGE_KEY, legacyToken);
        localStorage.removeItem(UtilsService.TOKEN_STORAGE_KEY);
        token = legacyToken;
      }
    }
    ////////////this.logger.debug("getToken:", token);
    return token;
  }

  saveTokenUser(user: Consultant) {
    localStorage.setItem(UtilsService.TOKEN_STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED, "true");
    //////////this.logger.debug("saveTokenUser:", JSON.stringify(user));
  }

  public isLoggedIn(): boolean {
    // this.logger.debug("isLoggin this.getToken() = ", this.getToken())
    return this.getToken() != null;
  }

  get UserConnected(): Consultant {
    if (!this.userConnected) {
      this.getCurrentUserFromLocaleStorage();
    }

    return this.userConnected;
  }

  setUserConnected(user: Consultant) {
    this.userConnected = user;
    this.syncEsnFromUser(user);
    this.userConnectedSource.next(user);
    this.isUserLoggedInFct.next(!!user);
    this.hydrateStoredUserEsnIfNeeded();
  }

  majManagerOfUserCurent() {
    this.consultantService.majAdminConsultant(this.userConnected)
  }

  mapAct = new Map<number, Activity>();
  majListCra() {
    this.majListCraParam(this.listCraSource.value)
  }

  majListCraParam(list: Cra[]) {
    if (list != null) {
      for (let cra of list) {
        this.majCra(cra)
      }
    }
  }

  majCra(cra: Cra) {

    this.majConsultantInCra(cra);
    this.majActivityInCra(cra);
  }

  public majActivityInCra(cra: Cra) {
    if (cra != null) {
      for (let craDay of cra.craDays) {
        if (craDay != null) {
          for (let craDayActivities of craDay.craDayActivities) {
            // craDayActivities.craDay = craDay
            this.majActivityInCraDayActivity(craDayActivities);
          }
        }
      }
    }
  }

  majConsultantInCra(cra: Cra, fct: Function = null) {

    // this.logger.debug("majConsultantInCra cra : ", cra);
    if (cra == null) {
      return;
    }

    let consultant = cra.consultant;
    let consultantId = cra.consultantId;
    if (consultantId != null && consultant == null) {
      let consul = this.consultantService.mapConsul[consultantId];
      if (consul != null) {
        cra.consultant = consul;
        this.consultantService.majAdminConsultant(cra.consultant)
        if (fct) fct()
      } else {
        this.consultantService.findById(consultantId).subscribe(
          data => {
            consul = data.body.result;
            this.consultantService.mapConsul[consultantId] = consul;
            cra.consultant = consul;
            this.logger.debug("majCra act : ", consul);
            this.logger.debug("majCra listCra : ", this.listCraSource.value);
            this.consultantService.majAdminConsultant(cra.consultant)
            if (fct) fct()
          }, error => {
            this.logger.debug("majCra ERROR : ", error);
          }
        );
      }
    } else {
      this.consultantService.majAdminConsultant(cra.consultant)
      if (fct) fct()
    }
  }

  majConsultantInActivity(activity: Activity, fct: Function) {

    // this.logger.debug("majConsultantInActivity activity : ", activity);
    if (activity == null) {
      return;
    }

    let consultant = activity.consultant;
    let consultantId = activity.consultantId;
    if (consultantId != null && consultant == null) {
      let consul = this.consultantService.mapConsul[consultantId];
      if (consul != null) {
        activity.consultant = consul;
        this.consultantService.majAdminConsultant(activity.consultant)
        if (fct) fct(activity)
      } else {
        this.consultantService.findById(consultantId).subscribe(
          data => {
            consul = data.body.result;
            this.consultantService.mapConsul[consultantId] = consul;
            activity.consultant = consul;
            this.logger.debug("majActivity act : ", consul);
            this.consultantService.majAdminConsultant(activity.consultant)
            if (fct) fct(activity)
          }, error => {
            this.logger.debug("majActivity ERROR : ", error);
          }
        );
      }
    } else {
      this.consultantService.majAdminConsultant(activity.consultant)
    }
  }

  majConsultantInActivityList(allActivities: Activity[], fct: Function) {
    if (allActivities == null) {
      return;
    }
    for (let activity of allActivities) {
      this.majConsultantInActivity(activity, fct);
    }
  }


  majActivityInCraDayActivity(craDayActivities: CraDayActivity) {

    // this.logger.debug("majActivityInCraDayActivity craDayActivities : ", craDayActivities);
    if (craDayActivities == null) {
      return;
    }

    let activity = craDayActivities.activity;
    let activityId = craDayActivities.activityId;
    if (activityId != null && activity == null) {
      let act = this.mapAct[activityId];
      if (act != null) {
        craDayActivities.activity = act;
      } else {
        this.activityService.findById(activityId).subscribe(
          data => {
            act = data.body.result;
            this.mapAct[activityId] = act;
            craDayActivities.activity = act;
            // this.logger.debug("majListCra act : ", act);
            // this.logger.debug("majListCra listCra : ", this.listCra);
          }, error => {
            this.logger.debug("majListCra ERROR : ", error);
          }
        );
      }
    }
  }

  /////////////// dash board 


  // ---- Notifications : délégation à NotificationFacade ----

  public getListNotifications(): Notification[] {
    return this.notificationFacade.getListNotifications();
  }

  public setListNotifications(list: Notification[]): void {
    this.notificationFacade.setListNotifications(list);
  }

  public loadNotifications(): Observable<Notification[]> {
    return this.notificationFacade.loadNotifications();
  }

  public refreshNotifications(): void {
    this.notificationFacade.refreshNotifications();
  }

  public forceRefreshNotifications(): void {
    this.notificationFacade.forceRefreshNotifications();
  }

  public getNotifications(fctOk: Function, fctKo: Function) {
    this.notificationFacade.getNotifications(fctOk, fctKo);
  }

  majListNotifications() {
    const notifs = this.getListNotifications();
    if (!notifs) return;
    for (let notif of notifs) {
      if (!notif) {
        continue;
      }
      let cra = notif.cra
      if (cra != null) {
        this.majCra(cra);
      } else {
        let craId = notif.craId
        if (craId != null) {
          notif.cra = this.getCraInListCraById(craId);
          if (notif.cra != null) {
            this.majCra(notif.cra);
          } else {
            this.craService.findById(craId).subscribe(
              data => {
                notif.cra = data.body.result
                this.majCra(notif.cra);
              }, error => {
                this.logger.error("majListNotifications majCra craId=" + craId, error);
              }
            )
          }
        }
      }
    }
  }

  getCraInListCraById(craId: number) {
    // this.logger.debug("getCraInListCraById : craId, this.listCra = ", craId, this.listCra)
    const list = this.listCraSource.value;
    if (list) {
      for (let cra of list) {
        if (cra.id == craId) {
          return cra
        }
      }
    }

    return null
  }



  /***
   * add new notification
   */
  public addNotificationServer(notification: Notification): Observable<GenericResponse> {
    return this.notificationFacade.addNotificationServer(notification);
  }

  addNotification(notification: Notification, fctOk: Function, fctKo: Function) {
    this.notificationFacade.addNotification(notification, fctOk, fctKo);
  }

  /***
   * used to update notification
   * @param notification
   */
  public saveNotificationServer(notification: Notification): Observable<GenericResponse> {
    return this.notificationFacade.saveNotificationServer(notification);
  }

  saveNotification(notification: Notification, fctOk: Function, fctKo: Function) {
    this.notificationFacade.saveNotification(notification, fctOk, fctKo);
  }

  /***
   * used to delete notification
   * @param id
   */
  public deleteNotificationServer(id: number): Observable<GenericResponse> {
    return this.notificationFacade.deleteNotificationServer(id);
  }

  deleteNotification(id: number, fctOk: Function, fctKo: Function) {
    this.notificationFacade.deleteNotification(id, fctOk, fctKo);
  }

  public deleteNotificationsOfConsultant(consultantId: number, fctOk: Function, fctKo: Function) {
    this.notificationFacade.deleteNotificationsOfConsultant(consultantId, fctOk, fctKo);
  }

  public deleteNotifications(fctOk: Function, fctKo: Function) {
    this.notificationFacade.deleteNotifications(this.getLastUserName(), fctOk, fctKo);
  }

  public getNotificationNettoyee(notification: Notification): Notification {
    return this.notificationFacade.getNotificationNettoyee(notification);
  }

  ///////////////////

  public majClientInProject(p: Project, fct: Function = null) {
    let cond = p && !p.client && p.clientId
    this.logger.debug("majClientInProject : cond, p, p.client, p.clientId", cond, p, !p.client, p.clientId)
    if (p && !p.client && p.clientId) {
      this.clientService.findById(p.clientId).subscribe(
        data => {
          p.client = data.body.result;
          this.logger.debug("maj client in project p.client : ", p.client)
          if (fct) fct()
        }, error => {
          this.logger.debug("majCra ERROR : ", error);
        }
      );
    }
  }

  public majClientInProjectList(list: Project[]) {
    this.logger.debug("majClientInProjectList list : ", list)
    if (list) {
      for (let p of list) {
        this.majClientInProject(p);
      }
    }
  }

  ////////////////

  setAdminConsultant(user: Consultant) {
    this.consultantService.majAdminConsultant(user);
  }

  ////////////////////

  sendMailToConfirmInscription(fctOk: Function, fctKo: Function) {
    // send email . si ok, msgBox : un mail a été envoyé. retour à la racine 
    let respEsnSavedName = this.respEsnSaved.fullName
    let esnSavedName = this.esnSaved.name

    let mail = new Mail()
    mail.subject = "ESN360 : Confirmation de l'ajout de votre esn : " + esnSavedName
    mail.to = this.respEsnSaved.email


    let to = mail.to

    mail.msg = `
              Bonjour ${respEsnSavedName},\n<BR>
              \n<BR>
              Votre ESN "${esnSavedName}" et son Responsable "${respEsnSavedName}" ont bien été ajoutés à notre plateforme Esn360.\n<BR>
              \n<BR>
              Email : ${to}\n<BR>
              Password : ${this.passRespEsnSaved}\n<BR>
              url = : ${environment.urlFront}\n<BR>
              \n<BR>
              Cordialement,\n<BR>
              l'équipe ESN 360 \n<BR>
              \n<BR>
              `;

    let label2 = "sendMailSimple"
    this.logger.debug("goto " + label2)
    this.msgService.sendMailSimple(mail, this.IsAddEsnAndResp).subscribe(
      data => {
        this.logger.debug(label2 + " data : ", data)
        if (fctOk) fctOk(data, to)
      },
      error => {
        if (fctKo) fctKo(error)
      }
    );

  }

  /**
 * Envoie un mail contenant un lien de validation d'adresse email.
 * Le lien a la forme : URL_FRONT + "/validateEmail/<code_email_to_validate>"
 * @param fctOk Fonction à exécuter en cas de succès
 * @param fctKo Fonction à exécuter en cas d'erreur
 */
  sendMailToValidEmailInscription(fctOk: Function, fctKo: Function) {

    let label = "sendMailToValidEmailInscription";

    const respEsnSavedName = this.respEsnSaved.fullName;
    const respEsnMail = this.respEsnSaved.email;
    const esnSavedName = this.esnSaved.name;

    // 🔹 Génération d’un code unique de validation (par ex. UUID ou hash)
    const codeEmailToValidate = this.utils.generateRandomCode(32);
    const validationUrl = `${environment.urlFront}/#/validateEmail/${codeEmailToValidate}`;

    // 🔹 Construction du mail
    const mail = new Mail();
    mail.subject = `ESN360 : Validation de votre email ${respEsnMail}`;
    mail.to = respEsnMail;
    mail.msg = `
    Bonjour ${respEsnSavedName},<br><br>
    Votre ESN <strong>${esnSavedName}</strong> et son Responsable <strong>${respEsnSavedName}</strong> ont bien été ajoutés à notre plateforme <strong>ESN360</strong>.<br><br>
    Avant de pouvoir vous connecter, veuillez valider votre adresse email en cliquant sur le lien suivant :<br><br>
    👉 <a href="${validationUrl}" target="_blank">${validationUrl}</a><br><br>
    <hr>
    Vos identifiants :<br>
    Email : ${respEsnMail}<br>
    Mot de passe : ${this.passRespEsnSaved}<br><br>
    Cordialement,<br>
    L’équipe <strong>ESN360</strong><br>
  `;

    this.respEsnSaved.password = this.passRespEsnSaved;

    // 🔹 Envoi du mail
    this.logger.debug("goto " + label);

    this.msgService.sendMailSimple(mail, this.IsAddEsnAndResp).subscribe(
      (data) => {
        this.logger.debug(label + " data : ", data);
        // insertion du code de validation en base, lié au respEsnSaved et avec une date d'expiration 
        this.consultantService.saveCodeEmailToValidate(this.respEsnSaved, codeEmailToValidate).subscribe(
          (dataSave) => {
            this.logger.debug("saveCodeEmailToValidate data : ", dataSave);

            if (fctOk) fctOk(data, respEsnMail, codeEmailToValidate);

          }, (errorSave) => {
            this.logger.error("saveCodeEmailToValidate error : ", errorSave);

            this.uiFeedback.addError(new MyError("Erreur lors de l'enregistrement du code de validation d'email.", JSON.stringify(errorSave)));
          }
        );

      },
      (error) => {
        this.logger.error(label + " error : ", error);
        if (fctKo) fctKo(error);
      }
    );
  }

  /**
   * Envoie un email de réinitialisation du password
   */
  sendResetPasswordEmail(email: string, callbacks: any): void {
    const label = "sendResetPasswordEmail";

    this.logger.debug(label + ": START - Email: " + email);

    // Générer un code unique de réinitialisation
    const codeResetPassword = this.utils.generateRandomCode(32);
    const resetPasswordUrl = `${environment.urlFront}/#/resetPassword/${codeResetPassword}`;

    this.logger.debug(label + ": Code de reset généré");

    // Construction du mail
    const mail = new Mail();
    mail.subject = `ESN360 : Réinitialisation de votre mot de passe`;
    mail.to = email;
    mail.msg = `
    Bonjour,<br><br>
    Vous avez demandé la réinitialisation de votre mot de passe pour la plateforme <strong>ESN360</strong>.<br><br>
    Cliquez sur le lien suivant pour réinitialiser votre mot de passe :<br><br>
    👉 <a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a><br><br>
    <strong>Ce lien expire dans 24 heures.</strong><br><br>
    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.<br><br>
    Cordialement,<br>
    L'équipe <strong>ESN360</strong><br>
  `;

    this.logger.debug(label + ": Mail construit, envoi en cours...");

    // Envoi du mail
    this.msgService.sendMailSimple(mail, true).subscribe(
      (data) => {
        this.logger.debug(label + ": ✅ Mail envoyé avec succès");
        this.logger.debug(label + ": Response: ", data);

        // Sauvegarder le code de reset en base de données lié à l'email
        this.consultantService.saveCodeResetPassword(email, codeResetPassword,
          (data, mesg) => {
            if (callbacks && callbacks.next) {
              callbacks.next(data);
            }
          }, (errorSave, mesg) => {
            this.uiFeedback.addError(new MyError(
              "Erreur lors de la sauvegarde du code de réinitialisation.",
              JSON.stringify(errorSave)
            ));

            if (callbacks && callbacks.error) {
              callbacks.error(errorSave);
            }
          }
        );
      },
      (error) => {
        this.logger.error(label + ": ❌ Erreur lors de l'envoi du mail");
        this.logger.error(label + ": Error: ", error);

        this.uiFeedback.addError(new MyError(
          "❌ Erreur lors de l'envoi du mail de réinitialisation.",
          JSON.stringify(error)
        ));

        if (callbacks && callbacks.error) {
          callbacks.error(error);
        }
      }
    );
  }

  /**
   * Émettre le signal que esnCurrent est prêt
   */
  notifyEsnCurrentReady(esn: Esn): void {
    this.emitEsnCurrentIfChanged(esn);
  }



}
