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

  lineOptions: number[] = [20, 50, 100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  selectedLines = 10000;
  nbLinesTotal: number | string = 'N/A';
  logLines: string[] = [];
  errorLines: string[] = [];
  lastRefresh: Date | null = null;
  loadingLogs = false;
  isForbidden = false;
  activeTab: 'logs' | 'errors' = 'logs';

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

    if (!this.isAdmin) {
      this.isForbidden = true;
      this.addErrorTitleMsg('Acces refuse', 'Cette page est reservee aux administrateurs.');
      this.router.navigate(['/home']);
      return;
    }

    this.refreshLogs();
  }

  refreshLogs(): void {
    if (!this.isAdmin) {
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
        this.filterErrorLines();
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

  private filterErrorLines(): void {
    this.errorLines = this.logLines.filter(line => 
      line.toLowerCase().includes('error') || 
      line.toLowerCase().includes('exception') ||
      line.toLowerCase().includes('failed')
    );
  }

  switchTab(tab: 'logs' | 'errors'): void {
    this.activeTab = tab;
  }

  copyText(): void {
    const textToCopy = this.logLines.join('\n');
    this.copyToClipboard(textToCopy, 'AdminLogViewerComponent.copyText');
  }

  copyErrors(): void {
    const textToCopy = this.errorLines.join('\n');
    this.copyToClipboard(textToCopy, 'AdminLogViewerComponent.copyErrors');
  }

  private copyToClipboard(textToCopy: string, logLabel: string): void {
    if (!textToCopy) {
      return;
    }

    const onSuccess = () => {
      this.logger.debug(`${logLabel} copied to clipboard`);
    };

    const onFailure = () => {
      this.logger.debug(`${logLabel} clipboard copy failed`);
    };

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(() => {
        this.copyTextFallback(textToCopy);
        onFailure();
      });
      return;
    }

    this.copyTextFallback(textToCopy);
    onSuccess();
  }

  private copyTextFallback(textToCopy: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }

}
