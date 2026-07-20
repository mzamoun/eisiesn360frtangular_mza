


import { DatePipe } from "@angular/common";
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CraObservable, CraObserver } from "../../../core/core";
import { Activity } from "../../../model/activity";
import { Cra } from "../../../model/cra";
import { CraDayActivity } from "../../../model/cra-day-activity";
import { MultiDateActivity } from "../../../model/multi-date-activity";
import { ActivityService } from "../../../service/activity.service";
import { DataSharingService } from "../../../service/data-sharing.service";
import { UtilsService } from "../../../service/utils.service";
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { MzDatePickerDebFinComponent } from '../../mz-date-picker-deb-fin/mz-date-picker-deb-fin.component';
import { CraFormCalComponent } from "../cra-form/cra-form-cal.component";

@Component({
  selector: 'app-add-multi-date',
  templateUrl: './add-multi-date.component.html',
  styleUrls: ['./add-multi-date.component.css']
})
export class AddMultiDateComponent extends MereComponent implements CraObservable {

  activityForm: FormGroup;
  activityControl: FormControl;
  activities: Activity[];
  timesForm: FormGroup;
  timesControl: FormControl;
  @ViewChild('addRangeDateView', {static: true}) addRangeDateView: TemplateRef<any>;
  @ViewChild('myDatePickerDebFin', {static: false}) myDatePickerDebFin: MzDatePickerDebFinComponent;

  times: number[] = [0.5, 1]

  myObj: MultiDateActivity = new MultiDateActivity();
  data: MultiDateActivity[] = new Array();
  observers: Array<CraObserver> = new Array();
  @Input() currentCra: Cra;

  constructor(private activityService: ActivityService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private datePipe: DatePipe
    , private modal: NgbModal
  ) {
    super(utils, dataSharingService);

    this.timesForm = new FormGroup({
      timesControl: new FormControl()
    });

    this.activityForm = new FormGroup({
      activityControl: new FormControl()
    });
  }


  ngOnInit() {
    this.beforeCallServer("ngOnInit")
    this.activityService.findAll().subscribe(
      data => {
        this.afterCallServer("ngOnInit", data)
        this.activities = data.body.result;
        if (data == null) {
          this.activities = new Array();
        }
      }, error => {
        this.addErrorFromErrorOfServer("ngOnInit", error);
      }
    );
    // let craFormCalComponent: CraFormCalComponent = CraFormCalComponent.getInstance();
    let craFormCalComponent: CraFormCalComponent = this.dataSharingService.getService(CraFormCalComponent.name)
    this.subscribe(craFormCalComponent)

    if(this.myObj && this.currentCra) {
      this.myObj.startDate = this.currentCra.month;
    }
    
  }

  onSelectActivity(activity: Activity) {
    this.myObj.activity = activity;
  }

  @ViewChild('compoSelectActivity', {static:false}) compoSelectActivity:SelectComponent ;
  selectActivity(activity:Activity){
      this.compoSelectActivity.selectedObj = activity;
  }


  onSelectTime(time: number) {
    this.myObj.time = time;
  }

  @ViewChild('compoSelectTime', {static:false}) compoSelectTime:SelectComponent ;
  selectTime(time:number){
      this.compoSelectTime.selectedObj = time;
  }

  errorDates = "";
  validationError = "";
  onStartDateInputChanged(date: Date, error: string) {
    this.myObj.startDate=date;
    this.errorDates=error;
    this.validationError = "";
    ////////////this.logger.debug("main onChangeDateDeb myDatePickerDeb", date, error);
    if(this.errorDates) {
      this.utils.showNotification("error", this.utils.tr('app.compo.cra.addMultiDate.error.endDateBeforeStart'))
    }
  }

  onEndDateInputChanged(date: Date, error: string) {
    this.myObj.endDate=new Date(date.getTime() + 24*60*60*1000);  //debug du fin-1
    this.errorDates=error;
    ////////////this.logger.debug("main onChangeDateDeb myDatePickerDeb", date, error);
    if(this.errorDates) {
      this.utils.showNotification("error", this.utils.tr('app.compo.cra.addMultiDate.error.endDateBeforeStart'))
    }
  }

  /***
   * Invoked to add new item
   */
  push() {
    // Validate that adding this activity won't exceed 1 day for any date in the range
    if (!this.validateActivityRange()) {
      return;
    }

    this.data.push(this.myObj);
    this.data.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    this.myObj = new MultiDateActivity();
    this.activityForm.reset();
    this.timesForm.reset();
    this.validationError = "";
    if(this.myDatePickerDebFin)     this.myDatePickerDebFin.reset();
    else {
      ////////this.logger.debug("cant reset because: myDatePickerDebFin IS NULL")
    }
  }

  /***
   * Validate that adding the current activity won't exceed 1 day for any date in its range
   */
  validateActivityRange(): boolean {
    if (!this.myObj.startDate || !this.myObj.endDate || !this.myObj.activity || !this.myObj.time) {
      return false;
    }

    const startDate = new Date(this.datePipe.transform(this.myObj.startDate, 'yyyy-MM-dd'));
    const endDate = new Date(this.datePipe.transform(this.myObj.endDate, 'yyyy-MM-dd'));
    
    // Check each day in the range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      let totalTime = this.myObj.time;
      
      // Add time from activities in the dialog (this.data)
      this.data.forEach((value) => {
        if (value.startDate.getTime() <= currentDate.getTime() && currentDate.getTime() <= value.endDate.getTime()) {
          totalTime += value.time;
        }
      });

      // Add time from existing activities in currentCra.craDays
      if (this.currentCra && this.currentCra.craDays) {
        const craDay = this.currentCra.craDays.find(craDay => {
          const dayDate = new Date(this.datePipe.transform(craDay.day, 'yyyy-MM-dd'));
          return dayDate.getTime() === currentDate.getTime();
        });

        if (craDay && craDay.craDayActivities) {
          craDay.craDayActivities.forEach(cda => {
            totalTime += cda.nbDay;
          });
        }
      }

      if (totalTime > 1) {
        this.validationError = this.utils.tr('app.compo.cra.addMultiDate.error.exceedsOneDay') + 
          ' (' + this.datePipe.transform(currentDate, 'dd-MM-yyyy') + ')';
        return false;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.validationError = "";
    return true;
  }

  /***
   * invoked to remove item form data objects
   * @param index
   */
  removeItem(index: number) {
    this.data.splice(index, 1)
  }

  /***
   * This method used to test if current date eligible to added or no
   * @param date
   */
  isBetweenTowDate(date: Date): boolean {
    let state: boolean = false;
    let time: number = 0;
    this.data.forEach((value, index) => {
      if (value.startDate.getTime() <= date.getTime() && date.getTime() <= value.endDate.getTime()) {
        time = time + value.time;
      }
    })
    if (time + this.myObj.time > 1) {
      state = true;
    }
    return state;
  }

  /***
   * This method used to test if current date eligible to added or no
   * @param date
   */
  isBetweenActivity(date: Date): boolean {
    let state: boolean = false;
    let currentActivity: Activity = this.myObj.activity;
    if (currentActivity != null) {
      if (currentActivity.type.name == "MISSION") {
        let startDate: string = this.datePipe.transform(currentActivity.dateDeb, 'yyyy-MM-dd');
        let endDate: string = this.datePipe.transform(currentActivity.dateFin, 'yyyy-MM-dd');
        // //////////this.logger.debug("DBG isBetweenActivity : currentActivity: ", currentActivity)
        if (new Date(startDate).getTime() <= date.getTime()
          && date.getTime() <= new Date(endDate).getTime()) {
          state = true;
        }
        if (!state) {
          this.utils.showNotification("error", this.utils.tr('app.compo.cra.addMultiDate.error.outOfInterval') + " [" + startDate + "," + endDate + "]")
        }
      } else {
        state = true;
      }
    }

    return state;

  }


  /***
   * invoked to add observer to listener of cra observable
   * @param observer
   */
  subscribe(observer: CraObserver): void {
    this.observers.push(observer);
  }

  /***
   * invoked to remove observer form the listener of cra observable
   * @param observer
   */
  unsubscribe(observer: CraObserver): void {
    let index: number = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }

  /***
   * Used to notify all observer
   */
  notifyObservers(): void {
    this.observers.forEach(observer => observer.update(this));
  }

  /**
   * invoked when you need to refresh current cra from the range dates added
   */
  update(): void {
    this.data.forEach((value) => {
      this.currentCra.craDays
        .filter(craDay => {
          return new Date(this.datePipe.transform(craDay.day, 'yyyy-MM-dd')).getTime() <= value.endDate.getTime() &&
            new Date(this.datePipe.transform(craDay.day, 'yyyy-MM-dd')).getTime() >= value.startDate.getTime()
        })
        .forEach(craDay => {
          if (craDay.type == "DAY_WORKED") {
            let tmp: CraDayActivity = new CraDayActivity();
            tmp.activity = value.activity;
            tmp.nbDay = value.time;
            let nbDay: number = 0;
            craDay.craDayActivities.forEach(item => {
              nbDay = nbDay + item.nbDay;
            })
            if (nbDay + value.time <= 1) {
              craDay.craDayActivities.push(tmp);
            } else {
              craDay.craDayActivities = [];
              craDay.craDayActivities.push(tmp);
            }
          }
        })
    });
    this.data = new Array();
    this.modal.dismissAll(this.addRangeDateView);
    this.notifyObservers();
  }


}
