


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Consultant } from 'src/app/model/consultant';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
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

  @Output()
  consultantSelected = new EventEmitter<Consultant>();

  constructor(private consultantService: ConsultantService
    , public utils: UtilsService, protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

  }

  ngOnInit(): void {
    if (this.consultant) {
      this.getListConsultants(this.consultant, true);
    }
  }

  selectConsultant(consultant: Consultant) {
    this.consultantSelected.emit(consultant);
  }

  getLabel(consultant: Consultant): string {
    if (!consultant) {
      return '';
    }

    const fullName = consultant.fullName || [consultant.firstName, consultant.lastName].filter(part => !!part).join(' ');
    const username = consultant.username ? `@${consultant.username}` : '';
    return `${fullName || username || this.utils.tr('User')} ${username && fullName ? username : ''}`.trim();
  }

  hasChildren(consultant: Consultant): boolean {
    return !!consultant?.listConsultant?.length;
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

}
