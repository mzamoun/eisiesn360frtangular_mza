import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminLogService } from 'src/app/service/admin-log.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-admin-log-viewer',
  templateUrl: './admin-log-viewer.component.html',
  styleUrls: ['./admin-log-viewer.component.css']
})
export class AdminLogViewerComponent extends MereComponent implements OnInit {

  lineOptions: number[] = [20, 50, 100, 200, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  selectedLines = 200;
  nbLinesTotal: number | string = 'N/A';
  logLines: string[] = [];
  lastRefresh: Date | null = null;
  loadingLogs = false;
  isForbidden = false;

  constructor(
    private adminLogService: AdminLogService,
    private router: Router,
    public utils: UtilsService,
    public dataSharingService: DataSharingService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (!this.isAdminUser()) {
      this.isForbidden = true;
      this.addErrorTitleMsg('Acces refuse', 'Cette page est reservee aux administrateurs.');
      this.router.navigate(['/home']);
      return;
    }

    this.refreshLogs();
  }

  refreshLogs(): void {
    if (!this.isAdminUser()) {
      this.isForbidden = true;
      return;
    }

    this.loadingLogs = true;
    const label = 'loadAdminLogs';
    this.beforeCallServer(label);
    this.loadNbLinesTotal();

    this.adminLogService.tail(this.selectedLines).subscribe(
      (lines: string[]) => {
        this.afterCallServer(label, lines);
        this.logLines = lines || [];
        this.lastRefresh = new Date();
        this.loadingLogs = false;
      },
      (error) => {
        this.addErrorFromErrorOfServer(label, error);
        this.loadingLogs = false;
      }
    );
  }

  private loadNbLinesTotal(): void {
    this.adminLogService.refreshLineCount().subscribe(
      (count: number) => {
        this.nbLinesTotal = count >= 0 ? count : 'N/A';
      },
      () => {
        this.nbLinesTotal = 'N/A';
      }
    );
  }

  private isAdminUser(): boolean {
    return this.dataSharingService.userConnected?.role === 'ADMIN';
  }
}
