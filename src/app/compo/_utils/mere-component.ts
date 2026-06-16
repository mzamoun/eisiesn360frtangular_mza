import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Consultant } from 'src/app/model/consultant';
import { Esn } from 'src/app/model/esn';
import { MyError } from 'src/app/resource/MyError';
import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';
import { DataSharingService } from "../../service/data-sharing.service";

@Component({
  selector: 'infors',
  templateUrl: './mere-infos.component.html',
  styleUrls: ['./mere.component.css']
})
export class MereComponent implements OnInit, AfterViewInit, AfterContentInit {

  searchStr: string = "";
  protected myList00 = null;
  protected colsSearch: string[] = null;

  listInfos: Array<string> = [];
  listErrors: MyError[];

  protected subscriptions: Subscription[] = [];

  //pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  isShowLoading = false

  loadingComponenet: boolean = true;

  // info: string = '' ;

  public isLoading: boolean = false;
  nbCallServer = 0;
  @ViewChild('infors', { static: false }) infors: MereComponent;

  @ViewChild('clearInfosBtn', { static: false }) clearInfosBtn: ElementRef;

  @ViewChild('searchStrInput') searchStrInput: ElementRef<HTMLInputElement>;

  public userConnected: Consultant;
  public userConnectedName: String;
  public esnCurrent: Esn;
  public idEsnCurrent: number = -1;
  public esnName = ""
  // esnCurrentName = null;
  public isUserLoggedIn: boolean;
  public isAdmin: boolean;

  constructor(public utils: UtilsService, public dataSharingService: DataSharingService
  ) {
    this.userConnected = dataSharingService.userConnected;
    if (!this.listErrors) this.listErrors = []
  }

  protected get logger(): LoggerService {
    return this.dataSharingService.logger;
  }
  ngAfterContentInit(): void {
    //
  }
  ngAfterViewInit(): void {
    //
  }

  navigateTo(url) {
    this.dataSharingService.navigateTo(url);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.logger.debug("Mere.ngOnInit deb")

    this.subscriptions.push(
      this.dataSharingService.infos$.subscribe(infos => this.listInfos = infos),
      this.dataSharingService.errors$.subscribe(errors => this.listErrors = errors),
      // Keep UI fields (esnName, userConnectedName, role) in sync when user changes
      this.dataSharingService.userConnected$.subscribe(user => {
        this.userConnected = user;
        this.getCurentUserName();
        this.esnCurrent = user?.esn || this.esnCurrent;
        this.idEsnCurrent = this.esnCurrent?.id ?? this.idEsnCurrent;
        this.esnName = user?.esnName || user?.esn?.name || this.esnName;
        this.isAdmin = user?.admin;
        if (user) this.isUserLoggedIn = true;
      }),
      // S'abonner aux mises à jour de esnCurrent pour mettre à jour esnName
      this.dataSharingService.esnCurrentReady$.subscribe(esn => {
        if (esn) {
          this.esnCurrent = esn;
          this.idEsnCurrent = esn.id;
          this.esnName = esn.name;
          this.logger.debug("*** esnName mis à jour via esnCurrentReady$:", this.esnName);
        }
      })
    );

    //setAdminConsultant 
    this.dataSharingService.setAdminConsultant(this.userConnected)

    this.subscriptions.push(
      this.dataSharingService.isUserLoggedInFct.subscribe(value => {
        this.isUserLoggedIn = value;
        if (this.isUserLoggedIn) {
          this.userConnected = this.dataSharingService.userConnected;
          this.getCurentUserName();
          this.isAdmin = this.userConnected?.admin;
          if (this.userConnected) this.isUserLoggedIn = true;

          this.esnCurrent = this.dataSharingService.esnCurrent || this.userConnected?.esn || this.esnCurrent;
          this.idEsnCurrent = this.dataSharingService.idEsnCurrent ?? this.esnCurrent?.id ?? this.idEsnCurrent;
          this.esnName = this.userConnected?.esnName || this.esnCurrent?.name || this.esnName;
        } else {
          this.isAdmin = false;
        }

        // Vérifier si on est sur une route publique, sinon rediriger vers login
        if (this.userConnected == null && !this.dataSharingService.isPublicRoute(this.dataSharingService.router.url)) {
          this.dataSharingService.gotoLogin();
        }
      })
    );

  }

  logout() {
    this.dataSharingService.logout();
  }

  getUserFullName() {
    let userConnected = this.dataSharingService.userConnected
    let res = "LOGIN";
    if (userConnected != null && userConnected.firstName) {
      if (this.userConnected) this.isUserLoggedIn = true;
      res = userConnected.fullName;
    }
    // //////////this.logger.debug("**** getUserFullName : res=", res, userConnected);
    return res;
  }

  public changeLanguage(code: string) {
    localStorage.setItem('locale', code);
    this.utils.setLang(code)
    window.location.reload();

  }

  getCurrentUserFromLocaleStorage(): Consultant {
    return this.dataSharingService.getCurrentUserFromLocaleStorage()
  }

  isConsultant(): boolean {
    return this.isConsultantFct(this.dataSharingService.userConnected);
  }

  isConsultantFct(c: Consultant): boolean {
    let res = false;
    if (c != null) {
      if (c.role == "CONSULTANT") res = true;
    }
    return res;
  }

  isADMINRole(): boolean {
    return this.dataSharingService.isCurrentUserAdmin();
  }

  isAdminProp(): boolean {
    return this.userConnected?.admin ?? false;
  }

  setUserConnected(user: Consultant) {
    this.dataSharingService.setUserConnected(user)
  }

  getEsnCurrent() {
    return this.userConnected?.esn;
  }

  setEsnCurrent(esn: Esn) {
    if (!this.userConnected) {
      return;
    }
    this.userConnected.esn = esn
    this.setUserConnected(this.userConnected)
  }

  getEsnCurrentName() {
    let esn: Esn = this.getEsnCurrent();
    return esn != null ? esn.name : "";
  }

  getCurentUserName() {
    let s = "";
    if (this.userConnected) {
      const fromFullName = (this.userConnected as any).fullName || "";
      const fromParts = [this.userConnected.firstName, this.userConnected.lastName]
        .filter(part => !!part)
        .join(' ')
        .trim();
      s = fromFullName || fromParts || this.userConnected.username || "";
    }
    this.userConnectedName = s;

    if (this.userConnected) this.isUserLoggedIn = true;

    return s;
  }

  getCurentUserEmail() {
    let s = "";
    let userEmail = this.userConnected ? this.userConnected.email : "";
    if (userEmail) {
      s = userEmail
    }
    return s;
  }

  getManagerEmailOfUserCurent() {
    let s = this.userConnected ? this.userConnected.adminConsultant?.email : "";
    return s;
  }

  getEsnId() {
    return this.userConnected ? this.userConnected.esnId : -1
  }

  clearInfos() {
    //////////this.logger.debug("DBG MereComponent clearInfos")
    this.dataSharingService.clearInfosErrors()
    this.nbCallServer = 0

    if (this.userConnected) this.isUserLoggedIn = true;

  }

  setInfosMere() {
    //////this.logger.debug("MERE setInfosMere infors", this.infors)
    if (this.infors) {
      this.infors.listInfos = this.listInfos;
      this.infors.listErrors = this.listErrors;
      //////this.logger.debug("MERE setInfosMere infors.listInfos", this.infors.listInfos)
      //////this.logger.debug("MERE setInfosMere infors.listErrors", this.infors.listErrors)
    }
    else {
      //////this.logger.debug("!!!!!!!!!!!!!!!!!!!!!!! setInfosMere infors NOT EXIST !!!!!!!!!!!!!!!!!!!!!!!!", this)
    }

    if (this.userConnected) this.isUserLoggedIn = true;
  }

  addInfo(info: string, isShowLoading = true) {
    this.logger.debug("CallServer addInfo: info=" + info);
    //////////this.logger.debug("///////// DATA SHARING add info " , info, this)
    this.isShowLoading = isShowLoading;
    this.dataSharingService.addInfo(info);
  }

  delInfo(info: string) {
    this.logger.debug("CallServer delInfo: info=" + info);
    this.dataSharingService.delInfo(info)
  }

  // getlistInfos() {
  //   // if(this.infors) this.listInfos = this.infors.listInfos
  //   // if(this.infors) {
  //   //   this.listInfos = this.infors.listInfos ;
  //   // }
  //   // else {
  //   //   //////this.logger.debug("!!!!!!!!!!!!!!!!!!!!!!! getlistInfos infors NOT EXIST !!!!!!!!!!!!!!!!!!!!!!!!", this)
  //   // }
  //   this.listInfos = this.dataSharingService.listInfos;
  //   return this.listInfos;
  // }

  isInfoOrError() {
    return this.isInfo() || this.isError();
  }

  isInfoAndNotError() {
    return this.isInfo() && !this.listErrors;
  }

  isInfo() {
    // this.listInfos = this.dataSharingService.listInfos;
    return this.listInfos && this.listInfos.length > 0;
  }

  isError() {
    // this.listErrors = this.dataSharingService.listErrors;
    //////this.logger.debug("IsError listErrors:", this.listErrors)
    return this.listErrors && this.listErrors.length > 0;
  }

  getError() {
    // if(this.infors) this.error = this.infors.getError()
    return this.listErrors;
  }

  // getErrorStr() {
  //   let err = this.getError()
  //   return err? this.getErrorTitleMsg(err) : "" ;
  // }

  addErrorTxt(errorTxt: string) {
    this.dataSharingService.addErrorTxt(errorTxt)
  }

  addError(error: MyError) {
    // this.logger.debug("addError error:", error)
    if (!error || !error.msg) return
    //////this.logger.debug("addError add msg:", error.msg)
    this.dataSharingService.addError(error)
  }

  getErrorTitleMsg(err: MyError) {
    // ////////this.logger.debug("getErrorTitleMsg err:", err)
    let s = '';
    if (err) {
      let title = err.title;
      if (title) s = title;
      let msg = err.msg;
      if (msg) {
        s = s + " : " + msg;
      }
    }
    // ////////this.logger.debug("getErrorTitleMsg s="+ s)
    return s;
  }

  addErrorTitleMsg(title: string, msg: string) {
    this.addError(new MyError(title, msg))
  }

  addErrorFromResultOfServer(id: string, data: any) {
    let error = this.utils.getErrorFromResultOfServer(data)
    //////////this.logger.debug(">>>> addErrorFromResultOfServer: error=", error)
    this.addError(error);
    //////////this.logger.debug("addErrorFromResultOfServer id="+id+" data:", data, error)
    this.utils.showNotifSuccessOrError(error);
  }

  addErrorFromErrorOfServer(id: string, error: MyError) {
    this.logger.debug("CallServer addErrorFromErrorOfServer id=" + id + " error:", error)
    // this.setError( this.getErrorStr() + " ; " + this.utils.getErrorFromErrorOfServer(error) );
    error = this.utils.getErrorFromErrorOfServer(error)
    this.logger.debug("CallServer addErrorFromErrorOfServer processed error:", error)
    this.addError(error);
    this.utils.showNotification("error", this.getErrorTitleMsg(error));
    this.endLoading(id)
  }

  beforeCallServer(id: string) {
    this.nbCallServer++;
    this.isLoading = true;
    this.dataSharingService.clearErrors();
    this.addInfo(id);
  }

  afterCallServer(id: string, data: any) {
    this.addErrorFromResultOfServer(id, data);
    this.endLoading(id);
  }

  endLoading(id: string) {
    this.nbCallServer--;
    this.logger.debug("endLoading id=" + id + " nbCallServer=" + this.nbCallServer);
    this.delInfo(id);

    // Correction: ne mettre isLoading à false que si plus aucun appel en cours
    if (this.nbCallServer <= 0) {
      this.nbCallServer = 0;
      this.isLoading = false;
      this.logger.debug("CallServer endLoading: tous les appels terminés, isLoading=false");
    } else {
      this.logger.debug("CallServer endLoading: encore " + this.nbCallServer + " appel(s) en cours, isLoading reste true");
    }

    this.logger.debug("CallServerendLoading id=" + id + " listInfos=" + this.listInfos);
    this.logger.debug("CallServer endLoading id=" + id + " listErrors=" + this.listErrors);
  }

  setMyList(list: any[]): void {
    this.logger.debug("MereComponent.setMyList list :", list)
    // this.myList = list 
  }

  search() {
    // this.searchStr = this.searchStr.trim();
    // this.logger.debug("this.searchStr="+this.searchStr)
    if (!this.searchStr) { this.setMyList(this.myList00); }
    else { this.setMyList(this.utils.search(this.myList00, this.searchStr, this.colsSearch)); }
  }

  searchStrClick() {
    this.logger.debug("disabsearchStrClick searchStrInput : ", this.searchStrInput)
    this.enableInputSearchStr();
  }


  clearSearch() {
    this.searchStr = "";
    this.search();
  }

  disableInputSearchStr() {
    // this.logger.debug("disableInputSearchStr DEB searchStrInput : ", this.constructor.name, this.searchStrInput)
    if (this.searchStrInput != null) {
      let inputElement = this.searchStrInput.nativeElement;
      inputElement.disabled = true;
    }
  }

  enableInputSearchStr() {
    // this.logger.debug("enableInputSearchStr DEB searchStrInput : ", this.constructor.name, this.searchStrInput)
    if (this.searchStrInput != null) {
      this.dataSharingService.isDisableSearchStrInput = false;
    }
  }

  isListEmpty(list: any[]): boolean {
    return list == null || list.length == 0
  }

  public majAdminConsultantFct(consultant: Consultant, manager: Consultant): void {
    this.dataSharingService.majAdminConsultantFct(consultant, manager);

  }

}
