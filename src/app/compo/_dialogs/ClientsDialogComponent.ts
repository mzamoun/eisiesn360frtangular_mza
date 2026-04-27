import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-clients-dialog',
    template: `
    <h2 mat-dialog-title>Sélectionner un client ({{ data.clients?.length }})</h2>
    <h3> {{infos}} </h3>
    <mat-dialog-content>
      <div *ngFor="let client of data.clients" class="client-btn">
        <button mat-raised-button color="primary" (click)="selectClient(client)">
          {{ client.name }}
        </button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annuler</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .client-btn {
      margin: 8px 0;
    }
  `]
})
export class ClientsDialogComponent implements OnInit  {
    infos: string = "";
    constructor(
        public dialogRef: MatDialogRef<ClientsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        console.log("constr : ClientsDialogComponent chargé, clients =", this.data.clients);
    }

    ngOnInit() {
        console.log("ClientsDialogComponent chargé, clients =", this.data.clients);
        // si aucun client, infos = "Aucun client disponible,  fermer le dialog apres 2s
        if (!this.data.clients || this.data.clients.length === 0) {
            let nbSec = 3 
            this.infos = `Aucun client disponible, fermeture du dialog dans ${nbSec} secondes...`; 
            setTimeout(() => {
                this.dialogRef.close();
            }, nbSec * 1000);
        }
    }

    onNoClick(): void {
        console.log("onNoClick ")
        this.dialogRef.close();
    }

    selectClient(client: any) {
        console.log("selectClient client : ", client)
        this.dialogRef.close(client);
    }
}
