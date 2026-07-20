


import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ActivityType } from "../../../model/activityType";
import { Cra } from "../../../model/cra";
import { CraDay } from "../../../model/cra-day";
import { CraStatusHisto } from "../../../model/cra-status-histo.model";
import { ActivityService } from '../../../service/activity.service';
import { CraService } from '../../../service/cra.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarView
} from 'angular-calendar';
import {
  endOfDay,
  startOfDay,
} from 'date-fns';

import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from "rxjs";
import { CraContext } from 'src/app/core/model/cra-context';
import { Consultant } from 'src/app/model/consultant';
import { Notification } from 'src/app/model/notification';
import { ActivityTypeService } from 'src/app/service/activityType.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { CraObservable, CraObserver } from "../../../core/core";
import { Activity } from "../../../model/activity";
import { CraDayActivity } from "../../../model/cra-day-activity";
import { CraReportActivity } from "../../../model/cra-report-activity";
import { DataSharingService } from "../../../service/data-sharing.service";
import { UtilsService } from "../../../service/utils.service";
import { ClientsDialogComponent } from '../../_dialogs/ClientsDialogComponent';
import { CraHistoStatusComponent } from '../../_dialogs/CraHistoStatusComponent';
import { DownloadClientCraDialogData } from '../../_dialogs/DownloadClientCraDialogComponent';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { AddMultiDateComponent } from "../add-multi-date/add-multi-date.component";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#2E8B57',
    secondary: '#D1E8FF'
  }
};

@Component({
  selector: 'app-cra-form-cal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cra-form-cal.component.html',
  styleUrls: ['./cra-form.component.css']
})
export class CraFormCalComponent extends MereComponent implements CraObserver {

  @ViewChild('dayDetailView', { static: true }) dayDetailView: TemplateRef<any>;
  @ViewChild('addActivityView', { static: true }) addActivityView: TemplateRef<any>;
  @ViewChild('rejectCraView', { static: true }) rejectCraView: TemplateRef<any>;
  @ViewChild('raddMultiDateComponent', { static: true }) addMultiDateComponent: TemplateRef<any>;
  @ViewChild('showCraReportPdfView', { static: true }) showCraReportPdfView: TemplateRef<any>;
  @ViewChild('attachment', { static: true }) attachment: ElementRef;

  refresh: Subject<any> = new Subject();

  title = "CraFormCal"

  isAdd: string;
  typeCra: string;
  @Input() currentCra: Cra;

  btnActionTitle: string;
  craDayActivity: CraDayActivity = new CraDayActivity();
  craDay: CraDay;
  daySelected: any;
  daySelectedStr: string; // yyyy-mm-dd
  dateOfDaySelected: Date;
  isDaySelectedInCurentMonth = false;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  activities: Activity[];

  times: number[] = [0.5, 1]

  widthDevisEntete00 = "33%"
  widthDevisEntete = "33%"

  totalDayToWork: number;
  numberDayAbs: number;
  numberDayWorked: number;
  numberDayBilled: number;
  totalBilled: number;  // en TJM

  isEditCraActivity: boolean = false;
  currentCraUser: Consultant = null;  //user of cra
  userConnected: Consultant = null;  //user connected

  activityErrorMessage: string = ''; // Message d'erreur pour la boîte de dialogue d'ajout d'activité

  craReportActivities: CraReportActivity[];

  isAffWeekNumber = true;
  titleShowWeekNumber = this.utils.tr('app.compo.cra.form.hideWeekNumber');

  isAddMultiDate = false;
  addMultiDateStartDate!: Date;
  addMultiDateEndDate!: Date;

  isToRejectCra = false;
  isToValidateCra = false;

  is_canValidateCraOrConge = false;
  is_canSubmitCra = false;

  showDownloadSendEmailCraPanel = false;
  downloadSendEmailCraData: DownloadClientCraDialogData = null;

  showWeekNumber() {
    // //////////this.logger.debug("DBG showWeekNumber")
    if (this.isAffWeekNumber) this.titleShowWeekNumber = this.utils.tr('app.compo.cra.form.showWeekNumber');
    else this.titleShowWeekNumber = this.utils.tr('app.compo.cra.form.hideWeekNumber');

    this.isAffWeekNumber = !this.isAffWeekNumber;
  }


  constructor(private route: ActivatedRoute, private router: Router
    , private craService: CraService
    , private consultantService: ConsultantService
    , private esnService: EsnService
    , private activityService: ActivityService
    , private activityTypeService: ActivityTypeService
    , private modal: NgbModal
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private utilsIhm: UtilsIhmService
    , private cdr: ChangeDetectorRef
    , private datePipe: DatePipe
    , public dialog: MatDialog
  ) {
    super(utils, dataSharingService);
  }

  /**
   * s'il ne vient pas d'un input , il peut venir des params de l'url
   */

  ngOnInit(): void {
    // eviter d'entrer si on vient de nulle part
    if (!this.dataSharingService.getListCra() && !this.dataSharingService.fromNotif) {
      this.gotoCraList();
    }

    this.userConnected = this.getCurrentUserFromLocaleStorage();
    this.setUserConnected(this.userConnected)

    if (this.notADate(this.viewDate)) {
      this.viewDate = new Date();
    }
    this.viewDate = this.utils.getDate(this.viewDate);

    this.initParams();

    this.dataSharingService.addService(this);

    if (this.isAdd == "true") {
      this.currentCraUser = this.userConnected;
      this.findAllActivities();
    } else {
      // Utiliser directement le consultant du CRA existant pour éviter l'appel serveur
      this.currentCraUser = this.currentCra?.consultant || this.userConnected;
      this.findAllActivities();
    }

    this.setCurrentCraConsultantId()

    this.consultantService.majAdminConsultant(this.userConnected)

    this.consultantService.majCra(this.currentCra);

    this.statusHistoJsonToTab()

    // Rafraîchir le calendrier quand les jours fériés arrivent de l'API (chargement async)
    this.subscriptions.push(
      this.craService.holidaysLoaded$.subscribe(config => {
        if (config) {
          this.refreshMe();
        }
      })
    );

    this.is_canValidateCraOrConge = this.canValidateCraOrConge();
    this.is_canSubmitCra = this.canSubmitCra();

    setTimeout(() => {
      this.process();
      this.refreshMe();
    }, 2000);

  }

  getClassForStatus(): string {
    switch (this.currentCra?.status) {
      case 'VALIDATED':
        return "btn-outline-success";
      case 'REJECTED':
        return "btn-outline-danger";
      default:
        return "btn-outline-primary";
    }
  }

  changeTypeToCra() {
    if (this.currentCra) {
      this.currentCra.type = "CRA"
      this.typeCra = this.currentCra.type
      this.setStatus("DRAFT")
      this.currentCra.validByConsultant = false
      this.currentCra.validByManager = false
      this.maj_canSubmitCra();
      this.findAllActivities();
    }
  }

  addStatusHisto() {
    if (this.currentCra) {

      if (!this.currentCra.statusHistoTab) {
        this.currentCra.statusHistoTab = []
      }

      let histo = new CraStatusHisto();
      histo.dateStatus = new Date()
      histo.status = this.currentCra.status
      histo.typeCra = this.currentCra.type
      histo.userConnected = this.userConnected
      histo.comment = this.currentCra.comment
      this.currentCra.statusHistoTab.push(histo)

      this.statusHistoTabToJson()
    }
  }

  statusHistoJsonToTab() {
    if (!this.currentCra.statusHistoJson) {
      this.currentCra.statusHistoJson = "[]"
      this.currentCra.statusHistoTab = []
    } else {
      this.currentCra.statusHistoTab = JSON.parse(this.currentCra.statusHistoJson)
    }
  }

  statusHistoTabToJson() {
    if (!this.currentCra.statusHistoTab) {
      this.currentCra.statusHistoJson = "[]"
      this.currentCra.statusHistoTab = []
    } else {
      this.currentCra.statusHistoJson = JSON.stringify(this.currentCra.statusHistoTab)
    }
  }

  setCurrentCraConsultantId() {
    if (!this.currentCra.consultantId) {
      if (this.currentCra.consultant && this.currentCra.consultant.id) {
        this.currentCra.consultantId = this.currentCra.consultant.id
      } else {
        this.currentCra.consultantId = this.userConnected.id
      }
    }
  }

  initParams() {
    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
      if (this.isAdd == null) {
        this.isAdd = this.dataSharingService.isAdd;
      }
    }
    if (this.typeCra == null) {
      this.typeCra = this.route.snapshot.queryParamMap.get('typeCra');
      if (this.typeCra == null) {
        this.typeCra = this.dataSharingService.typeCra;
      }
    }

    if (this.currentCra == null) {
      if (this.isAdd != "true") {
        // Essayer de récupérer le CRA depuis le state de navigation (passé par showCra)
        const navigation = this.router.getCurrentNavigation();
        if (navigation && navigation.extras && navigation.extras.state) {
          this.currentCra = navigation.extras.state['cra'];
        }

        if (!this.currentCra) {
          // Essayer de récupérer le CRA depuis le service (défini par cra-list)
          this.currentCra = this.craService.getCra();
        }
        if (!this.currentCra) {
          // Fallback: récupérer depuis le dataSharingService
          this.currentCra = this.dataSharingService.getCurrentCra();
        }
        if (!this.currentCra) {
          // Si toujours null, créer un nouveau CRA
          this.currentCra = new Cra();
          this.isAdd = "true";
        }
      } else {
        this.currentCra = new Cra();
      }
    }

    this.currentCraUser = this.currentCra?.consultant

    // Initialiser le CRA pour afficher les activités dans le calendrier
    if (this.currentCra && !this.isAdd) {
      this.initCra(this.currentCra);
    }
  }

  getCurrentCraFromContext() {
    this.logger.debug("DBG: getCurrentCraFromContext: ", this.currentCra)
    this.beforeCallServer(this.title)
    this.dataSharingService.getCurrentCraContext()
      .subscribe(
        (context) => {
          this.afterCallServer(this.title, context)
          ////////this.logger.debug("+++ ngOnit context", context);
          if (context != null) {
            // //////////this.logger.debug("DBG: cra-form-cal: context non NULL: context: ", context)
            this.currentCra = context.cra;
            this.events = context.events;
            this.viewDate = context.viewDate;
            if (this.notADate(this.viewDate)) this.viewDate = new Date();
            this.viewDate = this.utils.getDate(this.viewDate);
            this.dataSharingService.onCraDestroy();
            this.statusHistoJsonToTab()

          }
          // //////////this.logger.debug("DBG: cra-form-cal: ngOnint(): FIN currentCra: ", this.currentCra)

        }, error => {
          this.addErrorFromErrorOfServer(this.title, error);
          //////////this.logger.debug("+++ ngOnit error:", error);
        }
      )
  }

  findConsultantOfCurrentCra() {
    this.logger.debug("DBG: findConsultantOfCurrentCra: ", this.currentCra)
    let username: string = this.currentCra.consultant?.username;
    if (username != null) {
      this.beforeCallServer("findConsultantByUsername")
      this.dataSharingService.findConsultantByUsername(username,
        (data, user) => {
          this.afterCallServer("findConsultantByUsername", data)
          this.currentCraUser = user;

          this.findAllActivities();

        },
        (error) => {
          this.addErrorFromErrorOfServer("findConsultantByUsername", error);
        }
      );

    } else {

    }
  }


  /****
   * used to retrieve cra activity
   */
  private findAllActivities() {
    let label = "+++ findAllActivities"
    if (!this.currentCraUser) this.currentCraUser = this.currentCra?.consultant
    if (!this.currentCraUser) this.currentCraUser = this.userConnected

    this.logger.debug(label + " deb currentCraUser : ", this.currentCraUser);
    let info_id = label + " currentCraUser : " + this.currentCraUser?.fullName
    this.beforeCallServer(info_id);
    this.activityService.findAllByConsultant(this.currentCraUser.id).subscribe(
      data => {
        this.afterCallServer(info_id, data)
        this.logger.debug(label + " data : ", data);
        if (data == null) {
          this.activities = new Array();
        } else {
          this.activities = data.body.result;
          let list = []
          for (let ac of this.activities) {
            if (ac.valid == true) {
              if (this.typeCra == "CONGE") {
                let type = ac.type
                let typeName = ac.typeName ? ac.typeName : type?.name;
                if (!typeName) typeName = "";
                if (typeName.includes("CONG") || ac.name.includes("CONG")) {
                  list.push(ac)
                }
              } else {
                list.push(ac)
              }
            }
          }
          this.activities = list;
        }

        if (this.isAdd == 'true') {

          if (this.typeCra == 'CONGE') {
            this.currentCra.type = 'CONGE';
          } else {
            this.currentCra.type = 'CRA';
          }

          this.viewDateChange(false);

        } else {

          this.currentCra = this.dataSharingService.getCurrentCra();

          if (!this.currentCra) {
            this.currentCra = this.craService.getCra();
          }
          this.initCra(this.currentCra);
          this.btnActionTitle = "UPDATE " + this.getNameByType();
        }
        //
        this.process();
        this.refreshMe();
      }, error => {
        this.addErrorFromErrorOfServer(info_id, error);
      }
    );
  }

  /***
   * Used to initialized cra
   */
  initCra(currentCra: Cra) {
    if (currentCra != null && currentCra.craDays != null) {
      this.deleteCraDayActivitiesOfActivityNullInCra(currentCra)
      this.viewDate = currentCra.month;
      // this.logger.debug("+++ initCra currentCra.month", currentCra.month);
      if (this.notADate(this.viewDate)) this.viewDate = new Date();
      this.viewDate = this.utils.getDate(this.viewDate);
      // Charger les jours fériés (dont congés perso + labels) du mois du CRA dès l'ouverture.
      this.craService.majHolidays(this.viewDate);
      // this.logger.debug("+++ initCra viewDate", this.viewDate);
      this.events = [];
      // this.logger.debug("+++ initCra currentCra.craDays", currentCra.craDays);
      currentCra.craDays.forEach((craDay, k) => {
        if (craDay.craDayActivities != null) {
          craDay.craDayActivities.forEach((craActivity, index) => {
            // ////////this.logger.debug("+++ initCra av setEvent v, value:", v, value);
            this.setEvent(craDay, craActivity, false);
            // this.logger.debug("+++ initCra ap setEvent craDay, index, craActivity : ", craDay, index, craActivity);
          })
        }
      })

      this.initDatesDebFinMultiDates();

      this.statusHistoJsonToTab()

      this.craService.majNewCra(this.currentCra, this.viewDate);

    }
  }

  addActivitiesOfCra(cra: Cra) {
    cra.craDays.forEach((craDay, k) => {
      this.craDay = this.getNewCraDayFrom(craDay);
      let isSet = this.craService.setCraDayInCraByDate(this.currentCra, this.craDay.day, this.craDay, false)
    })

  }

  getNewCraDayActivityFrom(craDayActivity: CraDayActivity): CraDayActivity {
    this.logger.debug("getNewCraDayActivityFrom DEB craDayActivity=", craDayActivity)
    let cda = new CraDayActivity();
    cda.activity = craDayActivity.activity;
    cda.endHour = craDayActivity.endHour;
    cda.isOverTime = craDayActivity.isOverTime;
    cda.nbDay = craDayActivity.nbDay;
    cda.startHour = craDayActivity.startHour;

    this.logger.debug("getNewCraDayActivityFrom FIN cda=", cda)
    return cda;
  }

  getNewCraDayFrom(craDay: CraDay): CraDay {
    this.logger.debug("getNewCraDayFrom DEB this.currentCra=", this.currentCra)
    let cd = new CraDay();
    cd.craDayActivities = []
    cd.day = craDay.day;
    cd.dayAbs = craDay.dayAbs;
    cd.dayBill = craDay.dayBill
    cd.isDayWorked = craDay.isDayWorked
    cd.type = craDay.type
    cd.createdAt = new Date()

    if (craDay.craDayActivities != null) {
      for (let i = 0; i < craDay.craDayActivities.length; i++) {
        this.craDayActivity = this.getNewCraDayActivityFrom(craDay.craDayActivities[i]);
        //////this.logger.debug("craDayActivity", i, craDayActivity)
        this.addActivity(this.craDayActivity, cd, false);
      }
      this.process();
    }

    this.logger.debug("getNewCraDayFrom FIN cd=", cd)
    return cd;
  }

  notADate(date: Date): boolean {
    return !date || date + "" == "Invalid Date";
  }

  setMonthCurentCraIfNull() {
    if (this.notADate(this.viewDate)) this.viewDate = new Date();
    if (this.notADate(this.currentCra.month)) this.currentCra.month = this.viewDate;
  }

  viewDateChange(isClearInfos: boolean) {

    let label = "viewDateChange"

    this.logger.debug(label + " deb viewDate:", this.viewDate)

    if (isClearInfos) this.clearInfos();

    this.btnActionTitle = "SAVE " + this.getLabelByType();

    if (this.notADate(this.viewDate)) this.viewDate = new Date();
    this.viewDate = this.utils.getDate(this.viewDate);

    this.logger.debug(label + " after : viewDate:", this.viewDate)

    this.craService.majHolidays(this.viewDate);

    // this.viewDate est un objet Date au 1er
    this.initDatesDebFinMultiDates();

    /**
     * si existe un cra validee , afficher le
     */

    let craInDateView: Cra = this.craService.getCraInDate(this.viewDate, this.dataSharingService.getListCra());

    if (craInDateView != null) {


      this.statusHistoJsonToTab()

      this.craService.majNewCra(this.currentCra, this.viewDate);

      this.showCra(craInDateView);

      // this.addErrorTitleMsg("Error Add " + this.getLabelByType(), "On ne peut pas ajouter un nouveau "+this.getLabelByType+" lorsqu'il y'a deja un CRA valide ce mois-ci !")



    } else {
      this.beforeCallServer(label)

      this.craService.getNewCraOfDate(this.viewDate).subscribe(
        data => {
          this.afterCallServer(label, data)
          if (data != null && data.body != null && data.body.result != null) {
            this.currentCra = data.body.result;
            this.craService.majNewCra(this.currentCra, this.viewDate);

            this.statusHistoJsonToTab()

            // this.logger.debug("monthStr = " + this.currentCra.monthStr )
            // this.currentCra.month = new Date(this.currentCra.monthStr);
            this.setMonthCurentCraIfNull();
          } else {
            this.currentCra = new Cra();
            this.setMonthCurentCraIfNull();
            this.events = [];
            this.craService.majNewCra(this.currentCra, this.viewDate);
          }

          if (!this.getError() || this.getError().length == 0) {
            this.setMonthCurentCraIfNull();

            let craContext: CraContext = new CraContext();

            let month = this.utils.getDate(this.currentCra.month);
            craContext.cra = this.currentCra;
            craContext.viewDate = month;
            craContext.events = [];
            this.dataSharingService.onCraInit(craContext);
            // this.router.navigate(["/cra_form"])
            ////////this.logger.debug("showCra fin", cra)

            this.addCongesValidOfDate(this.viewDate);

            this.initCra(this.currentCra);
            this.craService.majNewCra(this.currentCra, this.viewDate);
            this.process();
            this.refreshMe();

          } else {
            for (let error of this.getError()) {
              this.addErrorFromErrorOfServer(label, error);
            }
          }
        }, error => {
          this.addErrorFromErrorOfServer(label, error);
        })
    }

  }

  private initDatesDebFinMultiDates() {
    this.addMultiDateStartDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);

    // Calcul de la dernière date du mois de this.viewDate
    this.addMultiDateEndDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
  }

  showCra(cra: Cra) {

    this.currentCra = cra;

    // this.findConsultantOfCurrentCra();

    this.initCra(this.currentCra);
    this.process();
    this.refreshMe();
  }

  addCongesValidOfDate(date: Date) {
    this.logger.debug("add_conges_of_date this.currentCra=", this.currentCra)
    let listCra: Cra[] = []
    // let listConge : Cra[] = []
    let month = this.datePipe.transform(date, 'yyyy-MM');

    let label = "getValidatedCraByConsultantAndDate";
    this.beforeCallServer(label);
    this.craService.getValidatedCraByConsultantAndDate(this.currentCraUser.username, month).subscribe(
      (data) => {
        this.afterCallServer(label, data);
        //////this.logger.debug("data:", data)
        listCra = data.body.result;
        //////this.logger.debug("listCra:", listCra)
        // if (!this.isError && !this.utils.isListEmpty(listCra) ) listCra = listCra.sort((a, b) => this.compareCraDesc(a, b))
        if (listCra) {
          for (let cra of listCra) {
            if (cra.type == "CONGE") {
              //listConge.push(cra);
              //TODO 
              this.addActivitiesOfCra(cra)
            }
          }
        }

      }, (error) => {
        this.addErrorFromErrorOfServer(label, error);
        //this.logger.debug(error);
      }
    );
  }

  errorDates = "";
  onStartDateInputChanged(date: Date, error: string) {
    this.logger.debug("onStartDateInputChanged this.currentCra=", this.currentCra)
    this.addMultiDateStartDate = date;
    this.errorDates = error;
    ////////////this.logger.debug("main onChangeDateDeb myDatePickerDeb", date, error);
    if (this.errorDates) {
      this.utils.showNotification("error", this.utils.tr('app.compo.cra.addMultiDate.error.endDateBeforeStart'))
    }
  }

  onEndDateInputChanged(date: Date, error: string) {
    this.logger.debug("onEndDateInputChanged this.currentCra=", this.currentCra)
    // this.addMultiDateEndDate=new Date(date.getTime() + 24*60*60*1000);  //debug du fin-1
    this.addMultiDateEndDate = date;
    this.errorDates = error;
    ////////////this.logger.debug("main onChangeDateDeb myDatePickerDeb", date, error);
    if (this.errorDates) {
      this.utils.showNotification("error", this.utils.tr('app.compo.cra.addMultiDate.error.endDateBeforeStart'))
    }
  }

  getTypeDay(dayDate: Date) {
    // this.logger.debug("*** getTypeDay deb", dayDate)

    let type = "";
    if (this.currentCra) {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay = this.currentCra.craDays[i];
        if (this.utils.formatDate(craDay.day) == this.utils.formatDate(dayDate)) {
          type = craDay.type
          // //////////this.logger.debug("*** getTypeDay fin1", type)
          return type
        }
      }
    }
    // //////////this.logger.debug("*** getTypeDay fin2", type)
    return type;
  }

  isDayConge(dayDate: Date) {
    // this.logger.debug("*** isDayConge deb", dayDate)
    let isDayConge = false;
    if (this.currentCra) {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay = this.currentCra.craDays[i];
        if (this.utils.formatDate(craDay.day) == this.utils.formatDate(dayDate)) {
          for (let i = 0; i < craDay.craDayActivities.length; i++) {
            let cda: CraDayActivity = craDay.craDayActivities[i];
            let activity: Activity = cda.activity;
            let activityType: ActivityType = activity ? activity.type : null;
            let activityTypeName: string = activityType ? activityType.name : "";
            if (activityType && activityType.congeDay) {
              isDayConge = true;
              // //////////this.logger.debug("*** isDayConge fin1", isDayConge)
              return isDayConge;
            }
          }
          // //////////this.logger.debug("*** isDayConge fin2", isDayConge)
          return isDayConge;
        }
      }
    }
    // //////////this.logger.debug("*** isDayConge fin3", isDayConge)
    return isDayConge;
  }

  isDayBilled(dayDate: Date) {
    // this.logger.debug("*** getTypeActivity dayDate", dayDate)
    let res = false;
    if (this.currentCra) {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay = this.currentCra.craDays[i];
        if (this.utils.formatDate(craDay.day) == this.utils.formatDate(dayDate)) {
          let firstActivity = true;
          for (let i = 0; i < craDay.craDayActivities.length; i++) {
            let cda: CraDayActivity = craDay.craDayActivities[i];
            let activity: Activity = cda.activity;
            let activityType: ActivityType = activity ? activity.type : null;
            let activityTypeName: string = activityType ? activityType.name : "";
            // ////////this.logger.debug("*** getTypeActivity dayDate: ", dayDate)
            // ////////this.logger.debug("*** getTypeActivity activityType ", activityType)
            // ////////this.logger.debug("*** getTypeActivity activityTypeName: ", activityTypeName)
            if (activityType) {
              if (firstActivity) {
                res = true;
                firstActivity = false;
              }

              res = res && activityType.billDay;
            }
          }
          // //////////this.logger.debug("*** isDayConge fin2", isDayConge)
          return res;
        }
      }
    }
    // //////////this.logger.debug("*** isDayConge fin3", isDayConge)
    return res;
  }

  getClassOfDay(day) {
    let type = this.getTypeDay(day);
    const dayDate: Date = day?.date instanceof Date ? day.date : new Date(day?.date);

    // Vérifier si c'est un jour férié (national ou perso API) — priorité maximale
    const isNationalHoliday = !isNaN(dayDate?.getTime()) && this.utils.isDateHolidayNational(dayDate, 'fr');
    const persoHolidays = this.craService.craConfigurationData?.holidays;
    const isPersoHoliday = persoHolidays?.length > 0 && !isNaN(dayDate?.getTime())
      && this.utils.isDateHolidayPerso(dayDate, persoHolidays);

    if (type == 'HOLIDAY' || isNationalHoliday || isPersoHoliday) {
      return 'holiday';
    }

    if (type == 'CONGE_PAYE') {
      return 'conge';
    }

    // 'free' uniquement pour les jours ouvrés non facturés (jamais pour les jours fériés)
    if (this.isDayInViewMonth(day) && !this.isDayBilled(day)) {
      return 'free';
    }

    let isDayConge = this.isDayConge(day);
    if (isDayConge) return 'conge';

    return 'cal-cell-normal';
  }

  getHolidayPersoLabel(day): string | null {
    const dayDate: Date = day?.date instanceof Date ? day.date : new Date(day?.date);
    if (!dayDate || isNaN(dayDate.getTime())) return null;

    const config = this.craService.craConfigurationData;
    const persoHolidays = config?.holidays;
    if (!persoHolidays?.length && !config?.holidayLabels) return null;

    const dd = dayDate.getDate().toString().padStart(2, '0');
    const mm = (dayDate.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = dayDate.getFullYear();
    const dateKey = `${dd}-${mm}-${yyyy}`;
    const dateKeyIso = `${yyyy}-${mm}-${dd}`;

    const labelFromMap = config?.holidayLabels?.[dateKey]
      || config?.holidayLabels?.[dateKeyIso];
    if (labelFromMap && labelFromMap.trim() !== 'Congé perso') return labelFromMap;

    // Fallback: matcher les clés map en tolérant les formats dd-MM-yyyy / yyyy-MM-dd et UTC.
    if (config?.holidayLabels) {
      for (const mapKey of Object.keys(config.holidayLabels)) {
        if (!mapKey) continue;

        let parsed: Date = null;
        const ddMmYyyy = mapKey.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        const yyyyMmDd = mapKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (ddMmYyyy) {
          parsed = new Date(Number(ddMmYyyy[3]), Number(ddMmYyyy[2]) - 1, Number(ddMmYyyy[1]));
        } else if (yyyyMmDd) {
          parsed = new Date(Number(yyyyMmDd[1]), Number(yyyyMmDd[2]) - 1, Number(yyyyMmDd[3]));
        }

        if (!parsed || isNaN(parsed.getTime())) continue;

        const sameLocal = parsed.getDate() === dayDate.getDate()
          && parsed.getMonth() === dayDate.getMonth()
          && parsed.getFullYear() === dayDate.getFullYear();

        if (sameLocal) {
          const mapLabel = config.holidayLabels[mapKey];
          if (mapLabel && mapLabel.trim() !== 'Congé perso') return mapLabel;
        }
      }
    }

    if (!persoHolidays?.length) return null;

    // Compat: certains payloads renvoient les labels directement dans holidays [{date,label}] (ou variantes date/day/dayDate).
    for (const holiday of persoHolidays) {
      const holidayDate = this.utils.getDate((holiday as any)?.date ?? (holiday as any)?.day ?? (holiday as any)?.dayDate ?? holiday);
      if (!holidayDate || isNaN(holidayDate.getTime())) continue;

      if (holidayDate.getDate() === dayDate.getDate()
        && holidayDate.getMonth() === dayDate.getMonth()
        && holidayDate.getFullYear() === dayDate.getFullYear()) {
        const payloadLabel = (holiday as any)?.label || (holiday as any)?.title || (holiday as any)?.name;
        if (payloadLabel && payloadLabel.trim() !== 'Congé perso') return payloadLabel;
        return null;
      }
    }
    return null;
  }


  getWidthDivsEntete() {
    let w = this.widthDevisEntete;
    // if(this.isAdd && this.getConsultant(this.currentCra) == null ) w="33%"
    // if(this.isAdd && this.getConsultant(this.currentCra) != null ) w="33%"
    // if(!this.isAdd && this.getConsultant(this.currentCra) != null ) w="33%"
    // //this.logger.debug(w)
    return w;
  }

  isDayInViewMonth(day) {
    // this.logger.debug("isDayInViewMonth this.currentCra=", this.currentCra)
    if (day) {
      return this.viewDate.getMonth() == this.utils.getDate(day).getMonth();
    } else {
      return false;
    }
  }

  /***
   * the action listener of the day clicked
   * { day, events }: { day: Date; events: CalendarEvent[] }
   * @param day
   */
  dayClicked(day: any, events: any, event: any): void {
    this.daySelected = day;
    this.daySelectedStr = this.utils.formatDate(day)
    this.dateOfDaySelected = this.daySelected.date;

    this.viewDate = this.utils.getDate(this.viewDate)
    this.isDaySelectedInCurentMonth = this.isDayInViewMonth(this.dateOfDaySelected);

    if (!this.currentCra.validByConsultant || this.currentCra.type != 'CRA') {
      this.craDay = this.craService.getCraDayByDate(this.currentCra, this.daySelected);
      if (this.craDay) {
        if (this.craDay.craDayActivities.length == 0) {
          this.craDayActivityNew();
        } else {
          this.modal.open(this.dayDetailView, { size: 'lg' });
        }
      }
    } else {
      this.utilsIhm.info(this.utils.tr('app.compo.cra.form.alreadyValidatedReadonly'), null, null);
    }
  }

  isEnableAddCraActivity(): boolean {
    if (!this.craDay || !this.craDay.craDayActivities) {
      return true;
    }

    let craDayActivities: CraDayActivity[] = this.craDay.craDayActivities;
    if (craDayActivities.length === 0) {
      return true;
    }

    let numberDays: number = 0;
    for (let value of craDayActivities) {
      numberDays += value.nbDay;
    }

    return numberDays < 1;
  }

  craDayActivityNew(): void {
    if (!this.isDaySelectedInCurentMonth) return;

    this.craDayActivity = new CraDayActivity()
    this.craDayActivity.nbDay = 1;
    this.activityErrorMessage = ''; // Réinitialiser le message d'erreur
    this.modal.open(this.addActivityView, { size: 'lg' });
  }

  // // this.craDayActivity.startHour = this.currentCra.monthStr
  // this.craDayActivity.startHour = "01/09/2025"
  // this.craDayActivity.startHour = "30/09/2025"

  addMultiActivity() {

    this.logger.debug("addMultiActivity this.currentCra=", this.currentCra)

    this.isAddMultiDate = true;
    this.isDaySelectedInCurentMonth = true;

    this.craDayActivity = new CraDayActivity()
    this.craDayActivity.nbDay = 1

    // this.addMultiDateStartDate = this.viewDate
    // this.addMultiDateEndDate = this.viewDate

    this.logger.debug("---- addMultiActivity: addMultiDateStartDate ", this.addMultiDateStartDate)

    let refModal = this.modal.open(this.addActivityView, { size: 'lg' });
    refModal.result.then((result) => {
      this.isEditCraActivity = false
      this.isAddMultiDate = false;
      this.isDaySelectedInCurentMonth = false;
      ////////////this.logger.debug("EXIIIIIIIIT NORMAL")
      this.craService.setEventTitle(this.craDay, this.events);
    }, (reason) => {
      this.isEditCraActivity = false
      this.isAddMultiDate = false;
      this.isDaySelectedInCurentMonth = false;
      ////////////this.logger.debug("EXIIIIIIIIT AUTRE")
      this.craService.setEventTitle(this.craDay, this.events);
    });
  }

  addMultiActivityForDay() {
    this.modal.dismissAll(this.dayDetailView);

    this.isAddMultiDate = true;
    this.isDaySelectedInCurentMonth = true;

    this.craDayActivity = new CraDayActivity()
    this.craDayActivity.nbDay = 1

    // Pré-remplir les dates avec le jour sélectionné
    if (this.craDay && this.craDay.day) {
      this.addMultiDateStartDate = new Date(this.craDay.day);
      this.addMultiDateEndDate = new Date(this.craDay.day);
    }

    this.logger.debug("---- addMultiActivityForDay: addMultiDateStartDate ", this.addMultiDateStartDate)

    let refModal = this.modal.open(this.addActivityView, { size: 'lg' });
    refModal.result.then((result) => {
      this.isEditCraActivity = false
      this.isAddMultiDate = false;
      this.isDaySelectedInCurentMonth = false;
      this.craService.setEventTitle(this.craDay, this.events);
    }, (reason) => {
      this.isEditCraActivity = false
      this.isAddMultiDate = false;
      this.isDaySelectedInCurentMonth = false;
      this.craService.setEventTitle(this.craDay, this.events);
    }
    );

  }

  craDayActivityEdit(craDayActivity: CraDayActivity) {

    this.isEditCraActivity = true
    this.craDayActivity = craDayActivity;
    this.activityErrorMessage = ''; // Réinitialiser le message d'erreur

    let refModal = this.modal.open(this.addActivityView, { size: 'lg' });
    refModal.result.then((result) => {
      this.isEditCraActivity = false
      this.activityErrorMessage = ''; // Réinitialiser le message d'erreur
      this.craService.setEventTitle(this.craDay, this.events);
    }, (reason) => {
      this.isEditCraActivity = false
      this.activityErrorMessage = ''; // Réinitialiser le message d'erreur
      this.craService.setEventTitle(this.craDay, this.events);
    }
    );
  }

  getTitleAddCraDayActivity() {

    // this.logger.debug("getTitleAddCraDayActivity this.currentCra=", this.currentCra)

    let name = this.getNameByType();
    let month = this.utils.formatDateToMonth(this.viewDate);

    if (this.isEditCraActivity) {
      return "Edit " + name + " Day Activity of " + month;
    } else return this.utils.tr("ADD_NEW") + " " + name + " " + this.utils.tr("DAY_ACTIVITY_OF") + " " + month;
  }

  craDayActivityDelete(index: number) {
    let craActivity: CraDayActivity = this.craDay.craDayActivities[index];

    let indexEvent = this.craService.getIndexEventOfCraActivity(this.craDay, craActivity, this.events)

    if (indexEvent >= 0) {
      this.craDay.craDayActivities.splice(index, 1)
      // maj des times :
      this.craService.setNbDay(this.craDay);
      //refresh view
      this.events.splice(indexEvent, 1);

      this.craService.setEventTitle(this.craDay, this.events);

      //save
      this.currentCra = this.craService.updateCraDay(this.currentCra, this.craDay);
      this.process();
      this.refreshMe();
    }

  }

  deleteCraDayActivitiesOfActivityNullInCra(cra: Cra) {
    if (cra != null && cra.craDays != null) {
      for (let i = 0; i < cra.craDays.length; i++) {
        this.deleteCraDayActivitiesOfActivityNull(cra.craDays[i])
      }
    }
  }

  deleteCraDayActivitiesOfActivityNull(craDay: CraDay) {
    if (craDay != null && craDay.craDayActivities != null) {
      craDay.craDayActivities = craDay.craDayActivities.filter(cda => cda.activity != null);
    }
  }

  gotoCraList() {

    this.logger.debug("gotoCraList this.currentCra=", this.currentCra)

    this.clearInfos();
    this.router.navigate(['/cra_list']);
  }

  /****
   * used to persist or update cra/conge
   */
  saveCra(redirectToList: boolean, isSendNotification: boolean, title, message): void {

    this.logger.debug("saveCra isSendNotification, currentCra : ", isSendNotification, this.currentCra)

    if (!this.currentCra.consultant && this.currentCra.status != 'REJECTED' && this.currentCra.status != 'VALIDATED') {
      this.currentCra.consultant = this.userConnected;
      this.logger.debug("+++ saveCra : change 01 of consultant of currentCra ", this.currentCra)
    }
    this.setCurrentCraConsultantId()

    this.setMonthCurentCraIfNull();

    // this.consultantService.majCra(this.currentCra);
    if (!this.currentCra.consultant) {
      this.logger.debug("+++ saveCra : cat No consultant of currentCra ")
      this.consultantService.findById(this.currentCra.consultantId).subscribe(
        data => {
          this.logger.debug("+++ saveCra : set consultant ", data)
          this.currentCra.consultant = data.body.result;
          this.logger.debug("+++ saveCra : after call server consultant of currentCra is : ", this.currentCra.consultant)
          this.logger.debug("+++ saveCra : change 04 of consultant of currentCra ", this.currentCra)

          this.saveCraDirect(redirectToList, isSendNotification, title, message);
        },
        error => {
          this.logger.debug("ERROR +++ saveCra : set consultant err", error)
          this.isToRejectCra = false
          this.isToValidateCra = false
        }
      );
    } else {
      this.logger.debug("+++ saveCra : cat consultant of currentCra Not Null : ", this.currentCra.consultant)
      this.saveCraDirect(redirectToList, isSendNotification, title, message);
    }


  }

  /****
 * used to persist or update cra/conge
 */
  saveCraDirect(redirectToList: boolean, isSendNotification: boolean, title, message): void {

    const label = "saveCraDirect"

    this.logger.debug(label + " DEB this.currentCra, consultant : ", this.currentCra, this.currentCra.consultant)
    this.logger.debug(label + " isSendNotification=", isSendNotification)
    //////////////////////////

    if (this.typeCra == 'CONGE') {
      this.currentCra.type = 'CONGE';
    } else {
      this.currentCra.type = 'CRA';
    }

    if (!this.isCraValid(true) && this.currentCra.status != 'REJECTED') {
      this.logger.debug(label + " : isCraValid = KO !! this.currentCra=", this.currentCra)
      this.isToRejectCra = false
      this.isToValidateCra = false
      return;
    }

    // Force month to noon (12:00:00) to avoid backend timezone issues
    // if (this.currentCra.month) {
    //   const date = new Date(this.currentCra.month);
    //   date.setDate(15);
    //   date.setHours(12, 0, 0, 0);
    //   this.currentCra.month = date;
    //   this.logger.debug(label + " month forced to noon: ", this.currentCra.month);
    // }

    this.currentCra.month = this.utils.getDate15DayMidi(this.currentCra.month)

    this.logger.debug(label + " before save currentCra : ", this.currentCra)

    this.beforeCallServer(label)
    this.craService.save(this.currentCra).subscribe(
      data => {
        this.logger.debug(label, data)
        this.afterCallServer(label, data)

        this.currentCra = data.body.result
        this.logger.debug(label + " after save currentCra : ", this.currentCra)
        this.statusHistoJsonToTab()
        this.dataSharingService.majConsultantInCra(this.currentCra,
          () => {
            this.logger.debug(label + " : change 05 of consultant of currentCra ", this.currentCra.consultant)
            this.logger.debug(label + " : currentCraUser.id ", this.currentCraUser.id)
            this.logger.debug(label + " : currentCra.consultant.id ", this.currentCra.consultant.id)
            this.logger.debug(label + " : currentCraUser.role ", this.currentCraUser.role)

            this.addToList(this.currentCra)

            this.logger.debug(label + " this.isError()=", this.isError())
            this.logger.debug(label + " isSendNotification=", isSendNotification)

            this.logger.debug(label + " ap call server this.currentCra, consultant : ", this.currentCra, this.currentCra.consultant)

            if (!this.isError() && isSendNotification) this.sendNotification(title, message);
            if (!this.isError() && redirectToList) this.gotoCraList()
          }
        )

      }, error => {
        this.logger.debug(label + " error=", error)
        this.addErrorFromErrorOfServer(label, error);
      })

    /////////////////////////////////////

    this.logger.debug("++++ saveCraDirect FIN this.currentCra, consultant : ", this.currentCra, this.currentCra.consultant)

  }

  addToList(cra: Cra) {
    const list = this.dataSharingService.getListCra();
    if (cra && list) {
      const index = list.findIndex(item => item.id === cra.id);
      if (index < 0) {
        list.push(cra);
      } else {
        list[index] = cra;
      }
      // Notifier les subscribers de la mise à jour
      this.dataSharingService.setListCra(list);
    }
  }

  canDeleteCurrentCra() {
    let cond = !this.currentCra.validByConsultant && this.currentCra.id != null;

    if (this.dataSharingService.isCurrenUserRespOrAdmin()) {
      return this.currentCra.id != null;
    } else {
      return cond;
    }

  }

  canValidateCraOrConge() {

    let label = "canValidateCraOrConge"

    this.logger.debug(label + " this.hasRoleManagerValidate()=", this.hasRoleManagerValidate())
    this.logger.debug(label + " this.currentCra.validByManager=", this.currentCra.validByManager)
    this.logger.debug(label + " this.isTimeToModify()=", this.isTimeToModify())
    this.logger.debug(label + " this.isCraOfManagerRole()=", this.isCraOfManagerRole())

    let res = this.hasRoleManagerValidate() && !this.currentCra.validByManager && this.isTimeToModify() && !this.isCraOfManagerRole();

    this.logger.debug(label + " res=", res)

    return res;

  }

  canSubmitCra() {
    let label = "canSubmitCra"
    let res = (!this.currentCra?.validByConsultant) && this.hasManager() && this.currentCra.consultant?.id == this.userConnected.id;
    this.logger.debug(label + " currentCra?.validByConsultant=", this.currentCra?.validByConsultant)
    this.logger.debug(label + " res=", res)
    return res;
  }

  maj_canSubmitCra() {
    this.is_canSubmitCra = this.canSubmitCra();
  }


  sendNotification(title, message) {

    this.logger.debug("sendNotification this.currentCra=", this.currentCra)

    let isManager = this.hasRoleManagerValidate();
    let currentUser = this.userConnected;
    // let currentUser = this.currentCra.consultant
    this.logger.debug("sendNotification currentUser=", currentUser)
    this.logger.debug("sendNotification currentUser.role=", currentUser.role)

    this.logger.debug("sendNotification this.userConnected=", this.userConnected)
    this.logger.debug("sendNotification this.userConnected.role=", this.userConnected.role)

    if (!this.currentCra.consultant) {
      this.currentCra.consultant = currentUser
      this.logger.debug("+++ saveCra : change 06 of consultant of currentCra ", this.currentCra)
    }

    if (!currentUser.adminConsultant) {
      currentUser.adminConsultant = this.userConnected.adminConsultant
    }

    if (!currentUser.adminConsultant) {
      currentUser.adminConsultant = this.currentCra.manager
    }

    let notification: Notification = new Notification();

    notification.createdDate = new Date();
    notification.viewed = false;
    notification.title = title;
    notification.message = message;
    notification.cra = this.currentCra;
    notification.craId = this.currentCra.id;

    notification.fromUser = currentUser
    notification.fromUsername = notification.fromUser.username

    this.logger.debug("sendNotification fromUser : ", notification.fromUser)

    // Déterminer le destinataire selon le statut du CRA
    let toUser: any;
    this.logger.debug("sendNotification currentCra.status=", this.currentCra.status)

    if (this.currentCra.status === 'TO_VALIDATE') {
      // Consultant envoie → notifier son manager
      toUser = currentUser.adminConsultant || currentUser;
      this.logger.debug("sendNotification: Consultant envoie au manager");
    } else if (this.currentCra.status === 'VALIDATED' || this.currentCra.status === 'REJECTED') {
      // Manager valide/rejette → notifier le consultant du CRA
      toUser = this.currentCra.consultant;
      this.logger.debug("sendNotification: Manager notifie le consultant");
    } else {
      // Défaut: si consultant, envoyer au manager; sinon au consultant du CRA
      toUser = currentUser.adminConsultant != null ? currentUser.adminConsultant : this.currentCra.consultant;
      this.logger.debug("sendNotification: Cas par défaut");
    }

    notification.toUser = toUser
    this.logger.debug("sendNotification toUser final : ", notification.toUser)

    notification.toUsername = notification.toUser.username

    this.logger.debug("sendNotification isManager=", isManager)
    this.logger.debug("sendNotification currentUser=", currentUser)
    this.logger.debug("sendNotification currentCra.consultant=", this.currentCra.consultant)
    this.logger.debug("sendNotification currentCra.consultant.adminConsultant=", this.currentCra.consultant.adminConsultant)
    this.logger.debug("sendNotification notification=", notification)

    this.beforeCallServer("sendNotification")
    this.dataSharingService.addNotificationServer(notification).subscribe((data) => {
      this.afterCallServer("sendNotification", data)
      this.dataSharingService.getNotifications(null, null);

    }, error => {
      this.addErrorFromErrorOfServer("sendNotification", error);

    })

  }

  /****
   * used to remove current cra
   * @param myObj
   */
  delete(myObj: Cra) {
    this.logger.debug("delete this.currentCra=", this.currentCra)
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.compo.cra.list.confirmDelete') + myObj.id, mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.craService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!mythis.isError()) {
                // mythis.findAll();
                mythis.currentCra = null;
                mythis.gotoCraList()
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

  onSelectActivity(activity: Activity) {
    this.craDayActivity.activity = activity;
  }

  @ViewChild('compoSelectActivity', { static: false }) compoSelectActivity: SelectComponent;
  selectActivity(activity: Activity) {
    this.compoSelectActivity.selectedObj = activity;
  }

  /**
   * 
   * @param craDayActivity 
   * @param craDay 
   * @param isLanceProcess 
   */
  addActivity(craDayActivity: CraDayActivity, craDay: CraDay, isLanceProcess: boolean) {

    if (craDayActivity != null && craDayActivity.activity != null) {

      if (!craDay.craDayActivities) {
        craDay.craDayActivities = []
      }

      // Calculer le temps total actuel des activités du jour
      let currentTime = 0;
      for (let existingActivity of craDay.craDayActivities) {
        currentTime += existingActivity.nbDay;
      }

      // Vérifier que l'ajout de la nouvelle activité ne dépasse pas 1 jour
      if (currentTime + craDayActivity.nbDay > 1) {
        this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.dayCannotExceedOne'), null, null);
        return;
      }

      craDay.craDayActivities.push(craDayActivity);
      this.setEvent(craDay, craDayActivity);

      this.craService.setDayProps(craDay);

      if (isLanceProcess) {
        this.process();
      }
    }

  }

  /***
   * Returns msg error if the given day falls 
   * If no return null 
   * 
   */
  isActivityValidForDay(activity: Activity, day: any): string {
    if (!activity) {
      return "activity is null";
    }
    if (!activity.dateDeb && !activity.dateFin) {
      return "activity has no date constraints";
    }
    const d = this.utils.getDate(day);
    if (activity.dateDeb) {
      const deb = this.utils.getDate(activity.dateDeb);
      if (d < deb) {
        return "activity is before dateDeb";
      }
    }
    if (activity.dateFin) {
      const fin = this.utils.getDate(activity.dateFin);
      if (d > fin) {
        return "activity is after dateFin";
      }
    }

    if (!activity.isWorkInWE && this.utils.isDayInWE(day)) {
      return "activity is not allowed in weekend";
    }

    return null;
  }

  /***
   * used to add new cra day activity
   */
  addCurrentActivity() {
    this.activityErrorMessage = ''; // Réinitialiser le message d'erreur

    if (!this.isAddMultiDate) {
      if (this.craDayActivity != null && !this.isEditCraActivity) {

        let msgError = this.isActivityValidForDay(this.craDayActivity.activity, this.craDay.day)

        if (msgError) {
          const act = this.craDayActivity.activity;
          if (act) {
            const debStr = act.dateDebFr || (act.dateDeb ? this.datePipe.transform(act.dateDeb, 'dd/MM/yyyy') : '?');
            const finStr = act.dateFinFr || (act.dateFin ? this.datePipe.transform(act.dateFin, 'dd/MM/yyyy') : '?');
            let msg = msgError || "Activity is not valid for this day";
            msg += "\n\n" + this.utils.tr('app.compo.cra.form.activity.invalidForDate', {
              name: act.name || '',
              deb: debStr,
              fin: finStr,
            })
            this.activityErrorMessage = msg;
          } else {
            this.activityErrorMessage = msgError || "Activity is not valid for this day";
          }
          return;
        }

        // Vérifier que l'ajout ne dépasse pas 1 jour
        let currentTime = 0;
        if (this.craDay.craDayActivities) {
          for (let existingActivity of this.craDay.craDayActivities) {
            currentTime += existingActivity.nbDay;
          }
        }

        if (currentTime + this.craDayActivity.nbDay > 1) {
          this.activityErrorMessage = this.utils.tr('app.compo.cra.form.validation.dayCannotExceedOne');
          return;
        }

        this.addActivity(this.craDayActivity, this.craDay, true);

        this.craDayActivity = new CraDayActivity();
        this.refreshMe();
        this.modal.dismissAll(this.dayDetailView);
      }

      if (this.isEditCraActivity) {
        // Pour l'édition, calculer le temps total sans l'activité actuelle
        let currentTime = 0;
        if (this.craDay.craDayActivities) {
          for (let existingActivity of this.craDay.craDayActivities) {
            if (existingActivity !== this.craDayActivity) {
              currentTime += existingActivity.nbDay;
            }
          }
        }

        // Vérifier que la modification ne dépasse pas 1 jour
        if (currentTime + this.craDayActivity.nbDay > 1) {
          this.activityErrorMessage = this.utils.tr('app.compo.cra.form.validation.dayCannotExceedOne');
          return;
        }

        // Mettre à jour l'activité éditée
        this.setEvent(this.craDay, this.craDayActivity);
        this.craService.setDayProps(this.craDay);
        this.process();
        this.refreshMe();
        this.modal.dismissAll(this.dayDetailView);
      }

      this.currentCra = this.craService.updateCraDay(this.currentCra, this.craDay);
      this.process();
      this.refreshMe();
    } else {
      this.modal.dismissAll(this.dayDetailView);
      this.addActivityInDates(this.craDayActivity, this.addMultiDateStartDate, this.addMultiDateEndDate);
      return;
    }

    this.modal.dismissAll(this.dayDetailView);
  }

  getTitleButtonAddActivity() {
    let t = this.utils.tr('app.compo.cra.form.addActivity');
    if (this.isAddMultiDate) {
      t = this.utils.tr('app.compo.cra.form.addActivities');
    }
    return t;
  }

  addActivityInDates(craDayActivity: CraDayActivity, dateDeb: Date, dateFin: Date) {
    let label = "addActivityInDates";
    this.logger.debug("********* " + label + " DEB : currentCra: ", this.currentCra)
    this.logger.debug("********* " + label + " DEB : craDayActivity, dateDeb, dateFin : ", craDayActivity, dateDeb, dateFin)

    let nbJoursDiff = this.utils.getNbJourBetweenDates(dateDeb, dateFin);
    this.logger.debug("********* " + label + " : nbJoursDiff", nbJoursDiff)

    this.logger.debug("********* " + label + " : craService: ", this.craService)

    let nbHorsPlage = 0;

    for (let i = 0; i < nbJoursDiff + 1; i++) {
      let date = this.utils.getDatePlusNbJour(dateDeb, i);
      this.logger.debug("********* " + label + " : date", date)
      this.craDay = this.craService.getCraDayByDate(this.currentCra, date);
      this.logger.debug("********* " + label + " : craDay : ", this.craDay)
      // this.craService.setDayProps(this.craDay);
      if (this.craService.craDayNotFull(this.craDay, craDayActivity)) {
        this.logger.debug("********* " + label + " : craDayNotFull OK")
        if (this.craService.isCraDayOpen(this.craDay)) {
          this.logger.debug("********* " + label + " : isCraDayOpen OK")
          if (this.isActivityValidForDay(craDayActivity.activity, date)) {
            nbHorsPlage++;
            this.logger.debug("********* " + label + " : can add KO : date hors plage de l'activité : ", date, craDayActivity.activity)
          } else {
            this.logger.debug("********* " + label + " : can add OK")
            let cda = this.getNewCraDayActivityFrom(craDayActivity);
            this.craDayActivity = cda;
            this.addActivity(this.craDayActivity, this.craDay, false);
            this.logger.debug("********* " + label + " : addActivity OK")
          }
        } else {
          this.logger.debug("********* " + label + " : can add KO : Cra Day Not Open : this.craDay, craDayActivity : ", this.craDay, craDayActivity)
        }
      } else {
        this.logger.debug("********* " + label + " : can add KO : this.craDay, craDayActivity : ", this.craDay, craDayActivity)
      }
    }

    if (nbHorsPlage > 0) {
      const act = craDayActivity.activity;
      const debStr = act?.dateDebFr || (act?.dateDeb ? this.datePipe.transform(act.dateDeb, 'dd/MM/yyyy') : '?');
      const finStr = act?.dateFinFr || (act?.dateFin ? this.datePipe.transform(act.dateFin, 'dd/MM/yyyy') : '?');
      this.utilsIhm.info(
        this.utils.tr('app.compo.cra.form.activity.skippedOutOfRange', {
          count: nbHorsPlage,
          name: act?.name || '',
          deb: debStr,
          fin: finStr,
        }),
        null, null
      );
    }

    this.logger.debug("Av process")
    this.process();

    this.logger.debug("Av refreshMe")
    this.refreshMe();

    this.logger.debug("********* " + label + " END : currentCra: ", this.currentCra)

  }

  /***
   * Used to change the type of hour worked => Normal day || Over time
   * @param value
   */
  onCheckTime(value: boolean) {
    if (value) {
      this.craDayActivity.isOverTime = true
      this.craDayActivity.nbDay = 0;
    } else {
      this.craDayActivity.isOverTime = false
      this.craDayActivity.startHour = null;
      this.craDayActivity.endHour = null;
    }
  }

  onSelectTime(time: number) {
    this.craDayActivity.nbDay = time;
  }

  @ViewChild('compoSelectTime', { static: false }) compoSelectTime: SelectComponent;
  selectTime(time: number) {
    this.compoSelectTime.selectedObj = time;
  }

  getIndexOfTime(nbDay: number): number {
    let index = -1;
    for (let i = 0; i < this.times.length; i++) {
      if (this.craDayActivity.nbDay == this.times[i]) {
        index = i
        break;
      }
    }
    return index;
  }

  ////////////

  isTimeToModify(): boolean {
    this.setMonthCurentCraIfNull();
    let dateCra = this.utils.getDate(this.currentCra.month);
    let moisPrec = this.utils.getDateLastMonthFirstDay();

    // this.logger.debug("isTimeToModify : dateCra:", dateCra)
    // this.logger.debug("isTimeToModify : moisPrec:", moisPrec)
    // this.logger.debug("isTimeToModify : dateCra >= moisPrec:", (dateCra >= moisPrec))

    return dateCra >= moisPrec;

  }


  /////////
  /**
   * 
   * @param isSilent : if true, then no alert info dialog if return true.
   * @returns 
   */
  isCraValid(isSilent: boolean): boolean {

    this.logger.debug("isCraValid DEB this.currentCra=", this.currentCra)


    if (this.currentCra.type == 'CONGE') {

      let isCongesVide = true;
      let today = new Date();
      let yesterday = this.utils.getDateYesterday();

      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay: CraDay = this.currentCra.craDays[i];
        let craDayActivities: CraDayActivity[] = craDay.craDayActivities;
        let time: number = 0;

        for (let craDayActivity of craDayActivities) {

          let actName = craDayActivity.activity.name
          let actType = craDayActivity.activity.type
          let congeDay = craDayActivity.activity.type.congeDay

          this.logger.debug("isCraValid : i=" , i , ", actName=" , actName , ", actType=" , actType , ", congeDay=" , congeDay);
          
          if (craDayActivity.activity.type && !craDayActivity.activity.type.congeDay) {

            this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.congeTypeOnly'), null, null);
            this.currentCra.validByConsultant = null;
            this.currentCra.dateValidationConsultant = null;
            this.maj_canSubmitCra();
            return false;
          } else {
            isCongesVide = false;
            time = time + craDayActivity.nbDay;
            let dateActivity: Date = this.utils.getDate(craDay.day);
            this.logger.debug("+++++ dateActivity", dateActivity)
            this.logger.debug("+++++ yesterday", yesterday)
            if (dateActivity <= yesterday) {
              this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.noPastConge'), null, null);
              return false;
            }
          }
        }

        // Vérifier que le temps total ne dépasse pas 1 jour par jour
        if (time > 1) {
          this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.dayCannotExceedOne'), null, null);
          this.currentCra.validByConsultant = null;
          this.currentCra.dateValidationConsultant = null;
          this.maj_canSubmitCra();
          return false;
        }

      }

      if (isCongesVide) {
        this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.atLeastOneConge'), null, null);
        this.currentCra.validByConsultant = null;
        this.currentCra.dateValidationConsultant = null;
        this.maj_canSubmitCra();
        return false;
      }

      if (!isSilent) {
        this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.congeValidSubmit'), null, null);
      }

    } else {
      for (let i = 0; i < this.currentCra.craDays.length; i++) {
        let craDay: CraDay = this.currentCra.craDays[i];
        let craDayActivities: CraDayActivity[] = craDay.craDayActivities;
        let time: number = 0;

        // Calculer le temps total pour toutes les activités du jour
        craDayActivities.forEach(craDayActivity => {
          time = time + craDayActivity.nbDay;
        })

        // Vérifier que le temps total ne dépasse pas 1 jour par jour (pour tous les types de jours)
        if (time > 1) {
          this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.dayCannotExceedOne'), null, null);
          this.currentCra.validByConsultant = null;
          this.currentCra.dateValidationConsultant = null;
          this.maj_canSubmitCra();
          return false;
        }

        // Pour les jours travaillés, vérifier que le temps total est exactement 1
        if (craDay.type == "DAY_WORKED") {
          if (time < 1) {
            this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.dayMustEqualOne'), null, null);
            this.currentCra.validByConsultant = null;
            this.currentCra.dateValidationConsultant = null;
            this.maj_canSubmitCra();
            return false;
          }
        }

      }

      if (!isSilent) {
        this.utilsIhm.info(this.utils.tr('app.compo.cra.form.validation.craValidSubmit'), null, null);
      }
    }

    this.logger.debug("isCraValid END OK this.currentCra=", this.currentCra)
    this.maj_canSubmitCra();
    return true;
  }

  getNameByType() {
    let name = this.utils.tr("Cra");
    if (this.currentCra && this.currentCra.type == 'CONGE') {
      name = this.utils.tr('Conge')
    }
    return name;
  }

  getLabelByType() {
    let name = "Cra";
    if (this.typeCra && this.typeCra == 'CONGE') {
      name = 'Conge'
    }
    return name;
  }

  /***
   * THis method aims to valid cra for manager
   */
  validCra() {

    this.isToValidateCra = true

    let name = this.getNameByType();

    this.utilsIhm.confirmYesNo(this.utils.tr('app.compo.cra.form.confirmValidate', { name }), this
      , () => {
        this.currentCra.validByManager = true;
        this.currentCra.dateValidationManager = new Date();
        this.currentCra.comment = null;
        this.setStatus("VALIDATED")
        this.saveCra(true, true, name + " validated by Manager", this.currentCra.comment);
      },
      () => {
        this.currentCra.validByManager = false;
        this.currentCra.dateValidationManager = null;
      }
    );

  }

  /***
 * This method used to rejected cra,
 */
  rejectCra() {
    this.logger.debug("rejectCra DEB currentCra", this.currentCra)
    this.isToRejectCra = true
    let name = this.getNameByType();
    this.currentCraUser = this.currentCra.consultant

    this.currentCra.validByManager = false;
    this.currentCra.validByConsultant = false;
    this.maj_canSubmitCra();
    this.setStatus("REJECTED")
    this.modal.dismissAll(this.rejectCraView);
    this.saveCra(true, true, name + " rejected", this.currentCra.comment);
    this.logger.debug("rejectCra END currentCra", this.currentCra)

  }

  // soumettre cra 
  sendCraToValidate() {
    this.logger.debug("sendCraToValidate DEB currentCra", this.currentCra)

    if (this.currentCra == null) {
      this.logger.debug("sendCraToValidate ERROR : currentCra is NULL !! ")
      return
    }

    // let currentUser: Consultant = this.dataSharingService.userConnected
    // let currentUser: Consultant = this.currentCra.consultant
    let currentUser: Consultant = this.userConnected
    this.currentCra.consultant = currentUser
    this.currentCraUser = this.currentCra.consultant

    let craUser = this.currentCra.consultant
    let craManager = this.currentCra.consultant?.adminConsultant

    if (craUser.role == "RESPONSIBLE_ESN") {
      craManager = craUser;
    }

    this.logger.debug("sendCraToValidate currentUser, craUser, craManager : ", currentUser, craUser, craManager)

    if (craUser != null) {

      let name = this.getNameByType();

      if (this.isCraValid(true)) {

        this.utilsIhm.confirmYesNo(this.utils.tr('app.compo.cra.form.confirmSubmit', { name }), this
          , () => {
            this.logger.debug("sendCraToValidate go to soumettre cra : currentUser.adminConsultant ", currentUser.adminConsultant)
            this.currentCra.validByConsultant = true;
            this.maj_canSubmitCra();
            this.currentCra.dateValidationConsultant = new Date();
            this.currentCra.comment = null;
            this.setStatus("TO_VALIDATE")
            // this.saveCra(false, false, "", "");
            if (craManager != null) {
              // this.currentCra.consultant.adminConsultant = currentUser.adminConsultant;
              this.saveCra(true, true, name + " to validate", "");
            }
          }
          , () => {
            this.currentCra.validByConsultant = false;
            this.maj_canSubmitCra();
            this.currentCra.dateValidationConsultant = null;
            this.setStatus("DRAFT")
          });
      }

    } else {
      this.utilsIhm.info(this.utils.tr('app.compo.cra.form.currentUserNull'), null, null);
    }
  }

  /****
   * used to set new event in the events data
   * @param craActivity
   */
  private setEvent(craDay: CraDay, craActivity: CraDayActivity, isRefresh = true): void {

    // this.logger.debug("setEvent this.currentCra=", this.currentCra)

    if (craActivity.activity != null) {
      let title = UtilsService.getEventTitle(craActivity);
      let day = this.utils.getDate(craDay.day);
      title = title.slice(0, 25);

      let color = colors.blue;
      let cssClass = 'event';

      if (!this.craService.isCraDayOpen(craDay)) {
        color = colors.red;
        cssClass = 'conge';
      }

      this.events.push({
        title: title,
        start: startOfDay(day),
        end: endOfDay(day),
        color,
        cssClass,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        },
        meta: craActivity
      })
      if (isRefresh) {
        this.refreshMe();
      }
    }
  }

  deleteAllEvents() {

    this.logger.debug("deleteAllEvents this.currentCra=", this.currentCra)

    if (this.events && this.events.length > 0) {
      this.utilsIhm.confirmYesNo(this.utils.tr('app.compo.cra.form.confirmDeleteAllEvents', { count: this.events.length }), this
        , () => {
          this.events = [];
          this.currentCra.craDays.forEach((v, k) => {
            v.craDayActivities = [];
          })

          this.refreshMe()
        }
        , null
      );
    } else {
      this.utilsIhm.info(this.utils.tr('app.compo.cra.form.noEventToDelete'), this, null);
    }

  }

  /***
   * This method aims to calc the days abs/ days worked
   */
  private process(): void {
    // this.logger.debug("******* process deb")
    // this.logger.debug("******* process currentCra:", this.currentCra)

    this.numberDayWorked = 0;
    this.numberDayAbs = 0;
    this.numberDayBilled = 0;
    this.totalBilled = 0;
    this.totalDayToWork = 0;
    if (this.currentCra != null && this.currentCra.craDays != null) {
      this.currentCra.craDays.forEach((craDay, index) => {
        if (this.craService.isCraDayOpen(craDay)) {
          this.totalDayToWork++;
        } else {

        }
        craDay.craDayActivities.forEach((cda, k) => {
          const activity: Activity = cda?.activity;
          if (!activity) {
            return;
          }
          // ////////this.logger.debug("******* process activity:", activity)

          let type: ActivityType = activity.type;
          if (type == null) {
            if (!activity.typeId) {
              // Pas de type exploitable: on applique un type neutre pour éviter les boucles et crashs.
              activity.type = new ActivityType();
              return;
            }
            // Type manquant : charger puis relancer process() depuis zéro pour éviter
            // le double-comptage dû aux callbacks multiples en attente.
            this.activityTypeService.findById(activity.typeId).subscribe(
              data => {
                const resolvedType: ActivityType = data?.body?.result;
                if (!resolvedType) {
                  this.logger.debug("WARN activityTypeService.findById returned empty result, typeId", activity.typeId, data);
                  // Type neutre pour ne plus retenter indéfiniment sur la même activité.
                  activity.type = new ActivityType();
                  return;
                }

                activity.type = resolvedType;
                // Recompte complet depuis 0 : pas de calcul_recap direct ici
                this.process();
                this.refreshMe();
              },
              error => {
                this.logger.debug("ERROR activityTypeService.findById, activity.typeId, err", activity.typeId, error)
              }
            );
            // Ne pas compter cette activité maintenant : sera recomptée après chargement du type
          } else {
            this.calcul_recap(activity, cda, craDay);
          }

        });
      });
    }
    // this.logger.debug("******* process fin this.totalDayToWork=" + this.totalDayToWork)
  }

  private calcul_recap(activity: Activity, cda: CraDayActivity, craDay: CraDay) {
    if (this.craService.isCraDayOpen(craDay) && activity && activity.type.workDay) this.numberDayWorked += cda.nbDay;
    if (activity && activity.type.billDay) {
      this.numberDayBilled += cda.nbDay;
      this.totalBilled += cda.nbDay * activity.tjm;
    }
    if (this.craService.isCraDayOpen(craDay) && activity && activity.type.congeDay) this.numberDayAbs += cda.nbDay;
  }

  /***
   * This method used to get times
   */
  getTimes() {
    if (this.isEditCraActivity) {
      return this.times;
    } else {
      let craDayActivities: CraDayActivity[] = this.craDay.craDayActivities;
      if (craDayActivities.length > 0) {
        let time: number = 0;
        craDayActivities.forEach(value => {
          time += value.nbDay;
        })
        if (time == 0) return this.times;
        if (time == 0.5) return [0.5]
        if (time == 1) return [];
      }
    }

    return this.times;
  }

  /***
   * used to verify current user has role to validate manager cra
   */
  hasRoleManagerValidate() {
    let currentUser = this.dataSharingService.userConnected
    let isCurUserRespOrAdmin = this.dataSharingService.isCurrenUserRespOrAdmin()
    if (this.isAdd || (this.isCurrenUserSameAsUserOfCurrentCra() && !isCurUserRespOrAdmin)) return false;
    if (currentUser.role == "MANAGER" || isCurUserRespOrAdmin) return true;
    return false;
  }

  isCurrenUserSameAsUserOfCurrentCra() {
    return this.dataSharingService.userConnected.id == this.currentCra?.consultant?.id
  }

  hasManager() {
    let currentUser = this.dataSharingService.userConnected
    // return (currentUser.role != "RESPONSIBLE_ESN" && currentUser.role != "ADMIN");
    return (currentUser.role != "ADMIN");
  }

  isCraOfManagerRole() {
    let currentUser = this.dataSharingService.userConnected

    if (this.isCurrenUserSameAsUserOfCurrentCra() && currentUser.role == "MANAGER") return true;
    return false;
  }

  /****
   * This method invoked when i need to show the modal rejected cra
   */
  openModalPopup(templateRef: TemplateRef<any>) {
    this.modal.open(templateRef, { size: 'lg' });
  }

  /***
   *This method invoked when the state of cra observable changed, used to set update current cra
   * @param observable
   */
  update(observable: CraObservable): void {
    let addMultiDateComponent: AddMultiDateComponent = <AddMultiDateComponent>observable;
    this.currentCra = addMultiDateComponent.currentCra;

    this.initCra(this.currentCra);
    this.process();
    this.refreshMe();
  }


  /**
   // avoir la liste des clients du cra courant 
   // si un seul client, on genere le cra client de celui-ci
   // si plusieurs : on ouvre une popup avec liste des btn / client 
     * 
     */
  generateCliPDFGenLinks() {
    let label = "generateCliPDFGenLinks"
    this.logger.debug(label + " DEB this.currentCra=", this.currentCra)

    if (!this.currentCra?.id) {
      this.utilsIhm.info(this.utils.tr('app.compo.cra.form.pdfClient.craNotFound'), null, null);
      return;
    }

    let userOfCra = this.currentCra?.consultant

    if (!userOfCra) {
      this.utilsIhm.info(this.utils.tr('app.compo.cra.form.pdfClient.userNotFound'), null, null);
      return;
    }

    this.logger.debug(label + " this.showDownloadSendEmailCraPanel=", this.showDownloadSendEmailCraPanel)
    if (this.showDownloadSendEmailCraPanel) {
      this.closeDownloadSendEmailPanel();
      return
    }

    let userName = (userOfCra.fullName || "consultant").replace(/\s+/g, "-");
    let now = this.utils.getDateNow()

    this.logger.debug(label + " : ", now)

    let labelRechClients = "Recherche des clients du CRA"
    this.beforeCallServer(labelRechClients);
    // retourne an array of clientName 
    this.craService.getClientsOfCra(this.currentCra.id)
      .subscribe(
        response => {
          this.logger.debug(labelRechClients + " response : ", response)
          this.afterCallServer(labelRechClients, response)
          let clients = response.body.result
          this.logger.debug(labelRechClients + " >>> AV ouverture dialog avec clients=", clients);
          if (clients && clients.length > 0) {
            if (clients.length == 1) {
              let clientName = clients[0].name
              const fileName = "cra-cli-" + userName + "-" + clientName + "-" + now + ".pdf";
              let clientEmail = clients[0]?.email;

              this.affPanelCraClient(clientName, clientEmail, fileName);
            } else {
              //>1
              // TODO on ouvre une popup avec liste des btn / client 
              this.openClientsDialog(clients);
            }
          } else {
            this.logger.debug(labelRechClients + " : NO client ")
            this.utilsIhm.info(this.utils.tr('app.compo.cra.form.pdfClient.noClientFound'), null, null);
          }


        }, error => {
          this.logger.debug("ERROR : ", error)
          this.addErrorFromErrorOfServer(labelRechClients, error);
        }
      );
  }


  // ouverture du dialog
  openClientsDialog(clients: any[]) {
    this.logger.debug(">>> ouverture dialog avec clients=", clients);

    const dialogRef = this.dialog.open(ClientsDialogComponent, {
      width: '400px',
      data: { clients: clients }
    });

    let label = "openClientsDialog"
    this.beforeCallServer(label);

    let userName = this.currentCra.consultant.fullName.replace(" ", "-");
    let now = this.utils.getDateNow()

    dialogRef.afterClosed().subscribe(selectedClient => {
      this.afterCallServer(label, selectedClient)
      this.logger.debug("selectedClient : ", selectedClient)
      if (selectedClient) {
        const fileName = "cra-cli-" + userName + "-" + selectedClient.name + "-" + now + ".pdf";
        this.affPanelCraClient(selectedClient.name, selectedClient.email, fileName);
      }
    });
  }

  private affPanelCraClient(clientName: any, clientEmail: any, fileName: string) {
    let labelGenPDF = "Génération du PDF client pour le client : " + clientName;
    this.beforeCallServer(labelGenPDF);
    this.craService.generateCliPDFClientName(this.currentCra.id, clientName).subscribe(
      response => {
        this.afterCallServer(labelGenPDF, response);
        this.logger.debug(labelGenPDF, "response : ", response);
        const linkSource = `data:application/pdf;base64,${response.body.result}`;

        this.currentCra.monthStr = this.utils.formatDateByFormat(this.currentCra.month, "dd/MM/yyyy");

        this.openDownloadSendEmailPanel({
          titleDeb: "CRA Client",
          status: this.currentCra.status,
          fullNameConsultant: this.currentCra.consultant?.fullName,
          monthCra: this.currentCra.monthStr,
          clientName: clientName,
          clientMail: clientEmail,
          fileName: fileName,
          linkSource: linkSource
        });
      }, error => {
        this.addErrorFromErrorOfServer(labelGenPDF, error);
      }
    );
  }

  openDownloadSendEmailPanel(data: DownloadClientCraDialogData) {
    this.logger.debug("openDownloadSendEmailPanel this.currentCra=", this.currentCra)
    this.downloadSendEmailCraData = data;
    this.showDownloadSendEmailCraPanel = true;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.scrollToDownloadSendEmailPanel();
    }, 0);
    this.logger.debug("openDownloadSendEmailPanel this.downloadSendEmailCraData=", this.downloadSendEmailCraData)
    this.logger.debug("openDownloadSendEmailPanel this.showDownloadSendEmailCraPanel=", this.showDownloadSendEmailCraPanel)
  }

  closeDownloadSendEmailPanel() {
    this.logger.debug("closeDownloadSendEmailPanel this.currentCra=", this.currentCra)
    this.showDownloadSendEmailCraPanel = false;
    this.downloadSendEmailCraData = null;
    this.cdr.markForCheck();
    this.logger.debug("closeDownloadSendEmailPanel this.showDownloadSendEmailCraPanel=", this.showDownloadSendEmailCraPanel)
    this.logger.debug("closeDownloadSendEmailPanel this.downloadSendEmailCraData=", this.downloadSendEmailCraData)
  }

  private scrollToDownloadSendEmailPanel() {
    const panel = document.getElementById('panel_download_send_email_CRA');
    if (!panel) {
      return;
    }

    panel.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  generateEsnPDF() {
    let label = "generateEsnPDF"

    if (this.showDownloadSendEmailCraPanel) {
      this.closeDownloadSendEmailPanel();
      return;
    }

    let userOfCra = this.currentCra.consultant

    // maj esn of userOfCra
    this.esnService.majEsnOnConsultant(userOfCra, null, null)

    let userName = userOfCra?.fullName.replace(" ", "-");
    let now = this.utils.getDateNow()

    this.beforeCallServer(label);
    this.craService.generateEsnPDF(this.currentCra.id)
      .subscribe(
        response => {
          this.afterCallServer(label, response)
          this.logger.debug(label, "response : ", response)
          const linkSource = `data:application/pdf;base64,${response.body.result}`;
          const fileName = "cra-esn-" + userName + "-" + now + ".pdf";

          this.currentCra.monthStr = this.utils.formatDateByFormat(this.currentCra.month, "dd/MM/yyyy")

          this.logger.debug("generateEsnPDF userOfCra=", userOfCra)
          this.openDownloadSendEmailPanel({
            titleDeb: "CRA ESN",
            status: this.currentCra.status,
            fullNameConsultant: userOfCra?.fullName,
            monthCra: this.currentCra.monthStr,
            clientName: userOfCra?.esn?.name,
            clientMail: userOfCra?.adminConsultant?.email,
            fileName: fileName,
            linkSource: linkSource
          });

        }, error => {
          this.addErrorFromErrorOfServer(label, error);
          ////this.logger.debug(error);
        }
      );

  }

  generateFichePaieFromCra(): void {
    const label = 'generateFichePaieFromCra';
    if (!this.currentCra?.id) {
      return;
    }

    this.beforeCallServer(label);
    this.craService.generateFichePaieFromCra(this.currentCra.id).subscribe(
      (response) => {
        this.afterCallServer(label, response);
        const blob = new Blob([response.body], { type: 'application/pdf' });
        const fileName = this.extractFileNameFromHeader(response?.headers?.get('content-disposition'))
          || ('fiche_paie_cra_' + this.currentCra.id + '.pdf');

        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.addErrorFromErrorOfServer(label, error);
      }
    );
  }

  private extractFileNameFromHeader(contentDisposition: string | null): string | null {
    if (!contentDisposition) {
      return null;
    }

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match && utf8Match[1]) {
      return decodeURIComponent(utf8Match[1]);
    }

    const match = contentDisposition.match(/filename=\"?([^\";]+)\"?/i);
    return match && match[1] ? match[1] : null;
  }


  downloadPDF(craReportActivity: CraReportActivity) {
    const linkSource = `data:application/pdf;base64,${craReportActivity.pdfData}`;
    const downloadLink = document.createElement("a");
    this.setMonthCurentCraIfNull();
    const fileName = this.currentCra.consultant?.username.split("@")[0] + "_" + craReportActivity.activity.replace(" ", "_").toLowerCase() + "_" + this.currentCra.month + ".pdf";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      if (["pdf", "png", "jpg"].includes(ext)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.currentCra.attachment = reader.result
        }
      } else {
        // alert("Oops, seuls les fichiers en format [pdf,png,jpg] sont acceptés.")
        this.utilsIhm.info(this.utils.tr('app.compo.cra.form.attachment.invalidFormat'), null, null);
        this.attachment.nativeElement.value = "";
      }

    }
  }

  downloadAttachment() {
    let attachment: string = this.currentCra.attachment.toString();
    const linkSource = attachment;
    const extension = attachment.substring("data:".length, attachment.indexOf(";base64"))
    const downloadLink = document.createElement("a");
    let fileName = "" + new Date().getTime();
    if (extension == "jpeg") {
      fileName.concat(".jpg")
    } else if (extension == "png") {
      fileName.concat(".png")
    } else {
      fileName.concat(".pdf")
    }
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  refreshMe() {
    // this.logger.debug("**** refreshMe deb this.viewDate : ", this.viewDate)

    setTimeout(() => {
      if (this.notADate(this.viewDate)) this.viewDate = new Date();
      this.viewDate = this.utils.getDate(this.viewDate);
      // this.logger.debug("**** refreshMe av refresh : ", this.viewDate)
      try {
        this.refresh.next(0)
        // this.logger.debug("**** refreshMe ap refresh : ", this.viewDate)
      } catch (error) {
        this.logger.debug("refreshMe error:", error)
      }
      // this.logger.debug("**** refreshMe fin")
    }, 500);
  }

  setStatus(status: string) {
    this.currentCra.status = status
    this.addStatusHisto()
  }

  showHistoryStatus() {
    const dialogRef = this.dialog.open(CraHistoStatusComponent, {
      width: '800px',
      data: { myList: this.currentCra.statusHistoTab }
    });

  }

}
