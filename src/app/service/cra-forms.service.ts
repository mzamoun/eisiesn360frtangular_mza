import { LoggerService } from './logger.service';



import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Activity } from '../model/activity';
import { Consultant } from '../model/consultant';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class CraFormsService {

  constructor(private logger: LoggerService, ) {
  }

  /**
   *
   * @param tab tableau d'objets
   * @param objetId
   */
  getObjetIndexById(tab: any, objetId): number {
    ////////////this.logger.debug("getObjetIndexById objetId:" + objetId)
    let res = -1;
    ////this.logger.debug(tab)
    for (let i = 0; i < tab.length; i++) {
      if (tab[i].id == objetId) {
        res = i;
        break;
      }
    }
    ////////////this.logger.debug("getObjetIndexById res:" + res);
    return res;
  }

  selectProject(fb: FormBuilder, projects: Project[], myObj: Activity): FormGroup {
    ////////////this.logger.debug("selectProject:")
    let projectForm: FormGroup;
    if (myObj.project != undefined) {
      let indexSelected = this.getObjetIndexById(projects, myObj.project.id);
      ////this.logger.debug(indexSelected)
      projectForm = fb.group(
        {
          ["projectControl"]: [indexSelected]
        }
      );
    }
    ////////////this.logger.debug("selectProject:END")
    return projectForm;
  }

  //////////////////////////////////////////////////////////

  selectConsultant(fb: FormBuilder, consultants: Consultant[], myObj: Activity): FormGroup {
    ////////////this.logger.debug("selectConsultant:")
    let consultantForm: FormGroup;
    if (myObj.consultant != undefined) {
      let indexSelected = this.getObjetIndexById(consultants, myObj.consultant.id);
      ////this.logger.debug(indexSelected)

      consultantForm = fb.group(
        {
          consultantControl: [indexSelected]
        }
      );
    }
    ////////////this.logger.debug("selectConsultant:END")
    return consultantForm;
  }

  //////////////////////////////////////////////////////////

}
