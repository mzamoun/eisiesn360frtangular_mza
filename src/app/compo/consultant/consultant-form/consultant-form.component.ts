


import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions } from "mydatepicker";
import { Address } from 'src/app/model/address';
import { MyError } from 'src/app/resource/MyError';
import { EsnService } from 'src/app/service/esn.service';
import { MsgService } from 'src/app/service/msg.service';
import { PasswordValidatorService } from 'src/app/service/password-validator.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Constants } from "../../../model/constants/constants";
import { Consultant } from '../../../model/consultant';
import { Esn } from '../../../model/esn';
import { ConsultantService } from '../../../service/consultant.service';
import { DataSharingService } from "../../../service/data-sharing.service";
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';
import { LoadingDialogComponent } from '../../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-consultant-form',
  templateUrl: './consultant-form.component.html',
  styleUrls: ['./consultant-form.component.css']
})
export class ConsultantFormComponent extends MereComponent {

  title: string;
  btnSaveTitle: string;
  isAdd: string;

  @Input()
  myObj: Consultant;
  error: MyError;

  myDatePickerOptions: IMyDpOptions = UtilsService.myDatePickerOptions;

  esn: Esn; // v'est l'esn de son manager : sinon null
  roles: string[];
  esns: Esn[];

  // filter by manager
  manager: Consultant = null;
  emailPattern: string = UtilsService.EMAIL_PATTERN;
  usernamePattern: string = '^[A-Za-z0-9._-]{3,64}$';
  telPattern: string = UtilsService.TEL_PATTERN;
  confirmPassword: string;
  infoResetPassword: string;
  role: string;
  esnIdStr: string;
  esnId: number = 0;
  consultants: Consultant[];
  esnSavedName = ""
  loadingDialogRef: MatDialogRef<any> | null = null;
  passwordErrors: string[] = [];
  photoMaxSize = 2 * 1024 * 1024;

  constructor(private route: ActivatedRoute, private router: Router
    , public consultantService: ConsultantService
    , private esnService: EsnService
    , public utils: UtilsService
    , public utilsIhmService: UtilsIhmService
    , public dataSharingService: DataSharingService
    , private msgService: MsgService
    , private dialog: MatDialog
    , private passwordValidator: PasswordValidatorService
  ) {
    super(utils, dataSharingService);

  }

  ngOnInit() {
    // le userCoonected est le manager du user manipul�
    this.manager = this.dataSharingService.userConnected;

    if (!this.dataSharingService.IsAddEsnAndResp) {
      this.loadRoles();
      this.loadEsns();
    }

    this.initByConsultant();
    if (this.canEditManagerField()) {
      this.getConsultants();
    }
    //this.logger.debug('myObj', this.myObj)
  }

  initParams() {

    if (this.dataSharingService.IsAddEsnAndResp) {
      this.isAdd = "true"
    }

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }

    if (this.role == null) {
      this.role = this.route.snapshot.queryParamMap.get('role');
    }

    if (this.esnIdStr == null) {
      this.esnIdStr = this.route.snapshot.queryParamMap.get('esnIdStr');
      if (this.esnIdStr) {
        this.esnId = Number.parseInt(this.esnIdStr);
        // if(this.myObj != null) {
        //   this.myObj.idEsn = this.esnId 
        //   this.dataSharingService.addEsnInConsultant(this.myObj)
        // }
      }
    }

  }

  setTitle() {
    if (this.isAdd == 'true' || !this.myObj || !this.myObj.id) {
      this.isAdd = 'true'
      this.btnSaveTitle = this.utils.tr("Add");
      this.title = this.utils.tr("New") + " " + this.typeUser();
    } else {
      this.btnSaveTitle = this.utils.tr("Save");
      this.title = this.utils.tr("Edit") + " " + this.typeUser();
    }
  }

  initByConsultant() {

    this.initParams();

    this.setTitle();

    if (this.isAdd == 'true') {
      this.myObj = new Consultant();
      //par defaut active
      this.myObj.active = false
      if (this.userConnected) {
        this.myObj.active = true;
      }

      this.myObj.address = new Address()

      if (this.dataSharingService.IsAddEsnAndResp) {
        this.myObj.role = Constants.RESPONSIBLE_ESN
      }

      this.setEsn();

      this.myObj.level = 1
      this.myObj.positionCode = "1.1";
      this.myObj.payrollCoefficient = "95";
      this.myObj.defaultPaymentMode = this.utils.tr("Virement");
      //
      // Tes données restent des objets Date complexes
      this.myObj.entryDate = new Date();
      this.myObj.birthDay = this.utils.getDateNowMoinsYears(18);

      this.myObj.jobTitle = this.utils.tr("ING_ETUDES");
      if (this.myObj.role == Constants.RESPONSIBLE_ESN) {
        this.myObj.jobTitle = this.utils.tr("app.compo.inscription.responsibleEsn");
      }
      this.myObj.professionalStatus = this.utils.tr("CADRE");;
      this.myObj.tjmInterne = 206.5;
      this.myObj.matricule = "MAT-" + this.toDayStr();

    } else {
      let consultantP: Consultant = this.consultantService.getConsultant();

      if (consultantP != null) {
        this.myObj = consultantP;
      }
      else if (this.myObj == null) this.myObj = new Consultant();

    }

    if (this.myObj.address == null) {
      this.myObj.address = new Address();
    }

    this.ensureCurrentRoleAvailable();

    this.majAdminConsultant();

  }

  //////////////////////////////////////////////////////////
  // Getter pour Entry Date
  get entryDateString(): string {
    const date = this.myObj?.entryDate;
    // this.logger.info('entryDateString', date);
    if (!date) return '';

    // Si c'est un vrai objet Date
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    // this.logger.info('entryDateString is string', date);
    // Si c'est une String (ex: reçue du serveur "2026-03-03T...")
    // return date.split('T')[0];
    return date;
  }

  set entryDateString(value: string) {
    this.myObj.entryDate = value ? new Date(value) : null;
  }

  // Getter pour Birth Day
  get birthDayString(): string {
    const date = this.myObj?.birthDay;
    // this.logger.info('birthDayString', date);
    if (!date) return '';

    // Si c'est un vrai objet Date
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    // this.logger.info('birthDayString is string', date);
    // Si c'est une String (ex: reçue du serveur)
    // return date.split('T')[0];
    return date;
  }

  set birthDayString(value: string) {
    this.myObj.birthDay = value ? new Date(value) : null;
  }
  //////////////////////////////////////////////////////////

  majAdminConsultant() {
    this.consultantService.majAdminConsultant(this.myObj)
  }

  typeUser() {
    if (this.myObj && this.myObj.role) return this.myObj.role;
    else return this.utils.tr("User")
  }

  getPhotoUrl(consultant: Consultant): string | null {
    const photo = (consultant?.photo || '').trim();
    if (!photo) {
      return null;
    }

    if (photo.startsWith('data:image')) {
      return photo;
    }

    if (photo.startsWith('iVBOR')) {
      return 'data:image/png;base64,' + photo;
    }

    if (photo.startsWith('/9j/')) {
      return 'data:image/jpeg;base64,' + photo;
    }

    if (photo.startsWith('R0lGOD')) {
      return 'data:image/gif;base64,' + photo;
    }

    if (photo.startsWith('UklGR')) {
      return 'data:image/webp;base64,' + photo;
    }

    return 'data:image/jpeg;base64,' + photo;
  }

  onPhotoSelected(event: Event): void {
    const input = event?.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file || !this.myObj) {
      return;
    }

    if (!file.type?.startsWith('image/')) {
      this.addErrorTitleMsg('Photo invalide', 'Veuillez choisir un fichier image.');
      input.value = '';
      return;
    }

    if (file.size > this.photoMaxSize) {
      this.addErrorTitleMsg('Photo trop grande', 'Taille maximale: 2 Mo.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = (reader.result || '') as string;
      if (!result) {
        return;
      }

      // On conserve uniquement la base64 pour rester compatible avec le modèle backend existant.
      this.myObj.photo = this.extractBase64(result);
    };
    reader.onerror = () => {
      this.addErrorTitleMsg('Erreur photo', 'Impossible de lire le fichier sélectionné.');
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    if (!this.myObj) {
      return;
    }
    this.myObj.photo = '';
  }

  private extractBase64(dataUrl: string): string {
    const idx = dataUrl.indexOf(',');
    if (idx < 0) {
      return dataUrl;
    }
    return dataUrl.substring(idx + 1);
  }

  private ensureCurrentRoleAvailable(): void {
    const currentRole = this.myObj?.role;
    if (!currentRole) {
      return;
    }

    if (!this.roles) {
      this.roles = [currentRole];
      return;
    }

    if (this.roles.indexOf(currentRole) < 0) {
      this.roles = [currentRole, ...this.roles];
    }
  }

  ////////////////////////////////////////
  getConsultants() {

    this.beforeCallServer("getConsultants");
    this.consultantService.findNotAdminConsultant().subscribe(
      data => {
        this.afterCallServer("getConsultants", data)
        if (data == undefined) {
          this.consultants = new Array();
        } else {
          const currentEsnId = this.myObj?.esn?.id || this.myObj?.esnId || this.userConnected?.esn?.id || this.userConnected?.esnId;
          this.consultants = (data.body.result || [])
            .filter((c: Consultant) => {
              if (!c) return false;
              const isManagerCandidate = c.role === Constants.MANAGER || c.role === Constants.RESPONSIBLE_ESN;
              if (!isManagerCandidate) return false;

              const candidateEsnId = c.esn?.id || c.esnId;
              if (!currentEsnId || !candidateEsnId) return true;
              return currentEsnId === candidateEsnId;
            })
            .map((c: Consultant) => {
              const fullName = (c?.firstName && c?.lastName)
                ? (c.firstName + ' ' + c.lastName)
                : (c?.firstName || c?.lastName || c?.username || '');
              return { ...c, fullName } as Consultant;
            });

          // Le manager courant peut être hydraté async (adminConsultantId -> adminConsultant).
          // On s'assure qu'il est bien présent dans la liste et sélectionné.
          this.consultantService.majAdminConsultant(this.myObj, () => {
            this.ensureSelectedManagerInList();
            this.syncSelectedManagerInSelect();
          });
          this.ensureSelectedManagerInList();
          this.syncSelectedManagerInSelect();
          // this.dataSharingService.addEsnInConsultantList(this.consultants)
        }

      }, error => {
        this.addErrorFromErrorOfServer("getConsultants", error);
      }
    );
  }

  onSelectConsultant(consultant: Consultant) {
    this.myObj.adminConsultant = consultant;
    this.myObj.adminConsultantId = consultant?.id;
    this.dataSharingService.adminConsultant[this.myObj.id] = consultant;
  }
  @ViewChild('compoSelectConsultant', { static: false }) compoSelectConsultant: SelectComponent;
  selectConsultant(consultant: Consultant) {
    this.compoSelectConsultant.selectedObj = consultant;
  }

  private ensureSelectedManagerInList(): void {
    const selectedManager = this.myObj?.adminConsultant;
    if (!selectedManager?.id) {
      return;
    }

    const fullName = (selectedManager?.firstName && selectedManager?.lastName)
      ? (selectedManager.firstName + ' ' + selectedManager.lastName)
      : (selectedManager?.firstName || selectedManager?.lastName || selectedManager?.username || '');

    const normalizedManager = { ...selectedManager, fullName } as Consultant;
    if (!this.consultants) {
      this.consultants = [];
    }

    const index = this.consultants.findIndex(c => c?.id === normalizedManager.id);
    if (index >= 0) {
      this.consultants[index] = { ...this.consultants[index], ...normalizedManager } as Consultant;
    } else {
      this.consultants = [normalizedManager as Consultant, ...this.consultants];
    }
  }

  private syncSelectedManagerInSelect(): void {
    const selectedId = this.myObj?.adminConsultant?.id || this.myObj?.adminConsultantId;
    if (!selectedId || !this.compoSelectConsultant) {
      return;
    }

    if (!this.myObj.adminConsultant && this.consultants?.length) {
      const selectedManager = this.consultants.find(c => c?.id === selectedId);
      if (selectedManager) {
        this.onSelectConsultant(selectedManager);
      }
    }

    this.compoSelectConsultant.selectedObjId = selectedId;
    this.compoSelectConsultant.selectedObj = this.myObj.adminConsultant;
  }
  /////////////////////////////////////////


  setEsn() {

    if (this.role == "resp") {
      this.myObj.role = Constants.RESPONSIBLE_ESN;
    }

    if (this.myObj.role != Constants.RESPONSIBLE_ESN) {
      this.myObj.esn = this.userConnected.esn;
      this.myObj.esnId = this.userConnected.esnId;

      if (!this.myObj.esn) {
        this.myObj.esn = this.esnCurrent
        this.myObj.esnId = this.esnCurrent?.id
      }

      this.logger.debug("setEsn this.myObj.esn  : ", this.myObj.esn)
    } else {
      if (this.esnId > 0) {
        this.findEsnById(this.esnId)
      } else {
        this.onSelectEsn(this.myObj.esn);
      }
    }

    this.setTitle();

  }

  findEsnById(esnId: number) {
    let label = "find esn by id=" + esnId;
    this.esnService.findById(esnId).subscribe(
      data => {
        this.afterCallServer(label, data)
        if (!this.isError()) {
          this.myObj.esn = data.body.result;
          // this.myObj.idEsn = this.myObj.esn != null ? this.myObj.esn.id : -1;
          this.onSelectEsn(this.myObj.esn);
        }
      },
      error => {
        this.addErrorFromErrorOfServer(label, error);
      }
    );
  }

  onSelectEsn(esn: Esn) {

    if (esn) {
      this.myObj.esn = esn;
      this.myObj.esnId = esn?.id;
      this.emailChange()
      this.selectEsn(esn)
    } else {
      if (this.dataSharingService.IsAddEsnAndResp) {
        this.myObj.esn = this.dataSharingService.esnSaved;
        this.myObj.esnId = this.myObj.esn?.id;
        this.emailChange()
      }
    }

  }

  refreshEsnSaved() {
    if (this.dataSharingService.esnSaved) {
      this.myObj.esn = this.dataSharingService.esnSaved;
      this.esnSavedName = this.dataSharingService.esnSaved.name
      this.emailChange()
    }
  }

  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  gotoFirstName() {
    setTimeout(() => {
      this.firstNameInput.nativeElement.focus();
    }, 300);
  }


  @ViewChild('compoSelectEsn', { static: false }) compoSelectEsn: SelectComponent;
  selectEsn(esn: Esn) {
    this.myObj.esn = esn;
    // this.myObj.idEsn = this.myObj.esn != null ? this.myObj.esn.id : -1;
    if (this.compoSelectEsn != null) {
      this.compoSelectEsn.selectedObj = esn;
      if (esn != null) {
        this.compoSelectEsn.onChange00(esn.id);
      }
    }

  }

  public onSelectRole(role: string) {
    //////////this.logger.debug("onSelectRole:", this, this.myObj)
    this.myObj.role = role;
    this.myObj.admin = (this.myObj.role == Constants.MANAGER || this.myObj.role == Constants.RESPONSIBLE_ESN);
    if (this.myObj.role == Constants.MANAGER || this.myObj.role == Constants.CONSULTANT) {
      this.myObj.adminConsultant = this.manager
      this.myObj.adminConsultantId = this.manager?.id
    }
    this.setTitle()
  }

  @ViewChild('compoSelectRole', { static: false }) compoSelectRole: SelectComponent;
  selectRole(role: string) {

    var compoSelect: HTMLSelectElement = document.getElementById(this.compoSelectRole.selectId) as HTMLSelectElement;
    // this.logger.debug("selectRole compoSelect:", compoSelect)

    this.compoSelectRole.selectedObj = role;
    var id = this.roles != null ? this.roles.indexOf(role) : -1

    // id = 0 : est "Select Role"
    compoSelect.selectedIndex = id + 1;
  }

  resetPassword() {
    this.myObj.password = "To.Reset.2020"
    this.infoResetPassword = 'Password is rested.';
  }

  onSubmit() {
    this.logger.debug("onSubmit : deb ")

    this.myObj.username = this.utils.uniformUsername(this.myObj.username);
    this.myObj.email = this.utils.uniformUsername(this.myObj.email);

    this.logger.debug("this.myObj.email ", this.myObj.email)
    this.logger.debug("this.myObj.username ", this.myObj.username)

    // Fallback: resynchroniser les valeurs choisies dans les composants select vers le modèle.
    if (!this.myObj.role && this.compoSelectRole?.selectedObj) {
      this.onSelectRole(this.compoSelectRole.selectedObj);
    }

    if (!this.myObj.adminConsultantId && this.compoSelectConsultant?.selectedObjId && this.consultants?.length) {
      const selectedManager = this.consultants.find(c => c?.id == this.compoSelectConsultant.selectedObjId);
      if (selectedManager) {
        this.onSelectConsultant(selectedManager);
      }
    }

    if (!this.myObj.username || !this.myObj.email) {
      this.utilsIhmService.infoDialog('email or username is null !!')
      return
    }

    if (!this.validateUsernameRules()) {
      return;
    }

    // Sauvegarder le password saisie (en plain text) pour l'email
    // Le serveur va le hasher et le sauvegarder en BDD
    this.dataSharingService.passRespEsnSaved = this.myObj.password;


    //todo check if email exist : a la saisie . invalider le form si exist via une variable isEmailExist.
    // todo : confirmer avec le user son email en lui rappelant : prenom, nom, soc 

    this.verifyUsernameUniqueAndSave(this.dataSharingService.IsAddEsnAndResp);
  }

  private normalizeIdentityValue(v: string): string {
    return (v || '').trim();
  }

  private isEmailLike(v: string): boolean {
    const value = this.normalizeIdentityValue(v);
    if (!value) {
      return false;
    }
    const emailRegex = new RegExp(UtilsService.EMAIL_PATTERN, 'i');
    return emailRegex.test(value) || value.indexOf('@') >= 0;
  }

  private validateUsernameRules(): boolean {
    let username = this.normalizeIdentityValue(this.myObj?.username);
    let email = this.normalizeIdentityValue(this.myObj?.email).toLowerCase();

    if (!username || !email) {
      this.utilsIhmService.infoDialog('email or username is null !!');
      return false;
    }

    username = this.utils.uniformUsername(username);
    email = this.utils.uniformUsername(email);

    if (username.toLowerCase() === email) {
      this.utilsIhmService.infoDialog('Le username doit être différent de l\'email.');
      return false;
    }

    if (this.isEmailLike(username)) {
      this.utilsIhmService.infoDialog('Le username ne doit pas avoir la forme d\'un email.');
      return false;
    }

    this.myObj.username = username;
    this.myObj.email = email;

    return true;
  }

  private verifyUsernameUniqueAndSave(isPub: boolean): void {
    const label = 'verifyUsernameUnique';
    this.myObj.username = this.utils.uniformUsername(this.myObj.username);
    const username = this.normalizeIdentityValue(this.myObj?.username);
    this.beforeCallServer(label);

    this.consultantService.findConsultantByUsername(username, isPub).subscribe(
      data => {
        this.afterCallServer(label, data);
        const existing: Consultant = data?.body?.result;
        const isUsedByAnother = !!existing && !!existing.id && existing.id !== this.myObj?.id;

        if (isUsedByAnother) {
          this.utilsIhmService.infoDialog('Username déjà utilisé. Choisissez un autre username.');
          return;
        }

        this.proceedSaveConsultant();
      },
      error => {
        // En cas de 404 (username non trouvé), on peut sauvegarder.
        if (error?.status === 404) {
          this.proceedSaveConsultant();
          return;
        }
        this.addErrorFromErrorOfServer(label, error);
      }
    );
  }

  private proceedSaveConsultant(): void {
    this.logger.debug("this.manager.role:", '.' + this.manager?.role + '.')
    this.logger.debug("this.myObj.adminConsultant : start ", this.myObj.adminConsultant)
    this.myObj.username = this.utils.uniformUsername(this.myObj.username);
    this.myObj.email = this.utils.uniformUsername(this.myObj.email);
    if (this.userConnected && this.userConnected.role + '' != 'ADMIN') {
      this.logger.debug('NOT ADMIN')
      const managerToUse =
        this.userConnected.role === Constants.RESPONSIBLE_ESN
          ? (this.myObj.adminConsultant || this.manager)
          : this.manager;
      this.dataSharingService.majAdminConsultantId(this.myObj, managerToUse);

    }
    this.setEsn();
    this.logger.debug("onSubmit obj", this.myObj);
    let label = "onSubmit"
    this.beforeCallServer(label);
    this.logger.debug("this.myObj.adminConsultant : before save ", this.myObj.adminConsultant)
    this.consultantService.save(this.myObj, this.dataSharingService.IsAddEsnAndResp).subscribe(
      data => {
        this.afterCallServer(label, data)

        this.myObj = data.body.result

        this.logger.debug("after save this.myObj : ", this.myObj)
        this.logger.debug("this.myObj.adminConsultant : after save ", this.myObj.adminConsultant)

        if (this.dataSharingService.IsAddEsnAndResp) {
          this.dataSharingService.respEsnSaved = this.myObj
          this.logger.debug("after save respEsnSaved : ", this.dataSharingService.respEsnSaved)

          this.gotoFirstName()

          let esnSavedName = this.dataSharingService.esnSaved.name
          let respEsnSavedName = this.dataSharingService.respEsnSaved.fullName

          let msg = `Votre ESN "${esnSavedName}" et son Responsable "${respEsnSavedName}" ont été ajoutés :
          Voulez vous confirmer ? `;

          let label2 = "sendMail"
          this.utilsIhmService.confirmDialog(msg,
            () => {
              const msgLoading = label2 + " en cours...";
              // DEBUT du msg loading
              this.showLoadingDialog(msgLoading);

              this.dataSharingService.sendMailToValidEmailInscription(
                (data2, to, codeEmailToValidate) => {
                  this.afterCallServer(label2, data2)
                  // FIN du msg loading
                  this.closeLoadingDialog();
                  this.logger.debug(label2 + " isError : ", this.isError())
                  if (!this.isError()) {
                    this.utilsIhmService.infoDialog("Un email a bien été envoyé à " + to,
                      () => {
                        setTimeout(() => {
                          this.navigateTo("")
                        }, 100);
                      }
                    )
                  } else {
                    this.logger.debug(label2 + " Error : ", this.error)
                  }
                },
                (error) => {
                  // FIN du msg loading
                  this.closeLoadingDialog();
                  this.addErrorFromErrorOfServer(label2, error);
                  this.utilsIhmService.infoDialog(label2 + " Erreur envoie email : " + JSON.stringify(error))
                }
              )
            }, () => {
              this.logger.debug("sendMailSimple " + " annuler tout en supprimant les deux objs. ")
              // annuler tout en supprimant les deux objs.
            }
          )



        } else {
          this.gotoConsultantList()
        }

      },
      error => {
        this.addErrorFromErrorOfServer(label, error);

      }
    );

    // si on sauvegarde le userConnected, on doit rafraichir le header
    if (this.dataSharingService.userConnected.id == this.myObj.id && this.myObj.id != null) {
      this.dataSharingService.setUserConnected(this.myObj);
    }

  }

  usernameFocus(myModel: any) {
    if (this.isAdd) {
      myModel.control.setErrors(null);
      myModel.control.updateValueAndValidity();
    }
  }

  usernameLostFocus(myModel: any) {
    let label = "usernameChange"
    this.myObj.username = this.utils.uniformUsername(this.myObj.username);
    this.logger.info(label + " username: " + this.myObj.username);
    this.logger.info(label + " IsAddEsnAndResp: " + this.dataSharingService.IsAddEsnAndResp);
    this.logger.info(label + " isAdd: " + this.isAdd);

    if (this.isAdd) {
      this.beforeCallServer(label)
      this.consultantService.findConsultantByUsername(this.myObj.username, this.dataSharingService.IsAddEsnAndResp).subscribe(
        (data) => {
          this.logger.info(label + " data: ", data);
          this.afterCallServer(label, data)
          let res: Consultant = data?.body?.result;
          this.logger.info(label + " res: ", res);
          if (res != null) {
            myModel.control.setErrors({ alreadyExists: true });
            this.logger.warn(label + ": username already exists");
            this.addError(new MyError(label, "username already exists"));
          } else {
            myModel.control.setErrors(null);
            myModel.control.updateValueAndValidity();
          }
        }, (error) => {
          this.afterCallServer(label, error)
          this.logger.error(label + ": error:", error);
          this.addErrorFromErrorOfServer(label, error);
          // set focus on name field
          this.focusUsername();
        }
      )
    }
  }

  emailLostFocus(myModel: any) {
    let label = "emailChange"
    this.myObj.email = this.utils.uniformUsername(this.myObj.email);
    this.logger.info(label + " email: " + this.myObj.email);
    this.logger.info(label + " IsAddEsnAndResp: " + this.dataSharingService.IsAddEsnAndResp);
    this.logger.info(label + " isAdd: " + this.isAdd);

    if (this.isAdd) {
      this.beforeCallServer(label)
      this.consultantService.findConsultantByEmail(this.myObj.email, this.dataSharingService.IsAddEsnAndResp).subscribe(
        (data) => {
          this.logger.info(label + " data: ", data);
          this.afterCallServer(label, data)
          let res: Consultant[] = data?.body?.result;
          this.logger.info(label + " res: ", res);
          if (res != null && res.length > 0) {
            myModel.control.setErrors({ alreadyExists: true });
            this.logger.warn(label + ": email already exists");
            this.addError(new MyError(label, "email already exists"));
          } else {
            myModel.control.setErrors(null);
            myModel.control.updateValueAndValidity();
          }
        }, (error) => {
          this.afterCallServer(label, error)
          this.logger.error(label + ": error:", error);
          this.addErrorFromErrorOfServer(label, error);
          // set focus on name field
          this.focusEmail();
        }
      )
    }
  }

  @ViewChild('username') username!: ElementRef;
  focusUsername() {
    setTimeout(() => {
      this.username.nativeElement.focus();
    }, 300);
  }

  @ViewChild('email') email!: ElementRef;
  focusEmail() {
    setTimeout(() => {
      this.email.nativeElement.focus();
    }, 300);
  }

  gotoConsultantList() {
    this.logger.debug("gotoConsultantList")
    this.clearInfos();
    this.router.navigate(['/consultant_list']);
  }

  /***
   * This method aims to load all roles form back end side
   */
  private loadRoles() {

    if (this.roles == null) {

      let label = "loadRoles";
      this.beforeCallServer(label);
      this.consultantService.getRoles(this.dataSharingService.IsAddEsnAndResp).subscribe(data => {
        this.afterCallServer(label, data)
        if (data == undefined) this.roles = new Array();
        else {
          this.roles = data.body.result;
        }

        this.ensureCurrentRoleAvailable();

        this.logger.debug("*** roles : ", this.roles)

      }, error => {
        this.addErrorFromErrorOfServer(label, error);
      })
    }

  }

  private loadEsns() {

    if (this.esns == null) {

      let label = "loadEsns";
      this.beforeCallServer(label);
      this.esnService.findAll().subscribe(data => {
        this.afterCallServer(label, data)
        if (!data) this.esns = new Array();
        else {
          this.esns = data.body.result;

          this.esns.sort(this.compareEsnLast);

          if (this.manager) {
            if (!this.manager.esn && this.manager.esnId) {
              for (let e of this.esns) {
                if (e.id == this.manager.esnId) {
                  this.manager.esn = e
                  if (!this.esnCurrent) {
                    this.esnCurrent = e
                  }
                  break;
                }
              }
            }
          }
        }

      }, error => {
        this.addErrorFromErrorOfServer(label, error);
      })
    }

  }

  compareEsnLast(a: Esn, b: Esn) {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    return 0;
  }

  emailModelize() {
    let label = "emailModelize";
    this.setEsn();
    this.logger.debug(label + " : ", this.myObj)
    this.logger.debug(label + " Email : ", this.myObj.email)

    if (!this.myObj.esn) {
      this.myObj.esn = this.esnCurrent
    }
    if (!this.myObj.esn) {
      this.myObj.esn = this.manager?.esn
    }

    let domaine = ""
    // du manager : 
    let emailManagar = this.manager?.email
    if (emailManagar) {
      const parts = emailManagar.split('@');
      if (parts.length > 1) {
        domaine = parts[1];
      }
    } else {
      domaine = (this.myObj.esn?.name + ".com").toLowerCase().replace(/\s+/g, '-');
    }
    this.logger.debug(label + " Esn : ", this.myObj.esn)
    if (this.utils.isEmpty(this.myObj.email)) {
      this.logger.debug(label + " NULL")
      if (!this.utils.isEmpty(this.myObj.firstName) && !this.utils.isEmpty(this.myObj.lastName) && !this.utils.isEmpty(this.myObj.esn?.name)) {
        this.myObj.email = (this.myObj.firstName + "." + this.myObj.lastName + "@" + domaine).toLowerCase();
      }
    }

    this.emailChange()

  }

  emailFocus(myModel: any) {

    let label = "emailFocus";

    this.emailModelize()

    if (this.utils.isEmpty(this.myObj.username)) {
      this.logger.debug(label + " username NULL")
      if (!this.utils.isEmpty(this.myObj.firstName) && !this.utils.isEmpty(this.myObj.lastName)) {
        this.myObj.username = (this.myObj.firstName.charAt(0) + this.myObj.lastName).toLowerCase();
        this.myObj.username = this.utils.uniformUsername(this.myObj.username);
      }
    }

    if (this.isAdd) {
      myModel.control.setErrors(null);
      myModel.control.updateValueAndValidity();
    }

  }

  emailChange() {
    let label = "emailChange";

    this.logger.debug(label + " this.myObj.email ", this.myObj.email)
    this.myObj.email = (this.myObj.email || '').trim().toLowerCase();
    this.myObj.email = this.utils.uniformUsername(this.myObj.email);
  }

  showLoadingDialog(message: string): void {
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      width: '300px',
      disableClose: true,
      data: { message }
    });
  }

  closeLoadingDialog(): void {
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
      this.loadingDialogRef = null;
    }
  }

  canEditManagerField(): boolean {
    const role = this.userConnected?.role;
    return (role === 'ADMIN' || role === Constants.RESPONSIBLE_ESN) && !this.isMyObjAdmin();
  }


  isMyObjAdmin() {
    let res = false;
    if (this.myObj && this.myObj.role === Constants.ADMIN) res = true;
    return res;
  }

  // Validation du password
  validatePassword(): void {
    const result = this.passwordValidator.validate(this.myObj.password);
    this.passwordErrors = result.errors;
  }

  toDayStr(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //////////////end meths

}
