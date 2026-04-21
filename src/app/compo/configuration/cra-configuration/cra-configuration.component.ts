import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarView } from "angular-calendar";
import { MonthViewDay } from "calendar-utils";
import { endOfDay, startOfDay } from "date-fns";
import { Subject } from "rxjs";
import { MyError } from "src/app/resource/MyError";
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { CraConfiguration } from "../../../model/cra-configuration";
import { CraConfigurationService } from "../../../service/cra-configuration.service";
import { UtilsService } from "../../../service/utils.service";
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-cra-configuration',
  templateUrl: './cra-configuration.component.html',
  styleUrls: ['./cra-configuration.component.css']
})
export class CraConfigurationComponent extends MereComponent {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = new Array();
  refresh: Subject<any> = new Subject();
  holiday: string = "holiday";
  craConfigurationData: CraConfiguration = new CraConfiguration();

  @ViewChild('customCellTemplate', { static: true }) customCellTemplate: TemplateRef<any>;
  @ViewChild('holidayDialogView', { static: true }) holidayDialogView: TemplateRef<any>;

  selectedDay: MonthViewDay<any> | null = null;
  editingHolidayTitle: string = '';
  isEditingExistingHoliday: boolean = false;

  idEsnCurrent: number = null;

  constructor(private craConfigurationService: CraConfigurationService, public utils: UtilsService
    , public dataSharingService: DataSharingService, private datePipe: DatePipe
    , private modal: NgbModal) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    this.idEsnCurrent = this.dataSharingService.idEsnCurrent;

    if (this.idEsnCurrent && this.idEsnCurrent > 0) {
      this.viewDateChange();
    }

    this.subscriptions.push(
      this.dataSharingService.idEsnCurrent$.subscribe(id => {
        if (id && id > 0 && this.idEsnCurrent !== id) {
          this.idEsnCurrent = id;
          this.viewDateChange();
        }
      })
    );
  }

  viewDateChange() {

    setTimeout(() => {
      this.beforeCallServer("viewDateChange")
      console.log("viewDateChange : viewDate : ", this.viewDate)

      if (!this.idEsnCurrent || this.idEsnCurrent <= 0) {
        this.addError(new MyError("viewDateChange", "Esn non trouvée pour l'utilisateur connecté"))
        return;
      }

      let myDate = this.datePipe.transform(this.viewDate, "MM-yyyy");
      console.log("viewDateChange : myDate : ", myDate)
      this.craConfigurationService.getCraConfigByEsnIdAndMonth(this.idEsnCurrent, myDate)
        .subscribe((data) => {
          this.afterCallServer("viewDateChange", data)
          this.craConfigurationData = data?.body?.result || new CraConfiguration();
          console.log("viewDateChange : craConfigurationData : ", this.craConfigurationData)

          if (!this.craConfigurationData.holidays) {
            this.craConfigurationData.holidays = [];
          }
          this.setEvents()
        }, error => {
          this.addErrorFromErrorOfServer("viewDateChange", error);
        })

    }, 500);

  }


  update() {
    this.beforeCallServer("update")
    this.craConfigurationData.esn = this.getEsnCurrent();
    const savedLabels = this.craConfigurationData.holidayLabels;
    console.log("update craConfigurationData : ", this.craConfigurationData)
    this.craConfigurationService.updateCraConfiguration(this.craConfigurationData).subscribe((data) => {
      this.afterCallServer("update", data)
      this.craConfigurationData = data?.body?.result || this.craConfigurationData;
      if (!this.craConfigurationData.holidays) {
        this.craConfigurationData.holidays = [];
      }
      // Le serveur ne persiste pas holidayLabels : on le restaure
      if (!this.craConfigurationData.holidayLabels && savedLabels) {
        this.craConfigurationData.holidayLabels = savedLabels;
      }
      console.log("craConfigurationData : ", this.craConfigurationData)
    }, (error) => {
      this.addErrorFromErrorOfServer("update", error);
    })
  }

  dayClicked(day: MonthViewDay<any>, events: CalendarEvent[]) {
    console.log("dayClicked : day : ", day);

    const dayDate = this.utils.getDate(day.date);

    // Jour férié national : rien à faire
    if (this.isNationalHoliday(dayDate)) {
      console.log("dayClicked : jour férié national, rien à faire");
      return;
    }

    this.selectedDay = day;
    this.craConfigurationData.month = day.date;
    this.craConfigurationData.monthStringFormat = this.datePipe.transform(day.date, "MM-yyyy");

    if (this.isPersonalHoliday(dayDate)) {
      // Jour férié personnel : popup pour modifier le titre ou supprimer
      const existingIndex = this.craConfigurationData.holidays.findIndex(
        item => this.datePipe.transform(item, "dd-MM-yyyy") === this.datePipe.transform(day.date, "dd-MM-yyyy")
      );
      const existingEvent = day.events?.find(e => e.cssClass === 'holiday-perso');
      this.editingHolidayTitle = existingEvent?.title
        || ('Congé perso : ' + this.datePipe.transform(day.date, 'dd/MM/yyyy'));
      this.isEditingExistingHoliday = true;
    } else {
      // Jour normal : popup pour ajouter un congé personnel
      this.editingHolidayTitle = 'Congé perso : ' + this.datePipe.transform(day.date, 'dd/MM/yyyy');
      this.isEditingExistingHoliday = false;
    }

    this.modal.open(this.holidayDialogView, { size: 'sm', centered: true });
  }

  confirmHoliday() {
    if (!this.selectedDay) return;

    const dateKey = this.datePipe.transform(this.selectedDay.date, 'dd-MM-yyyy');

    const index = this.craConfigurationData.holidays.findIndex(
      item => this.datePipe.transform(item, "dd-MM-yyyy") === dateKey
    );

    if (index > -1) {
      this.craConfigurationData.holidays.splice(index, 1);
    }
    this.craConfigurationData.holidays.push(this.selectedDay.date);

    if (!this.craConfigurationData.holidayLabels) {
      this.craConfigurationData.holidayLabels = {};
    }
    this.craConfigurationData.holidayLabels[dateKey] = this.editingHolidayTitle;

    this.modal.dismissAll();
    this.setEvents();
    this.update();
  }

  deleteSelectedHoliday() {
    if (!this.selectedDay) return;

    const dateKey = this.datePipe.transform(this.selectedDay.date, 'dd-MM-yyyy');
    const index = this.craConfigurationData.holidays.findIndex(
      item => this.datePipe.transform(item, "dd-MM-yyyy") === dateKey
    );
    if (index > -1) {
      this.craConfigurationData.holidays.splice(index, 1);
    }
    if (this.craConfigurationData.holidayLabels) {
      delete this.craConfigurationData.holidayLabels[dateKey];
    }

    this.modal.dismissAll();
    this.setEvents();
    this.update();
  }

  isPersonalHoliday(day: Date): boolean {
    return !!day && this.utils.isDateHolidayPerso(day, this.craConfigurationData?.holidays || []);
  }

  isNationalHoliday(day: Date): boolean {
    return !!day && this.utils.isDateHolidayNational(day, 'fr');
  }

  getClassOfDay(day: MonthViewDay<any>): string {
    const dayDate = this.utils.getDate(day?.date);
    if (!dayDate) return 'cal-cell-normal';
    if (this.isNationalHoliday(dayDate)) return 'holiday-national';
    if (this.isPersonalHoliday(dayDate)) return 'holiday-perso';
    return 'cal-cell-normal';
  }

  private setEvents() {
    console.log("setEvents : craConfigurationData : ", this.craConfigurationData)
    this.events = [];
    if (!this.craConfigurationData || !this.craConfigurationData.holidays) {
      this.refreshMe();
      console.log("setEvents : craConfigurationData.holidays is null or undefined")
      return;
    }
    this.craConfigurationData.holidays.forEach(value => {
      value = this.utils.getDate(value);
      console.log("setEvents : holiday value : ", value)
      const dateKey = this.datePipe.transform(value, 'dd-MM-yyyy');
      const label = this.craConfigurationData.holidayLabels?.[dateKey] || ('Congé perso : ' + dateKey);
      this.events.push({
        title: label,
        start: startOfDay(value),
        end: endOfDay(value),
        color: {
          primary: '#c28a00',
          secondary: '#fff1a8'
        },
        cssClass: 'holiday-perso',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      })
    })
    this.refreshMe();
  }

  refreshMe() {
    this.refresh.next(0);
  }

}
