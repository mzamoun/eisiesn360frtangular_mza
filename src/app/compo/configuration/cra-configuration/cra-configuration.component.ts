import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild } from '@angular/core';
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

  constructor(private craConfigurationService: CraConfigurationService, public utils: UtilsService
    , public dataSharingService: DataSharingService, private datePipe: DatePipe) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    this.viewDateChange()

  }

  viewDateChange() {

    setTimeout(() => {
      this.beforeCallServer("viewDateChange")
      console.log("viewDateChange : viewDate : ", this.viewDate)
      let idEsnCurrent = this.dataSharingService.idEsnCurrent;
      console.log("viewDateChange : dataSharingService.idEsnCurrent : ", idEsnCurrent)
      if (!idEsnCurrent || idEsnCurrent <= 0) {
        idEsnCurrent = this.dataSharingService.userConnected?.esn?.id || null;
        console.log("viewDateChange : dataSharingService.userConnected?.esn?.id : ", idEsnCurrent)
        if (idEsnCurrent) {
          this.dataSharingService.idEsnCurrent = idEsnCurrent;
        }
      }

      if (!idEsnCurrent || idEsnCurrent <= 0) {
        this.dataSharingService.getCurrentUserFromLocaleStorage();
        idEsnCurrent = this.dataSharingService.userConnected?.esn?.id || null;
        console.log("viewDateChange : after getCurrentUserFromLocaleStorage : dataSharingService.userConnected?.esn?.id : ", idEsnCurrent)
        if (idEsnCurrent) {
          this.dataSharingService.idEsnCurrent = idEsnCurrent;
        }
      }

      if (!idEsnCurrent || idEsnCurrent <= 0) {
        this.addError(new MyError("viewDateChange", "Esn non trouvée pour l'utilisateur connecté"))
        return;
      }

      let myDate = this.datePipe.transform(this.viewDate, "MM-yyyy");
      console.log("viewDateChange : myDate : ", myDate)
      this.craConfigurationService.getCraConfigByEsnIdAndMonth(idEsnCurrent, myDate)
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
    console.log("update craConfigurationData : ", this.craConfigurationData)
    this.craConfigurationService.updateCraConfiguration(this.craConfigurationData).subscribe((data) => {
      this.afterCallServer("update", data)
      this.craConfigurationData = data?.body?.result || this.craConfigurationData;
      if (!this.craConfigurationData.holidays) {
        this.craConfigurationData.holidays = [];
      }
      console.log("craConfigurationData : ", this.craConfigurationData)
    }, (error) => {
      this.addErrorFromErrorOfServer("update", error);
    })
  }

  dayClicked(day: MonthViewDay<any>, events: CalendarEvent[]) {
    console.log("dayClicked : day : ", day);
    this.craConfigurationData.month = day.date;
    this.craConfigurationData.monthStringFormat = this.datePipe.transform(day.date, "MM-yyyy");
    if (this.craConfigurationData.holidays != null) {
      let index = this.craConfigurationData.holidays.findIndex(item => this.datePipe.transform(item, "dd-MM-yyyy") ==
        this.datePipe.transform(day.date, "dd-MM-yyyy"));
      if (index > -1) {
        this.craConfigurationData.holidays.splice(index, 1)
      } else {
        this.craConfigurationData.holidays.push(day.date);
      }
    } else {
      this.craConfigurationData.holidays = new Array();
      this.craConfigurationData.holidays.push(day.date);
    }

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
      this.events.push({
        title: "holiday : " + this.datePipe.transform(value, "dd-MM-yyyy"),
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
