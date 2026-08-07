


import { DatePipe } from "@angular/common";
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Consultant } from 'src/app/model/consultant';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Cra } from '../../../model/cra';
import { ConsultantService } from "../../../service/consultant.service";
import { CraService } from '../../../service/cra.service';
import { DataSharingService } from "../../../service/data-sharing.service";
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { CraFormCalComponent } from '../cra-form/cra-form-cal.component';

@Component({
  selector: 'app-cra-list',
  templateUrl: './cra-list.component.html',
  styleUrls: ['./cra-list.component.css']
})
export class CraListComponent extends MereComponent {

  // info00: string = '' ;

  title: string = ""
  myList: Cra[];
  listCraFiltred: Cra[];
  consultants: Consultant[];

  currentCra: Cra;
  @ViewChild('craDetailCal', { static: false }) craDetailCal: CraFormCalComponent;

  filterConsultant: Consultant = null;
  filterMonth: Date = null;

  p1: any; p2: any

  constructor(private craService: CraService,
    private router: Router
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , protected utilsIhm: UtilsIhmService
    , private consultantService: ConsultantService
    , private datePipe: DatePipe) {


    super(utils, dataSharingService);

    this.logger.debug("START CraListComponent constructor")

    this.colsSearch = ["consultantUsername", "month", "createdDate", "lastModifiedDate"]
  }

  ngOnInit() {

    this.logger.debug("START CraListComponent ngOnInit")

    this.title = this.utils.tr('List') + " " + this.utils.tr('Cra') + "/" + this.utils.tr('Conge');
    this.logger.debug("cla-list ngOnInit userConnected", this.userConnected)

    this.dataSharingService.getNotifications(null, null);

    this.findAll();

    this.getListConsultants(() => {
      this.filterConsultant = this.userConnected;
      this.getFilteredCra();
    }, null);

  }

  getTitle() {

    let nbElement = 0
    if (this.myList != null) nbElement = this.myList.length
    let t = this.title + " (" + nbElement + ")"
    return t
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }

  findAll(forceRefresh: boolean = false) {
    const label = "cra-list.findAll";
    const startTime = performance.now();
    this.logger.debug(label + " START");

    // Utilise la méthode loadListCra de DataSharingService pour le lazy loading
    this.dataSharingService.loadListCra(forceRefresh).subscribe((craList: Cra[]) => {
      const afterCallTime = performance.now();
      this.logger.debug(label + " - Data received duration: " + (afterCallTime - startTime).toFixed(2) + "ms");

      this.myList = craList;
      this.logger.debug(label + " - myList ", this.myList);
      this.logger.debug(label + " - myList size: " + this.myList?.length);


      this.myList00 = this.myList;

      const beforeSortTime = performance.now();
      if (!this.isError() && this.myList && this.myList.length > 0) {
        this.myList = this.myList.sort((a, b) => this.compareCraDesc(a, b))
      }
      const afterSortTime = performance.now();
      this.logger.debug(label + " - sort duration: " + (afterSortTime - beforeSortTime).toFixed(2) + "ms");

      this.getTitle();

      const beforeFilteredTime = performance.now();
      this.getFilteredCra();
      const afterFilteredTime = performance.now();
      this.logger.debug(label + " - getFilteredCra duration: " + (afterFilteredTime - beforeFilteredTime).toFixed(2) + "ms");

      const endTime = performance.now();
      this.logger.debug(label + " END - Total duration: " + (endTime - startTime).toFixed(2) + "ms");
    });
  }

  majListCraConsultants() {
    for (let cra of this.myList) {
      cra.consultant = this.consultants.find(c => c.username === cra.consultantUsername);
    }
  }

  majListCraDays() {
    for (let cra of this.myList) {
      this.dataSharingService.majActivityInCra(cra);
    }
  }

  saveListCra(list: Cra[]) {
    for (let cra of list) {
      this.saveCra(cra);
    }
  }

  saveCra(cra: Cra) {
    this.beforeCallServer("saveCra")
    this.craService.save(cra).subscribe(
      data => {
        this.afterCallServer("saveCra", data)
        //////this.logger.debug("saveCra data=", data)
      }, error => {
        this.addErrorFromErrorOfServer("saveCra", error);
        //////this.logger.debug("saveCra error=", error)
      })
  }

  compareCraDesc(a: Cra, b: Cra) {
    return b.month.toString().localeCompare(a.month.toString());
  }

  getClassButtonShowCra(cra: Cra) {
    let t = "btn btn-outline-primary"
    if (cra.type == 'CONGE') t = "btn btn-outline-primary bg-conge";
    return t;
  }

  getTitleButtonShowCra(cra: Cra) {
    let t = this.utils.tr("showCra")
    if (cra.type == 'CONGE') t = this.utils.tr("showConge");
    return t;
  }

  addNewCra() {
    this.addNew('CRA');
  }

  addNew(type: string) {
    this.clearInfos();
    this.dataSharingService.typeCra = type;
    this.router.navigate(['/cra_form'], { queryParams: { 'isAdd': 'true', 'typeCra': type } });
  }

  showCra(cra: Cra, event: any) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Charger les activités du CRA avant de l'afficher
    // this.dataSharingService.majCra(cra, 
    //   () => {
    //     this.dataSharingService.showCra(cra);
    //   }
    // );
    this.dataSharingService.showCra(cra);
  }

  edit(cra: Cra) {
    this.clearInfos();
    this.craService.setCra(cra);
    this.router.navigate(['/cra_form']);
  }

  delete(myObj: Cra) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.compo.cra.list.confirmDelete', { type: myObj.type ? myObj.type : 'CRA', id: myObj.id }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.craService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.findAll(true);
                mythis.currentCra = null;
              }
            }, error => {
              mythis.addErrorFromErrorOfServer("delete", error);
              ////this.logger.debug(error);
            }
          );
      }
      , null
    );
  }

  canDeleteCra(myObj: Cra) {
    let cond = !myObj.validByConsultant && myObj.id != null;

    if (this.dataSharingService.isCurrenUserRespOrAdmin()) {
      return myObj.id != null;
    } else {
      return cond;
    }

  }

  getIdOfCurentCra() {
    return this.currentCra != null ? this.currentCra.id : -1;
  }

  /****
   * this method used to verify the current user has role for show the cra of consultants or no
   */
  accessCraConsultants() {
    let currentUser = this.dataSharingService.userConnected
    if (currentUser.role == "MANAGER" || currentUser.role == "RESPONSIBLE_ESN" || currentUser.role == "ADMIN") return true;
    return false;
  }

  getFilteredCra() {
    this.logger.debug("getFilteredCra", this.filterConsultant, this.filterMonth);
    if (!this.filterConsultant) {
      this.logger.debug("getFilteredCra: filterConsultant is null");
      this.listCraFiltred = this.myList || [];
      return;
    }
    let month: string = null;
    if (this.filterMonth) month = this.datePipe.transform(this.filterMonth, 'yyyy-MM');
    this.logger.debug("getFilteredCra", this.filterConsultant.username, month);

    const username = this.filterConsultant.username;
    this.listCraFiltred = (this.myList || []).filter(cra => {
      const matchConsultant = !username || (cra.consultantUsername === username || cra.consultant?.username === username);
      const craMonth = this.datePipe.transform(cra.month, 'yyyy-MM');
      const matchMonth = !month || (craMonth === month);
      return matchConsultant && matchMonth;
    });

    this.logger.debug("**** getFilteredCra: listCraFiltred=", this.listCraFiltred);

    if (!this.isError()) this.listCraFiltred = this.listCraFiltred.sort((a, b) => this.compareCraDesc(a, b))
  }

  // @ViewChild("mydate", {static: false}) mydate: MyDatePicker;
  deleteFilterMonth() {
    this.filterMonth = null;
    // this.mydate.writeValue("")
  }

  onSelectConsultant(consultant: Consultant) {
    this.filterConsultant = consultant;
    if (this.filterConsultant == null) this.filterConsultant = new Consultant();
  }

  @ViewChild('compoSelectConsultant', { static: false }) compoSelectConsultant: SelectComponent;
  selectConsultant(consultant: Consultant) {
    this.compoSelectConsultant.selectedObj = consultant;
  }

  getListConsultants(fctOk: Function, fctKo: Function) {
    this.beforeCallServer("getListConsultants")
    this.consultantService.findAll().subscribe(
      data => {
        this.afterCallServer("getListConsultants", data)
        this.consultants = data.body.result;
        if (fctOk) fctOk();
      }, error => {
        this.addErrorFromErrorOfServer("getListConsultants", error);
        if (fctKo) fctKo();
      }
    );
  }

}
