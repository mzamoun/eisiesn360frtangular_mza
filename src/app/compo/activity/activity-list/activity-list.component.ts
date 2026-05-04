


import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SelectConsultantComponent } from 'src/app/compo/_reuse/select-consultant/select-consultant.component';
import { ActivityType } from 'src/app/model/activityType';
import { Project } from 'src/app/model/project';
import { ActivityTypeService } from 'src/app/service/activityType.service';
import { ProjectService } from 'src/app/service/project.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Activity } from '../../../model/activity';
import { Consultant } from "../../../model/consultant";
import { ActivityService } from '../../../service/activity.service';
import { ConsultantService } from '../../../service/consultant.service';
import { DataSharingService } from "../../../service/data-sharing.service";
import { MereComponent } from '../../_utils/mere-component';
import { ActivityFormComponent } from '../activity-form/activity-form.component';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent extends MereComponent {

  myList: Activity[];
  myObj: Activity;
  title: string = '';
  /** le consultant des activites */
  @Input() consultant: Consultant = null;
  @ViewChild('selectConsultantCompo', { static: false }) selectConsultantCompo: SelectConsultantComponent;

  selectConsultantLabel: string = "app.compo.activity.select.consultant.title";

  /** Track if consultant filter was explicitly selected by user */
  consultantFilterApplied: boolean = false;

  /** Indicates if the current user can filter by consultant */
  canFilterByConsultant: boolean = false;

  managedConsultants: Consultant[] = [];
  projects: Project[];

  activityTypes: ActivityType[];

  @ViewChild('myObjEditView', { static: false }) myObjEditView: ActivityFormComponent;

  userConnected: Consultant

  constructor(
    private activityService: ActivityService
    , private activityTypeService: ActivityTypeService
    , private projectService: ProjectService
    , private consultantService: ConsultantService
    , protected router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , protected modal: NgbModal
    , public dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);

    this.userConnected = dataSharingService.userConnected

    this.colsSearch = ["name", "type", "project", "dateDeb", "dateFin", "consultant", "valid"]
  }

  ngOnInit() {
    this.logger.debug("ngOnInit DEB ")
    // Initialiser canFilterByConsultant
    const role = this.userConnected?.role;
    this.canFilterByConsultant = role === 'RESPONSIBLE_ESN' || role === 'MANAGER';
    
    // Réinitialiser le consultant à null et marquer que aucun filtre n'a été appliqué
    this.consultant = null;
    this.consultantFilterApplied = false;
    // Forcer le select-consultant à avoir elementSelected = null aussi
    if (this.selectConsultantCompo) {
      this.selectConsultantCompo.elementSelected = null;
    }
    this.updateTitle();
    this.findAll();
    if (this.myObjEditView != null) {
      this.myObjEditView.myObj = null;
    }

    this.dataSharingService.userSelectedActivity = this.consultant

    this.getProjects();
    // this.getConsultants();
    this.getActivityTypes();

  }

  onSelectConsultant() {
    this.searchStr = ""
    const selected = this.selectConsultantCompo?.elementSelected;
    this.logger.debug("onSelectConsultant - raw selected:", selected);
    this.logger.debug("onSelectConsultant - selected.id:", selected?.id);

    // Vérifier strictement : null, undefined, ou id invalide = null
    const isValidSelection = selected && selected.id != null && selected.id !== undefined && selected.id !== 0;
    this.consultant = isValidSelection ? selected : null;
    this.consultantFilterApplied = isValidSelection;

    this.logger.debug("onSelectConsultant - consultant set to:", this.consultant);
    this.logger.debug("onSelectConsultant - consultantFilterApplied:", this.consultantFilterApplied);
    this.findAll();
    this.updateTitle();
  }

  getTitle() {
    let t = "";
    let nbElement = 0;
    if (this.myList != null) nbElement = this.myList.length;
    //List Activity
    if (this.isConsultant()) t = this.utils.tr("ListAbsence");
    else t = this.utils.tr("ListActivites");

    t = t + " (" + nbElement + ")"

    // Afficher le consultant seulement si le filtre a été explicitement appliqué
    if (this.consultantFilterApplied && this.consultant != null) {
      t += " : " + this.consultant.fullName;
    } else {
      t += " : " + "All";
    }

    return t;
  }

  private updateTitle() {
    this.title = this.getTitle();
  }

  findAll() {
    this.logger.debug("findAll Activity DEB : ", this.myList)
    const role = this.userConnected?.role;
    const userId = this.userConnected?.id;
    const esnId = this.getEsnId();

    this.myList = [];
    this.myList00 = [];

    // CONSULTANT n'a pas accès
    if (role === 'CONSULTANT') {
      return;
    }

    this.beforeCallServer("findAll");

    // Si un consultant spécifique est sélectionné (filtre)
    this.logger.debug("findAll Activity - consultant filter:", this.consultant);
    if (this.consultant != null) {
      this.activityService.findAllByConsultant(this.consultant.id).subscribe(
        data => {
          this.afterCallServer("findAll", data);
          if (data.body != null) {
            this.myList = data.body.result || [];
            this.myList00 = this.myList;
            this.updateTitle();
          }
        },
        error => {
          this.addErrorFromErrorOfServer("findAll", error);
        }
      );
      return;
    }

    // Pas de filtre consultant: charger selon le rôle
    if (role === 'ADMIN') {
      // ADMIN voit TOUTES les activités
      this.activityService.findAll().subscribe(
        data => {
          this.afterCallServer("findAll", data);
          if (data.body != null) {
            this.myList = data.body.result || [];
            this.logger.debug("findAll Activity - ADMIN myList:", this.myList);
            this.myList00 = this.myList;
            this.updateTitle();
          }
        },
        error => {
          this.addErrorFromErrorOfServer("findAll", error);
        }
      );
    } else if (role === 'RESPONSIBLE_ESN') {
      // RESPONSIBLE_ESN: charger les activités de son ESN
      this.activityService.findAll().subscribe(
        data => {
          this.afterCallServer("findAll", data);
          if (data.body != null) {
            let allActivities = data.body.result || [];
            this.logger.debug("findAll Activity - RESPONSIBLE_ESN allActivities:", allActivities);
            this.logger.debug("findAll Activity - RESPONSIBLE_ESN allActivities map consultant.esnId:", allActivities.map(a => a.consultant?.esnId));
            this.dataSharingService.majConsultantInActivityList(allActivities,
              (activity) => {
                // Filtrer par ESN via consultant.esnId
                let x = activity.consultant?.esnId === esnId;
                if (x) {
                  this.myList.push(activity);
                  this.myList00.push(activity);
                  this.updateTitle();
                }
              }
            );

          }
        },
        error => {
          this.addErrorFromErrorOfServer("findAll", error);
        }
      );
    } else if (role === 'MANAGER') {
      // MANAGER: charger les activités de ses consultants
      // D'abord charger les consultants gérés par ce manager
      this.logger.debug("findAll Activity - MANAGER loading managed consultants for userId:", userId);
      this.myList = []
      this.consultantService.findAllChildConsultants(this.userConnected).subscribe(
        consultantsData => {
          this.logger.debug("findAll Activity - MANAGER consultantsData:", consultantsData);
          if (consultantsData.body != null) {
            this.managedConsultants = consultantsData.body.result || [];
            const managedConsultantIds = this.managedConsultants.map(c => c.id);
            // Ajouter le manager lui-même
            this.managedConsultants.push(this.userConnected);
            managedConsultantIds.push(userId);
            this.logger.debug("findAll Activity - MANAGER managedConsultantIds:", managedConsultantIds);

            // Charger toutes les activités
            this.activityService.findAll().subscribe(
              data => {
                this.afterCallServer("findAll", data);
                if (data.body != null) {
                  let allActivities = data.body.result || [];
                  this.myList = allActivities;
                  this.logger.debug("findAll Activity - MANAGER allActivities:", allActivities);
                  this.logger.debug("findAll Activity - MANAGER allActivities map consultantIds:", allActivities.map(a => a.consultantId));
                  // Filtrer par consultantId (pas consultant?.id)
                  // this.myList = allActivities.filter(a => managedConsultantIds.includes(a.consultantId));
                  this.logger.debug("findAll Activity - MANAGER filtered myList:", this.myList);
                  this.myList00 = this.myList;
                  this.updateTitle();
                }
              },
              error => {
                this.addErrorFromErrorOfServer("findAll", error);
              }
            );
          }
        },
        error => {
          this.logger.debug("findAll Activity - MANAGER error getting consultants:", error);
          // En cas d'erreur sur les consultants, charger toutes les activités et filtrer par manager
          this.activityService.findAll().subscribe(
            data => {
              this.afterCallServer("findAll", data);
              if (data.body != null) {
                let allActivities = data.body.result || [];
                // Fallback: filtrer par consultant.adminConsultantId
                // this.myList = allActivities.filter(a =>
                //   a.consultant?.adminConsultantId === userId || a.consultantId === userId
                // );
                this.myList00 = this.myList;
              }
            },
            error => {
              this.addErrorFromErrorOfServer("findAll", error);
            }
          );
        }
      );
    }
  }

  setMyList(list: any[]) {
    this.myList = list;
    this.updateTitle();
  }

  edit(activity: Activity) {
    this.clearInfos();
    let isGetType = false
    let isGetProject = false
    if (activity.type == null) {
      this.activityTypeService.findById(activity.typeId).subscribe(
        data => {
          this.logger.debug("edit activityTypeService.findById : id, data : ", activity.typeId, data)
          activity.type = data.body.result;
          isGetType = true
        }, error => {
          isGetType = true
          this.logger.debug(error);
        });
    }

    if (activity.project == null) {
      this.projectService.findById(activity.projectId).subscribe(
        data => {
          this.logger.debug("edit projectService.findById : id, data : ", activity.projectId, data)
          activity.project = data.body.result;
          isGetProject = true
        }, error => {
          isGetProject = true
          this.logger.debug(error);
        });
    }

    var n = 0, nMax = 5
    var x = setInterval(
      () => {
        if (!isGetProject && !isGetType && n < nMax) {
          n++
          this.activityService.setActivity(activity);
          this.router.navigate(['/activity_form']);
        } else {
          clearInterval(x);
          x = null
        }
      }, 3000
    )
  }

  showForm(myObj: Activity) {
    // Navigation vers le formulaire d'édition
    this.clearInfos();
    
    this.logger.debug("showForm - myObj:", myObj);
    
    // Toujours charger les objets complets depuis le serveur
    let isGetType = false;
    let isGetProject = false;
    let isGetConsultant = false;

    // Charger le type si typeId existe
    this.logger.debug("showForm - loading related entities for activity typeId:", myObj.typeId);
    if (myObj.typeId) {
      this.activityTypeService.findById(myObj.typeId).subscribe(
        data => {
          this.logger.debug("showForm activityTypeService.findById : id, data : ", myObj.typeId, data);
          if (data.body && data.body.result) {
            myObj.type = data.body.result;
          }
          isGetType = true;
        }, error => {
          this.logger.debug("showForm error loading type:", error);
          isGetType = true;
        });
    } else {
      isGetType = true; // Pas de typeId, pas besoin de charger
    }

    // Charger le project si projectId existe
    this.logger.debug("showForm - loading related entities for activity projectId:", myObj.projectId);
    if (myObj.projectId) {
      this.projectService.findById(myObj.projectId).subscribe(
        data => {
          this.logger.debug("showForm projectService.findById : id, data : ", myObj.projectId, data);
          if (data.body && data.body.result) {
            myObj.project = data.body.result;
          }
          isGetProject = true;
        }, error => {
          this.logger.debug("showForm error loading project:", error);
          isGetProject = true;
        });
    } else {
      isGetProject = true; // Pas de projectId, pas besoin de charger
    }

    // Charger le consultant si consultantId existe
    this.logger.debug("showForm - loading related entities for activity consultantId:", myObj.consultantId);
    if (myObj.consultantId) {
      this.consultantService.findById(myObj.consultantId).subscribe(
        data => {
          this.logger.debug("showForm consultantService.findById : id, data : ", myObj.consultantId, data);
          if (data.body && data.body.result) {
            myObj.consultant = data.body.result;
          }
          isGetConsultant = true;
        }, error => {
          this.logger.debug("showForm error loading consultant:", error);
          isGetConsultant = true;
        });
    } else {
      isGetConsultant = true; // Pas de consultantId, pas besoin de charger
    }

    // Attendre que toutes les données soient chargées avant de naviguer
    let attempts = 0;
    const maxAttempts = 20;
    const checkInterval = setInterval(() => {
      this.logger.debug("showForm - waiting for data:", { isGetType, isGetProject, isGetConsultant, attempts });
      if ((isGetType && isGetProject && isGetConsultant) || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        this.logger.debug("showForm - navigating with myObj:", myObj);
        
        // Passer le consultant dans dataSharingService
        this.logger.debug("showForm - setting consultant in dataSharingService:", myObj.consultant);
        if (myObj.consultant) {
          this.dataSharingService.userSelectedActivity = myObj.consultant;
          this.dataSharingService.consultantSelected = myObj.consultant;
        }
        
        // Stocker l'activité complète dans le service
        this.activityService.setActivity(myObj);
        
        // Naviguer vers le formulaire
        this.router.navigate(['/activity_form']);
      }
      attempts++;
    }, 200);
  }

  delete(myObj) {
    let myThis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, this
      , () => {
        myThis.beforeCallServer("delete")
        myThis.activityService.deleteById(myObj.id)
          .subscribe(
            data => {
              myThis.afterCallServer("delete", data)
              if (!myThis.isError()) {
                myThis.findAll();
                myThis.myObj = null;
              }
            }, error => {
              myThis.addErrorFromErrorOfServer("delete", error);
              ////this.logger.debug(error);
            }
          );
      }
      , null
    );

  }

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }

  isConsultantCurrentUser(): boolean {
    let idConsultant = -1;
    if (this.consultant != null) idConsultant = this.consultant.id;

    let id = this.userConnected.id;

    return id == idConsultant;

  }

  addActivity() {

    // si consultant null, alors consultant = userConnected
    if (this.consultant == null) {
      this.consultant = this.userConnected
    }
    this.dataSharingService.consultantSelected = this.consultant;
    this.dataSharingService.userSelectedActivity = this.consultant

    // this.dataSharingService.activityTypes = this.activityTypes
    // this.dataSharingService.projects = this.projects

    // Injecter le consultant sélectionné


    let isForCurentUser = 'false';
    if (this.isConsultantCurrentUser()) {
      isForCurentUser = 'true';
    }

    this.clearInfos();
    this.router.navigate(['/activity_form'], { queryParams: { 'isAdd': 'true', 'isForCurentUser': isForCurentUser } });
  }

  /****
   * This method invoked when i need to show the modal rejected cra
   */
  openModalPopup(templateRef: TemplateRef<any>) {
    this.modal.open(templateRef, { size: 'lg' });
  }

  getProjects() {
    if (this.projects == null) {

      ////////////this.logger.debug("getProjects:", this.myObj);
      this.beforeCallServer("getProjects");
      this.projectService.findAll(this.getEsnId()).subscribe(
        (data) => {
          this.afterCallServer("getProjects", data)
          this.projects = data.body.result;
          this.dataSharingService.projects = this.projects
          this.logger.debug("getProjects:", this.projects);
          if (data == undefined) {
            this.projects = new Array();
          }
        },
        (error) => {
          this.addErrorFromErrorOfServer("getProjects", error);
          ////this.logger.debug(error);
        }
      );
      ////////////this.logger.debug("getProjects:END");
    }
  }

  private getActivityTypes() {
    if (this.activityTypes == null) {

      ////////////this.logger.debug("getActivityTypes:");
      this.beforeCallServer("getActivityTypes");

      this.activityTypeService.findAll(this.getEsnId()).subscribe(
        (data) => {
          this.afterCallServer("getActivityTypes", data)
          ////this.logger.debug(data);
          this.activityTypes = data.body.result;
          this.dataSharingService.activityTypes = this.activityTypes
          this.logger.debug("getActivityTypes:", this.activityTypes);
          if (data == undefined) {
            this.activityTypes = new Array();
          }
        },
        (error) => {
          //this.logger.debug(error);
          this.addErrorFromErrorOfServer("getActivityTypes", error);
        }
      );
      ////////////this.logger.debug("getProjects:END");

    }
  }

  isConsultant(): boolean {
    return this.userConnected != null && this.userConnected.role === 'CONSULTANT';
  }

}
