


import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/model/activity';
import { Consultant } from 'src/app/model/consultant';
import { Cra } from 'src/app/model/cra';
import { ActivityService } from 'src/app/service/activity.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';
import { EsnArboComponent } from '../../esn/esn-arbo/esn-arbo.component';

@Component({
  selector: 'app-consultant-arbo',
  templateUrl: './consultant-arbo.component.html',
  styleUrls: ['./consultant-arbo.component.css']
})
export class ConsultantArboComponent extends MereComponent {

  @Input()
  consultant: Consultant;

  @Input()
  manager: Consultant;

   @Input()
   esnArbo: EsnArboComponent;

  constructor(private route: ActivatedRoute, private router: Router, private esnService: EsnService
    , private consultantService: ConsultantService, private craService: CraService, private activityService: ActivityService
    , public utils: UtilsService, protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService
    );

  }

  ngOnInit(): void {
    this.getListConsultants(this.consultant, true )
    this.getListCra(this.consultant, true )
    this.getListActivity(this.consultant, true )
  }

  getTitleListConsultants(consultant) {
    let s = "List ";
    if (consultant.role == 'RESPONSIBLE_ESN') s += 'Managers'
    if (consultant.role == 'MANAGER') s += 'Consultants'
    if (consultant.role == 'CONSULTANT') s += '____'

    return s;
  }

  getListConsultants(resp: Consultant, isForce = false) {

    if(resp == null) {
      this.logger.debug("resp NULL")
      this.addErrorTitleMsg("Error getListConsultants()", "resp NULL")
      return 
    }

    if (isForce || resp.listConsultant == null ) {
      this.beforeCallServer("getListConsultants")
      this.consultantService.findAllChildConsultants(resp).subscribe(
        data => {
          this.logger.debug("findAllChildConsultants : data", data)
          this.afterCallServer("getListConsultants", data)
          if (data != null && data.body != null) {
            resp.listConsultant = data.body.result;
          }else {
            resp.listConsultant = null 
          }
        }, error => {
          this.addErrorFromErrorOfServer("getListConsultants", error);
        }
      );
    }
  }

  deleteConsultant(consultant: Consultant, manager: Consultant) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteConsultantByUsername', { username: consultant.username }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.consultantService.deleteById(consultant.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.getListConsultants(manager, true);
                if(consultant.role == 'RESPONSIBLE_ESN') {
                  if(this.esnArbo != null) {
                    this.esnArbo.getListResp(this.getEsnCurrent());
                  }
                }
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


  getListCra(consultant: Consultant, isForce = false) {

    this.logger.debug("listCra ", consultant.listCra)

    if (consultant.listCra == null || isForce) {
      this.beforeCallServer("getListCra");
      this.craService.getListCraOfUser(consultant.username).subscribe(
        data => {
          this.logger.debug("cra list getListCra data:", data)
          this.afterCallServer("getListCra", data);
          // this.info00 = ''
          consultant.listCra = data.body.result;

          this.logger.debug("listCra ", consultant.listCra)

        }, error => {
          this.logger.debug("cra list getListCra error:", error)
          this.addErrorFromErrorOfServer("getListCra", error);
          //this.logger.debug(error);
        }
      );
    }
  }

  deleteCra(cra: Cra, consultant: Consultant) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteCraByLabel', { label: mythis.infoCra(cra) }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.craService.deleteById(cra.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.getListCra(consultant, true);
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

  infoCra(cra: Cra) {
    return cra.month + ":" + cra.nbDayWorked + "day : " + cra.status
  }

  getListActivity(consultant: Consultant, isForce = false) {

    if (consultant.listActivity == null || isForce) {
      this.beforeCallServer("getListActivity")
      this.activityService.getListActivityOfUser(consultant).subscribe(
        data => {
          this.logger.debug("getListActivity : data", data)
          this.afterCallServer("getListActivity", data)
          if (data != null && data.body != null) {
            consultant.listActivity = data.body.result;
          }
        }, error => {
          this.addErrorFromErrorOfServer("getListActivity", error);
        }
      );
    }
  }

  deleteActivity(act: Activity, consultant: Consultant) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteActivityByName', { name: act.name }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.activityService.deleteById(act.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.getListActivity(consultant, true);
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

}
