import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { SignupDialogComponent } from 'src/app/compo/_dialogs/signup-dialog/signup-dialog.component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Credentials } from '../../credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: Credentials = new Credentials('', '');
  info = "";
  error = "";
  showPassword = false;
  showForgotPasswordForm = false;
  forgotPasswordEmail = "";
  isLoadingResetEmail = false;
  lastLogins: { username: string; date: string }[] = [];

  constructor(
    private logger: LoggerService,
    private dataSharingService: DataSharingService,
    private router: Router,
    private dialog: MatDialog,
    public utils: UtilsService
  ) {
  }

  ngOnInit() {

    let lastUserName = this.dataSharingService.getLastUserName()
    this.logger.debug("login ngOnInit deb lastUserName : ", lastUserName)
    if (this.dataSharingService.isLoggedIn()) {
      this.logger.debug("login ngOnInit : user déjà loggé, redirection vers home")
      this.dataSharingService.gotoMyHome()
    }
    if (!this.credentials.username) this.credentials.username = lastUserName;

    this.loadLastLogins();
  }

  loadLastLogins(): void {
    try {
      const raw = localStorage.getItem(UtilsService.TOKEN_STORAGE_KEY_LAST_LOGINS);
      this.lastLogins = raw ? JSON.parse(raw) : [];
    } catch (_) {
      this.lastLogins = [];
    }
  }

  /**
   * LOGIN function 
   */
  public login(): void {
    this.dataSharingService.clearInfosErrors();
    this.dataSharingService.login(this.credentials, this);
  }

  goToSignup() {
    this.dataSharingService.IsAddEsnAndResp = true
    // this.dataSharingService.navigateTo("inscription");
    this.router.navigate(["inscription"]);
  }

  /**
   * Toggle le formulaire "Mot de passe oublié"
   */
  toggleForgotPasswordForm(): void {
    this.showForgotPasswordForm = !this.showForgotPasswordForm;
    if (this.showForgotPasswordForm) {
      // Pré-remplir avec l'email du login s'il existe
      if (!this.forgotPasswordEmail && this.credentials.username) {
        this.forgotPasswordEmail = this.credentials.username;
      }
    }
    this.error = '';
    this.info = '';
  }

  /**
   * Envoie un email de reset du password
   */
  resetPassword(): void {
    const label = 'resetPassword';

    if (!this.forgotPasswordEmail) {
      this.error = this.utils.tr('app.login.error.emailRequired');
      this.logger.error(label + ': Email manquant');
      return;
    }

    this.logger.debug(label + ': START - Email: ' + this.forgotPasswordEmail);
    this.isLoadingResetEmail = true;
    this.error = '';
    this.info = '';
    let username = "";
    if (this.dataSharingService.IsAddEsnAndResp) {
      username = this.dataSharingService.respEsnSaved?.username || "";
      if (!username) {
        username = this.dataSharingService.userConnected?.username || "";
      }
    }

    if (!username) {
      username = this.dataSharingService.userConnected?.username || "";
    }

    this.logger.debug(label + ': Username: ' + username);

    this.dataSharingService.sendResetPasswordEmail(username, this.forgotPasswordEmail, {
      next: (response) => {
        this.logger.debug(label + ': ✅ Email de reset envoyé avec succès');
        this.isLoadingResetEmail = false;
        this.info = this.utils.tr('app.login.info.resetLinkSent', { email: this.forgotPasswordEmail });
        this.forgotPasswordEmail = '';

        // Fermer le formulaire après 3 secondes
        setTimeout(() => {
          this.showForgotPasswordForm = false;
          this.info = '';
        }, 3000);
      },
      error: (error) => {
        this.logger.error(label + ': ❌ Erreur lors de l\'envoi du mail');
        this.logger.error(label + ': Error: ', error);
        this.isLoadingResetEmail = false;

        if (error.status === 404) {
          this.error = this.utils.tr('app.login.error.userNotFound');
        } else {
          this.error = this.utils.tr('app.login.error.sendMail');
        }
      }
    });
  }

  goToSignup00() {
    this.dataSharingService.IsAddEsnAndResp = true
    this.dialog.open(SignupDialogComponent, {
      width: '900px',
      height: '700px',
      disableClose: true
    });
  }

}
