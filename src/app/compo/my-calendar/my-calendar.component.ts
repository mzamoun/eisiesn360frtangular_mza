import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.css']
})
export class MyCalendarComponent implements OnInit {

  selectedDate:Date = new Date();
  selectedDateStr : string = "";

  constructor(private logger: LoggerService, public activeModal: NgbActiveModal, public changeRef: ChangeDetectorRef, private utils: UtilsService) { }

  ngOnInit(): void {
    this.dateChanged(this.selectedDate)
  }

  dateChanged(event){
    this.logger.debug(event)
    this.selectedDate = event;
    this.selectedDateStr = this.utils.formatDate(this.selectedDate)
  }

  ok() {
    //  //////////this.logger.debug("ok")
    //this.choix="ok";
    //this.choix.emit("ok");
    this.activeModal.close('ok')
  }

  cancel() {
    ////////////this.logger.debug("cancel")
    //this.choix="cancel";
    //this.choix.emit("cancel");
    this.activeModal.close('cancel')
  }

  dismiss() {
      this.activeModal.dismiss('dismiss')
  }



}
