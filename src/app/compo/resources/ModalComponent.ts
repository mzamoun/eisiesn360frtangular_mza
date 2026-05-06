import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';
// mymodal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
 
  @Input() title;
  @Input() content;
  @Input() showCancel:boolean = true;

  //@Output() choix = new EventEmitter();
 
  constructor(private logger: LoggerService, public activeModal: NgbActiveModal, public utils: UtilsService) {}
 
  ngOnInit() {
  }

  ok() {
    //  //////////console.log("ok")
    //this.choix="ok";
    //this.choix.emit("ok");
    this.activeModal.close('ok')
  }

  cancel() {
    ////////////console.log("cancel")
    //this.choix="cancel";
    //this.choix.emit("cancel");
    this.activeModal.close('cancel')
  }

  dismiss() {
      this.activeModal.dismiss('dismiss')
  }
 
}
