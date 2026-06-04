import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MereComponent } from 'src/app/compo/_utils/mere-component';
import { NotificationComponent } from 'src/app/compo/notification/notification.component';
import { UserConnectedComponent } from 'src/app/compo/user-connected/user-connected.component';
import { ConsultantService } from 'src/app/service/consultant.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { DataSharingService } from "../../service/data-sharing.service";
import { UtilsService } from "../../service/utils.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends MereComponent {
  language: string;
  notifications: Notification[]
  nbNotificationNotViewed = 0
  dateStr = ""
  timeStr = ""

  // Propriété pour l'affichage du nom de l'ESN (mis à jour automatiquement)
  displayEsnName: string | null = null;
  private isHydratingHeaderEsn = false;

  // @ViewChild('infors', {static: false}) infors: MereComponent;

  @ViewChild('notificationCompo', { static: false }) notificationCompo: NotificationComponent;

  constructor(private router: Router
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    , private esnService: EsnService
    , public consultantService: ConsultantService
    , private utilsIhm: UtilsIhmService
    , public dialog: MatDialog
    , private cdr: ChangeDetectorRef
  ) {
    super(utils, dataSharingService);
    this.logger.debug('HeaderComponent.constructor called');
  }

  ngOnInit() {
    this.logger.debug('HeaderComponent.ngOnInit called');

    super.ngOnInit()

    this.language = this.utils.getLocale();
    this.dataSharingService.setHeaderComponent(this);

    // let labelEsn = "maj esn on current consultant"
    // this.dataSharingService.addInfo(labelEsn)
    // this.dataSharingService.majEsnOnConsultant(
    //   (esn) => {
    //     this.dataSharingService.delInfo(labelEsn)
    //     if (esn?.name) {
    //       this.displayEsnName = esn.name;
    //     }
    //   },
    //   (err) => {
    //     this.dataSharingService.delInfo(labelEsn)
    //     this.dataSharingService.addError(new MyError("Erreur lors de la récupération de l'ESN de l'utilisateur", JSON.stringify(err)));
    //   }
    // )

    // S'abonner aux changements de l'ESN pour mettre à jour l'affichage
    this.subscriptions.push(
      this.dataSharingService.esnCurrentReady$.subscribe(esn => {
        this.displayEsnName = esn?.name || null;
      }),
      this.dataSharingService.listNotifications$.subscribe(notifications => {
        const list = notifications || [];
        this.nbNotificationNotViewed = list.filter(n => !n?.viewed).length;
      }),
      this.dataSharingService.userConnected$.subscribe(user => {
        // Mettre à jour displayEsnName quand userConnected change

        this.userConnected = user
        this.getCurentUserName();
        this.logger.debug("HeaderComponent - userConnected change : ", user)

        this.displayEsnName = user?.esnName || user?.esn?.name || null;

        if (user) {

          if (user.role !== 'ADMIN' && !user?.esn && !!user?.esnId && !this.isHydratingHeaderEsn) {
            this.isHydratingHeaderEsn = true;
            this.dataSharingService.majEsnOnConsultant(
              (esn) => {
                this.isHydratingHeaderEsn = false;
                if (this.userConnected) {
                  this.userConnected.esn = esn;
                  this.userConnected.esnName = esn?.name;
                }
                this.dataSharingService.esnCurrent = esn;
                this.dataSharingService.idEsnCurrent = esn?.id || null;
                this.dataSharingService.notifyEsnCurrentReady(esn);
                if (this.userConnected) {
                  this.dataSharingService.saveTokenUser(this.userConnected);
                }
                this.displayEsnName = esn?.name || null;
              },
              () => {
                this.isHydratingHeaderEsn = false;
              }
            );
          }

          // L'ESN est déjà synchronisée par DataSharingService pendant le login.
          // Ici on se contente de mettre à jour l'UI locale.
          this.consultantService.majAdminConsultant(this.userConnected)
        }

        this.cdr.detectChanges();

      })
    );

    this.setClock();

  }

  private setClock() {
    this.logger.debug('HeaderComponent.setClock called');
    setInterval(
      () => {
        let dateHeure = this.utils.formatDateToDateHeure(new Date);
        let tab = dateHeure.split(' ');
        this.dateStr = tab[0];
        this.timeStr = tab[1];
      }, 1000
    );
  }

  showCalendar() {
    this.logger.debug('HeaderComponent.showCalendar called');
    this.utilsIhm.openCalendarModal()
  }


  showNotificationsAll() {
    this.logger.debug('HeaderComponent.showNotificationsAll called');
    this.clearInfos();
    this.dataSharingService.showNotificationsAll();
  }

  public getNotifications() {
    this.logger.debug('HeaderComponent.getNotifications called');
    // //////////this.logger.debug("getListNotifications")

    if (this.notificationCompo) this.notificationCompo.getNotifications(null, null);
    this.notifications = this.notificationCompo ? this.notificationCompo.myList : new Array();
    if (!this.notifications) this.notifications = new Array();
    return this.notifications;
  }
  getNbNotifications() {
    this.logger.debug('HeaderComponent.getNbNotifications called');
    // //////////this.logger.debug("getNbNotifications")
    // this.getListNotifications();
    this.nbNotificationNotViewed = this.notificationCompo ? this.notificationCompo.nbNotification : 0;
    return this.nbNotificationNotViewed;
  }

  // getNotViewedNotifications() {
  //   this.notificationCompo.getNotViewedNotifications( ); 
  // }

  //ICON USER
  menuUserConnected() {
    this.logger.debug('HeaderComponent.menuUserConnected called');
    if (this.dataSharingService.isLoggedIn()) {

      this.dataSharingService.isDisableSearchStrInput = true;

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "580px";
      dialogConfig.height = "570px";

      let dialogRef = this.dialog.open(UserConnectedComponent, dialogConfig);

    }
  }

}
