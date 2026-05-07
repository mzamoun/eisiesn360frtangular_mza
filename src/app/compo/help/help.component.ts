import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Consultant } from 'src/app/model/consultant';
import { FileUpload } from 'src/app/model/FileUpload';
import { Mail } from 'src/app/model/Mail';
import { Msg } from 'src/app/model/msg';
import { Notification } from 'src/app/model/notification';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { LoggerService } from 'src/app/service/logger.service';
import { MsgService } from 'src/app/service/msg.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  supportTypes: Array<'erreur' | 'aide' | 'proposition'> = ['erreur', 'aide', 'proposition'];

  formData = {
    type: 'erreur' as 'erreur' | 'aide' | 'proposition',
    sujet: '',
    message: '',
    dateHeureErreur: '',
    actionRealisee: ''
  };

  selectedFiles: FileUpload[] = [];
  currentUser: Consultant = null;
  suportConsultants: Consultant[] = [];
  suportConsultant: Consultant = null;
  isSending = false;

  constructor(
    private logger: LoggerService,
    private consultantService: ConsultantService,
    private dataSharingService: DataSharingService,
    private msgService: MsgService,
    private utilsIhmService: UtilsIhmService,
  ) { }


  ngOnInit(): void {
    this.currentUser = this.dataSharingService?.userConnected || null;
    this.loadSupports();
  }

  isErreurType(): boolean {
    return this.formData.type === 'erreur';
  }

  sendSupportMessage(): void {
    if (this.isSending) {
      return;
    }

    const sujet = (this.formData.sujet || '').trim();
    const message = (this.formData.message || '').trim();
    const actionRealisee = (this.formData.actionRealisee || '').trim();
    const dateHeureErreur = (this.formData.dateHeureErreur || '').trim();

    if (!sujet) {
      this.dataSharingService.addErrorTxt('Le sujet est obligatoire.');
      return;
    }

    if (!message) {
      this.dataSharingService.addErrorTxt('Le message est obligatoire.');
      return;
    }

    if (this.isErreurType()) {
      if (!dateHeureErreur) {
        this.dataSharingService.addErrorTxt('La date et l heure de l erreur sont obligatoires.');
        return;
      }
      if (!actionRealisee) {
        this.dataSharingService.addErrorTxt('L action realisee est obligatoire pour une erreur.');
        return;
      }
    }

    if (!this.currentUser) {
      this.dataSharingService.addErrorTxt('Utilisateur non connecte.');
      return;
    }

    if (!this.suportConsultants || this.suportConsultants.length === 0) {
      this.dataSharingService.addErrorTxt('Aucun administrateur destinataire n a ete trouve.');
      return;
    }

    this.isSending = true;
    this.dataSharingService.clearErrors();

    const details = this.buildSupportDetailsText();
    const htmlMessage = this.toHtml(details);
    const supportEmails = this.suportConsultants
      .map(a => (a?.email || '').trim())
      .filter(e => !!e);

    const mail = new Mail();
    mail.subject = `[Support ${this.formData.type}] ${sujet}`;
    mail.to = supportEmails[0] || '';
    mail.cc = supportEmails.slice(1).join(',');
    mail.msg = htmlMessage;
    mail.attachments = this.buildAttachments();

    const msg = new Msg();
    msg.dateMsg = new Date();
    msg.msg = details;
    msg.type = 'SUPPORT';
    msg.typeId = 0;
    msg.from = this.currentUser;
    msg.to = this.suportConsultant;
    msg.isReadByTo = false;

    const notificationRequests = this.suportConsultants.map(admin => {
      const n = new Notification();
      n.createdDate = new Date();
      n.viewed = false;
      n.title = `Support - ${this.formData.type}`;
      n.message = `[${sujet}] ${message}`;
      n.fromUser = this.currentUser;
      n.fromUsername = this.currentUser.username;
      n.toUser = admin;
      n.toUsername = admin.username;
      return this.dataSharingService.addNotificationServer(n).pipe(
        catchError((error) => {
          this.logger.error('Erreur envoi notification support', error);
          return of(null);
        })
      );
    });

    const mailRequest = this.msgService.sendMailSimple(mail).pipe(
      catchError((error) => {
        this.logger.error('Erreur envoi mail support', error);
        return of(null);
      })
    );

    const msgRequest = this.msgService.save(msg).pipe(
      catchError((error) => {
        this.logger.error('Erreur sauvegarde msg support', error);
        return of(null);
      })
    );

    forkJoin([...notificationRequests, mailRequest, msgRequest]).subscribe((results: any[]) => {
      this.isSending = false;

      const notifResults = results.slice(0, notificationRequests.length);
      const mailResult = results[notificationRequests.length];
      const notifSent = notifResults.some(r => !!r);
      const mailSent = !!mailResult;

      if (notifSent) {
        this.dataSharingService.getNotifications(null, null);
      }

      if (notifSent && mailSent) {
        this.utilsIhmService.infoDialog('Votre message a bien ete envoye.');
        this.resetForm();
        return;
      }

      this.dataSharingService.addErrorTxt('Erreur lors de l envoi au support. Merci de reessayer.');
    });
  }

  private loadSupports(): void {
    this.consultantService.findAllSupports().subscribe(
      (data) => {
        // je suis en local, pourquoi je ne vois rien dans la console ?
        // eslint-disable-next-line no-console
        this.logger.debug('Chargement supports', data);
        this.suportConsultants = (data?.body?.result || []) as Consultant[];
        this.logger.debug('Supports chargés', this.suportConsultants);
        this.suportConsultant = this.suportConsultants.length > 0 ? this.suportConsultants[0] : null;
      },
      (error) => {
        this.logger.error('Erreur chargement supports', error);
        this.suportConsultants = [];
        this.suportConsultant = null;
      }
    );
  }

  private buildAttachments(): { [key: string]: any } {
    const attachments: { [key: string]: any } = {};
    for (const f of this.selectedFiles || []) {
      if (f?.name && f?.content) {
        attachments[f.name] = f.content;
      }
    }
    return attachments;
  }

  private buildSupportDetailsText(): string {
    const lines: string[] = [];
    lines.push(`Type: ${this.formData.type}`);
    lines.push(`Sujet: ${this.formData.sujet}`);
    lines.push(`Message: ${this.formData.message}`);

    if (this.isErreurType()) {
      lines.push(`Date/heure erreur: ${this.formData.dateHeureErreur}`);
      lines.push(`Action realisee: ${this.formData.actionRealisee}`);
    }

    lines.push('');
    lines.push('Infos consultant:');
    lines.push(`- fullName: ${this.currentUser?.fullName || ''}`);
    lines.push(`- role: ${this.currentUser?.role || ''}`);
    lines.push(`- esnName: ${this.currentUser?.esnName || this.currentUser?.esn?.name || ''}`);

    if (this.selectedFiles?.length) {
      lines.push('');
      lines.push('Fichiers joints:');
      for (const f of this.selectedFiles) {
        lines.push(`- ${f?.name || 'fichier'}`);
      }
    }

    return lines.join('\n');
  }

  private toHtml(text: string): string {
    return (text || '').replace(/\n/g, '<br>');
  }

  private resetForm(): void {
    this.formData = {
      type: 'erreur',
      sujet: '',
      message: '',
      dateHeureErreur: '',
      actionRealisee: ''
    };
    this.selectedFiles = [];
  }

}
