


import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDatePickerDirectiveConfig } from 'ng2-date-picker';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Msg } from '../../../model/msg';
import { MsgService } from '../../../service/msg.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-msg-form',
  templateUrl: './msg-form.component.html',
  styleUrls: ['./msg-form.component.css']
})
export class MsgFormComponent extends MereComponent {

  title: string = ""
  btnSaveTitle: string = ""
  isAdd: string;

  @Input()
  myObj: Msg;

  dateOptions: IDatePickerDirectiveConfig = { format: "YYYY-MM-DDTHH:mm:ss.SSSZ", };

  constructor(private route: ActivatedRoute, private router: Router
    , private msgService: MsgService
    , private consultantService: ConsultantService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    this.initByMsg();
  }

  initByMsg() {

    ////this.logger.debug('initByMsg')
    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }
    ////this.logger.debug(isAdd)

    if (this.isAdd == 'true') {
      this.btnSaveTitle = this.utils.tr('Add')
      this.title = this.utils.tr('app.msg.form.new')
      this.myObj = new Msg();
    } else {
      this.btnSaveTitle = this.utils.tr('Save')
      this.title = this.utils.tr('app.msg.form.edit')
      let msgP: Msg = this.msgService.getMsg();
      ////this.logger.debug('msgP='+msgP);

      if (msgP != null) this.myObj = msgP;
      else if (this.myObj == null) this.myObj = new Msg();
    }

    this.consultantService.majMsg(this.myObj)
  }

  onSubmit() {
    ////this.logger.debug(this.myObj);
    this.beforeCallServer("onSubmit");
    this.msgService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        if (!this.isError()) this.gotoMsgList()
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
        ;
      }
    );
  }


  gotoMsgList() {
    this.clearInfos();
    this.router.navigate(['/msg_list']);
  }
}
