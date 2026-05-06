


import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/model/activity';
import { ActivityType } from 'src/app/model/activityType';
import { Client } from 'src/app/model/client';
import { Esn } from 'src/app/model/esn';
import { Project } from 'src/app/model/project';
import { ActivityService } from 'src/app/service/activity.service';
import { ActivityTypeService } from 'src/app/service/activityType.service';
import { ClientService } from 'src/app/service/client.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { ProjectService } from 'src/app/service/project.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-esn-arbo',
  templateUrl: './esn-arbo.component.html',
  styleUrls: ['./esn-arbo.component.css']
})
export class EsnArboComponent extends MereComponent {

  @Input()
  esn: Esn;

  constructor(private route: ActivatedRoute, private router: Router, private esnService: EsnService
    , private consultantService: ConsultantService, private craService: CraService
    , private activityService: ActivityService , private activityTypeService: ActivityTypeService
    , private clientService: ClientService, private projectService: ProjectService
    , public utils: UtilsService, protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService
    );

  }

  ngOnInit(): void {
  }

  refreshEsn(esn: Esn) {
    this.getListResp(esn)
  }

  //eviter bcl infinie 
  t1 = 0
  t2 = 0
  getListResp(esn: Esn) {
    this.t1 = Date.now()

    this.logger.debug("t2-t1", this.t2 - this.t1)

    this.beforeCallServer("getListResp")
    this.esnService.refreshEsn(esn).subscribe(
      data => {
        this.t2 = Date.now()
        this.afterCallServer("getListResp", data)
        esn = data.body.result;
        this.logger.debug("getListResp data : ", data)
      }, error => {
        this.addErrorFromErrorOfServer("getListResp", error);
        ////this.logger.debug(error);
      }
    );
  }

  getListClients(esn: Esn) {
    this.beforeCallServer("getListClients")
    this.esnService.getListClients(esn).subscribe(
      data => {
        this.afterCallServer("getListClients", data)
        this.esn.listClient = data.body.result;
        this.logger.debug("getListClients Esn : ", this.esn.listConsultant)
      }, error => {
        this.addErrorFromErrorOfServer("getListClients", error);
        ////this.logger.debug(error);
      }
    );
  }

  getListProjects(cli: Client) {
    this.beforeCallServer("getProjectsOfClient")
    this.projectService.getProjectsOfClient(cli).subscribe(
      data => {
        this.afterCallServer("getProjectsOfClient", data)
        cli.listProject = data.body.result;
        this.logger.debug("getProjectsOfClient : ", cli.listProject)
      }, error => {
        this.addErrorFromErrorOfServer("getProjectsOfClient", error);
        ////this.logger.debug(error);
      }
    );
  }

  getListActivity(proj: Project) {
    this.beforeCallServer("getListActivityOfProject")
    this.activityService.getListActivityOfProject(proj).subscribe(
      data => {
        this.afterCallServer("getListActivityOfProject", data)
        proj.listActivity = data.body.result;
        this.logger.debug("getListActivityOfProject : ", proj.listActivity)
      }, error => {
        this.addErrorFromErrorOfServer("getListClients", error);
        ////this.logger.debug(error);
      }
    );
  }


  deleteEsn(esn: Esn) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteEsnByName', { name: esn.name }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.esnService.deleteById(esn.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.refreshEsn(esn);
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

  deleteClient(obj: Client, esn: Esn) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteClientByName', { name: obj.name }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.clientService.deleteById(obj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.getListClients(esn);
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

  deleteProject(obj: Project, cli: Client) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteProjectByName', { name: obj.name }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.projectService.deleteById(obj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.getListProjects(cli);
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

  deleteActivity(act: Activity, proj: Project) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteActivityByName', { name: act.name }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.activityService.deleteById(act.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.getListActivity(proj);
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

  deleteActivityType(type: ActivityType, esn : Esn) {
    let mythis = this;
    this.utilsIhm.confirmYesNo(this.utils.tr('app.common.confirm.deleteActivityTypeByName', { name: type.name }), mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.activityTypeService.deleteById(type.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data);
              if (!this.isError()) {
                mythis.refreshEsn(esn);
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
