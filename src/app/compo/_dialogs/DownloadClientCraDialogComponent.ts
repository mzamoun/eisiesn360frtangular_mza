import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mail } from 'src/app/model/Mail';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { MsgService } from 'src/app/service/msg.service';

export interface DownloadClientCraDialogData {
  status: string;
  fullNameConsultant: string;
  monthCra: string;
  clientName: string;
  clientMail: string;
  fileName: string;
  linkSource: string;  // base64 PDF data URL
}

@Component({
  selector: 'app-download-client-cra-dialog',
  template: `
    <div class="dialog-wrapper">
      <div class="dialog-title">
        <mat-icon class="title-icon">picture_as_pdf</mat-icon>
        CRA Client — <span class="client-name">{{ data.clientName }}</span>
      </div>
      <div class="dialog-content">
        <div class="info-row">
          <mat-icon class="info-icon">insert_drive_file</mat-icon>
          <span class="info-label">Fichier</span>
          <span class="info-value">{{ data.fileName }}</span>
        </div>
        <div class="info-row">
          <mat-icon class="info-icon">info</mat-icon>
          <span class="info-label">Statut</span>
          <span class="status-badge" [ngClass]="'status-' + (data.status | lowercase)">{{ data.status }}</span>
        </div>
      </div>
      <div class="dialog-actions">
        <button mat-raised-button color="primary" (click)="download()">
          <mat-icon>download</mat-icon> Télécharger
        </button>
        <button mat-raised-button color="accent" (click)="sendByEmail()" *ngIf="data.status === 'VALIDATED'">
          <mat-icon>email</mat-icon> Envoyer par email
        </button>
        <button mat-stroked-button (click)="close()">
          <mat-icon>close</mat-icon> Fermer
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-wrapper {
      border: 2px solid #3f51b5;
      border-radius: 8px;
      padding: 10px;
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 500;
      color: #3f51b5;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
      margin-bottom: 0;
    }
    .title-icon {
      color: #e53935;
      font-size: 1.6rem;
      height: 1.6rem;
      width: 1.6rem;
    }
    .client-name {
      font-weight: 700;
    }
    .dialog-content {
      padding: 20px 0 8px 0;
      min-width: 440px;
    }
    .info-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .info-icon {
      color: #757575;
      font-size: 1.2rem;
      height: 1.2rem;
      width: 1.2rem;
    }
    .info-label {
      font-weight: 600;
      color: #555;
      min-width: 60px;
    }
    .info-value {
      color: #333;
      word-break: break-all;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .status-validated  { background: #e8f5e9; color: #2e7d32; }
    .status-rejected   { background: #ffebee; color: #c62828; }
    .status-to_validate { background: #fff8e1; color: #f57f17; }
    .status-draft      { background: #e3f2fd; color: #1565c0; }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 8px;
      gap: 8px;
      border-top: 1px solid #e0e0e0;
    }
    .dialog-actions button mat-icon {
      margin-right: 4px;
      font-size: 1rem;
      height: 1rem;
      width: 1rem;
      vertical-align: middle;
    }
  `]
})
export class DownloadClientCraDialogComponent {

  @Input() data: DownloadClientCraDialogData = {
    status: '',
    fullNameConsultant: '',
    monthCra: '',
    clientName: '',
    clientMail: '',
    fileName: '',
    linkSource: ''
  };

  @Output() closeRequested = new EventEmitter<void>();

  constructor(
    @Optional() public dialogRef: MatDialogRef<DownloadClientCraDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) injectedData: DownloadClientCraDialogData,
    private msgService: MsgService,
    private dataSharingService: DataSharingService
  ) {
    if (injectedData) {
      this.data = injectedData;
    }
  }

  download(): void {
    const downloadLink = document.createElement('a');
    downloadLink.href = this.data.linkSource;
    downloadLink.download = this.data.fileName;
    downloadLink.click();
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.closeRequested.emit();
    }
  }

  sendByEmail(): void {
    if (!this.data?.clientMail) {
      this.dataSharingService.addErrorTxt('Email client introuvable. Impossible d\'envoyer le CRA.');
      return;
    }

    console.log(`Sending CRA PDF for client ${this.data.clientName} by email...`);

    let mail = new Mail();
    mail.to = this.data.clientMail;
    mail.cc = "";
    mail.subject = `CRA de ${this.data.fullNameConsultant} au mois de ${this.data.monthCra}`;
    mail.msg = `Bonjour ${this.data.clientName},\n\n<br><br>Veuillez trouver ci-joint le CRA de ${this.data.fullNameConsultant} pour le mois de ${this.data.monthCra}.\n\n<br><br>Cordialement.`;
    mail.attachments = {};
    mail.attachments[this.data.fileName] = this.data.linkSource;

    this.dataSharingService.addInfo(mail.subject)
    this.msgService.sendMailSimple(mail, true).subscribe(
      response => {
        this.dataSharingService.delInfo(mail.subject)
        let labelEmailSent = `Email envoyé avec succès au client ${this.data.clientName}.`;
        this.dataSharingService.addInfo(labelEmailSent);
        console.log("Email sent successfully:", response);
        this.close();
        setTimeout(() => {
             this.dataSharingService.delInfo(labelEmailSent);
        }, 2000);
      },
      error => {
        this.dataSharingService.delInfo(mail.subject)
        this.dataSharingService.addErrorTxt('Erreur lors de l\'envoi de l\'email client.');
        console.error("Error sending email:", error);
        this.close();
      }
    );  

  }
}
