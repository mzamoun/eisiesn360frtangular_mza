import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Document } from 'src/app/model/document';
import { NoteFrais } from 'src/app/model/noteFrais';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { NoteFraisService } from 'src/app/service/note-frais.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Notification } from "../../model/notification";
// 
import { UtilsService } from "../../service/utils.service";
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent extends MereComponent implements AfterViewInit {

  @Input() isOnlyNotViewed: boolean = false;
  @Input() isShowBtns: boolean = true;
  @Input() idPagination = "idPagination";
  myList: Notification[];
  nbNotification = 0;
  title = "";

  refreshEverySecMin = 5;
  refreshEverySec = 10;  //seconds
  refreshLoopId: any;
  refreshStarted = false;

  dirImg = "assets/images/"
  imgRead = this.dirImg + "mail_read.png";
  imgUnRead = this.dirImg + "mail_unread.png";
  imgNotification = "";
  notifBulle = "";

  @ViewChild('detailsFeeView', { static: true }) detailsFeeView: TemplateRef<any>;
  selectedFee: NoteFrais;

  @ViewChild('detailsDocumentView', { static: true }) detailsDocumentView: TemplateRef<any>;
  selectedDocument: Document;


  constructor(
    public utils: UtilsService
    , public dataSharingService: DataSharingService
    , protected utilsIhm: UtilsIhmService
    , private craService: CraService
    , private noteFraisService: NoteFraisService
    , private dialog: MatDialog
    , private modal: NgbModal
    , private cdr: ChangeDetectorRef
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    // S'abonner aux notifications via le BehaviorSubject
    this.dataSharingService.listNotifications$.subscribe(notifications => {
      this.updateNotifications(notifications);
    });

    // Charger les notifications initiales
    this.getNotifications(null, null);
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  getNbElement() {
    this.nbNotification = this.myList ? this.myList.length : 0;
    return this.nbNotification;
  }

  setTitle() {
    var t = "List Notifications"
    if (this.isOnlyNotViewed) t += " Not Viewed"

    this.title = t + " (" + this.getNbElement() + ")";
  }

  refresh() {
    // Assurer un minimum de temps entre chaque refresh
    this.refreshEverySec = Math.max(this.refreshEverySec, this.refreshEverySecMin);

    // Toggle le refresh
    if (this.refreshStarted) {
      // Arrêter le refresh
      clearInterval(this.refreshLoopId);
      this.refreshStarted = false;
    } else {
      // Démarrer le refresh silencieux (sans recharger toute la page)
      this.refreshLoopId = setInterval(() => {
        this.refreshNotificationsSilently();
      }, this.refreshEverySec * 1000);
      this.refreshStarted = true;
    }
  }

  /**
   * Rafraîchit uniquement les notifications sans recharger tout l'écran
   */
  private refreshNotificationsSilently() {
    this.dataSharingService.getNotifications(
      (listNotif) => {
        // Mise à jour silencieuse - pas de message, pas de rechargement
        // updateNotifications sera appelé automatiquement via l'observer
      },
      (error) => {
        // Erreur silencieuse - ne pas afficher d'erreur pour un refresh automatique
        console.warn('Refresh automatique des notifications échoué:', error);
      }
    );
  }

  isMyListEmpty() {
    return this.getNbElement() == 0;
  }

  /**
   * 
   * @param listAll called by dataSharingService, after calling it
   */
  updateNotifications(listAll: Notification[]) {
    // Filtrer les notifications si nécessaire
    const newList = this.isOnlyNotViewed
      ? (listAll || []).filter(n => !n.viewed)
      : listAll;

    // Simple assignment - Angular détectera les changements via trackBy
    this.myList = newList || [];

    this.getNbElement();
    this.setTitle();
    this.myList00 = this.myList;

    // Marquer pour vérification au lieu de forcer une détection complète
    this.cdr.markForCheck();
  }

  /**
   * TrackBy function pour optimiser le rendu de la liste
   */
  trackByNotificationId(index: number, notification: Notification): any {
    return notification?.id || index;
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }

  getNotifications(fctOk: Function, fctKo: Function) {
    this.dataSharingService.getNotifications(fctOk, fctKo);
  }

  findAll() {
    this.dataSharingService.getNotifications(null, null);
  }

  saveNotification(notification: Notification, fctOk?: Function, fctKo?: Function) {
    this.dataSharingService.saveNotification(notification, fctOk, fctKo);
  }

  changeViewed(notification: Notification) {
    if (notification.viewed == null) notification.viewed = false;
    notification.viewed = !notification.viewed;
    this.saveNotification(notification);
  }
  getBulle(notification: Notification) {
    if (notification.viewed == null) notification.viewed = false;
    if (notification.viewed) this.notifBulle = "Set Unread"
    else this.notifBulle = "Set Read"
    return this.notifBulle
  }
  getImgRead(notification: Notification) {
    if (notification.viewed == null) notification.viewed = false;
    if (notification.viewed) this.imgNotification = this.imgRead
    else this.imgNotification = this.imgUnRead
    return this.imgNotification
  }


  deleteNotification(notification: Notification) {
    let mythis = this;
    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec date=" + notification.createdDate, mythis
      , () => {
        mythis.dataSharingService.deleteNotification(notification.id, null, null);
      }
      , () => { }
    );

  }

  getTitle() {
    return "Note de Frais N° " + this.selectedFee.id;
  }

  getTimeAgoNotification(notification: Notification) {

    let dateFrom: Date = new Date();

    if (!notification) return -1;

    var date1: any = notification.createdDate;
    // var date1 : Date = new Date() ;

    let date2 = dateFrom;

    // let typeDate = typeof date1;

    if (typeof date1 == "string") {
      // 2021-06-28T15:36:21.977+0000
      date1 = new Date(notification.createdDate);
    }

    // To calculate the time difference of two dates
    var ms = date2.getTime() - date1.getTime();

    var sTotal = Math.floor(ms / 1000);
    var mnTotal = Math.floor(sTotal / 60);
    var s = sTotal - mnTotal * 60;

    var hTotal = Math.floor(mnTotal / 60);
    var mn = mnTotal - hTotal * 60;

    var dTotal = Math.floor(hTotal / 24);
    var h = hTotal - dTotal * 24;

    return dTotal + " days " + h + " hours " + mn + " mn ";
  }

  /**
   * show cra in notification 
   * it will call showCra of dataSharingService after marking the notification as viewed and saving it, 
   * then showCra will call notifyCraUpdated to update the current CRA and notify all subscribers of 
   * current CRA (like craFormCalComponent) to update their CRA and show the updated CRA in the form
   * @param notification 
   */
  private mergeCraComment(cra: any, notification: Notification, originalCra: any = null) {
    if (!cra) {
      return cra;
    }

    const craInList = cra.id != null ? this.dataSharingService.getCraInListCraById(cra.id) : null;
    const currentCra = cra.id != null && this.dataSharingService.getCurrentCra()?.id == cra.id
      ? this.dataSharingService.getCurrentCra()
      : null;
    const fallbackComment = cra.comment
      || originalCra?.comment
      || notification?.cra?.comment
      || currentCra?.comment
      || craInList?.comment
      || notification?.message;
    const fallbackStatus = cra.status
      || originalCra?.status
      || notification?.cra?.status
      || currentCra?.status
      || craInList?.status;
    const fallbackValidByConsultant = cra.validByConsultant ?? originalCra?.validByConsultant
      ?? notification?.cra?.validByConsultant ?? currentCra?.validByConsultant ?? craInList?.validByConsultant;
    const fallbackValidByManager = cra.validByManager ?? originalCra?.validByManager
      ?? notification?.cra?.validByManager ?? currentCra?.validByManager ?? craInList?.validByManager;

    if (!cra.comment && fallbackComment) {
      cra.comment = fallbackComment;
    }

    if (!cra.status && fallbackStatus) {
      cra.status = fallbackStatus;
    }

    if (cra.validByConsultant == null && fallbackValidByConsultant != null) {
      cra.validByConsultant = fallbackValidByConsultant;
    }

    if (cra.validByManager == null && fallbackValidByManager != null) {
      cra.validByManager = fallbackValidByManager;
    }

    return cra;
  }

  showForm(notification: Notification) {

    const label = "Notification.showForm";
    console.log(label + " START - notification: ", notification);

    this.clearInfos();

    if (!notification) {
      console.error(label + " ERROR - notification est null");
      this.addErrorTxt("Notification null");
      return;
    }

    if (!notification.cra || !notification.cra.id) {
      console.error(label + " ERROR - notification.cra est null");
      this.addErrorTxt("CRA non trouvé dans la notification");
      return;
    }

    let label2 = label + " - CRA ID: " + notification.cra.id + " - récupération du CRA en cours...";
    this.addInfo(label2);
    const originalCra = notification.cra;

    this.craService.findAll().subscribe(
      (data) => {
        this.delInfo(label2);
        const allCra = data?.body?.result || [];
        console.log(label + " - liste CRA trouvée: data : ", data);
        this.dataSharingService.setListCra(allCra);

        const craFromList = allCra.find(cra => cra?.id === notification.cra.id);
        if (!craFromList) {
          console.warn(label + " - CRA introuvable dans findAll, fallback sur la notification");
          notification.cra = this.mergeCraComment(notification.cra, notification, originalCra);
        } else {
          notification.cra = this.mergeCraComment(craFromList, notification, originalCra);
        }

        this.dataSharingService.showCra(notification.cra);
        notification.viewed = true;
        this.saveNotification(notification, (saveData) => {
          console.log(label + " - callback saveNotification OK: ", saveData);
          this.dataSharingService.fromNotif = true;
        }, (error) => {
          console.error(label + " - ERREUR saveNotification: ", error);
        });
      },
      (error) => {
        this.delInfo(label2);
        console.error(label + " - ERREUR lors de la récupération de la liste des CRA: ", error);
        this.addErrorTxt("Erreur lors de la récupération de la liste des CRA : " + JSON.stringify(error));
      }
    );



    // root to list cra 
    // this.dataSharingService.navigateTo("cra_list");

    // setTimeout(() => {
    //   this.dataSharingService.showCra(notification.cra);
    // }, 1000);

    // this.dataSharingService.showCra(cra);

  }

  showCra(notification: Notification) {
    // Keep a single opening flow for CRA from notifications to avoid status drift.
    this.showForm(notification);


  }

  showFee(notification: Notification) {
    this.selectedFee = notification.noteFrais;
    console.log("showFee", notification)
    this.modal.open(this.detailsFeeView, { size: 'lg' });
    this.clearInfos();
    notification.viewed = true;
    this.saveNotification(notification);

    this.dataSharingService.fromNotif = true;
    // this.dataSharingService.showFeeViaLoading(notification.currentFee);
  }

  showDocument(notification: Notification) {
    this.selectedDocument = notification.currentDocument;
    console.log("showDoc", notification)
    this.modal.open(this.detailsDocumentView, { size: 'lg' });
    this.clearInfos();
    notification.viewed = true;
    this.saveNotification(notification);

    this.dataSharingService.fromNotif = true;
  }

  getLabelShowCraConge(notification: Notification) {
    let s = "";
    let type = notification.title.split(" ")[0];
    type = this.utils.tr(type);
    let show = this.utils.tr("Show");

    // console.log("type="+type+".") 

    s = show + " " + type;
    return s;
  }

}
