import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Consultant } from 'src/app/model/consultant';
import { FileUpload } from 'src/app/model/FileUpload';
import { SupportExchange } from 'src/app/model/support-exchange';
import { SupportTicket } from 'src/app/model/support-ticket';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { LoggerService } from 'src/app/service/logger.service';
import { SupportService } from 'src/app/service/support.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit, OnDestroy {

  activeTab: 'new' | 'history' | 'exchanges' = 'new';

  supportTypes: Array<'erreur' | 'aide' | 'proposition'> = ['erreur', 'aide', 'proposition'];

  ticketForm = {
    type: 'erreur' as 'erreur' | 'aide' | 'proposition',
    sujet: '',
    actionsBeforeError: '',
    files: [] as FileUpload[]
  };

  currentUser: Consultant = null;
  supportTickets: SupportTicket[] = [];
  selectedTicket: SupportTicket = null;
  selectedTicketExchanges: SupportExchange[] = [];
  exchangeForm = {
    msg: '',
    files: [] as FileUpload[]
  };
  isLoadingTickets = false;
  isLoadingTicketDetails = false;
  isSendingTicket = false;
  isSendingExchange = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private logger: LoggerService,
    private dataSharingService: DataSharingService,
    private supportService: SupportService,
    public utils: UtilsService,
    private utilsIhmService: UtilsIhmService,
  ) { }


  ngOnInit(): void {
    this.dataSharingService.userConnected$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((previous, current) => this.isSameUser(previous, current))
      )
      .subscribe(user => {
        this.currentUser = user || null;
        if (this.currentUser) {
          this.loadMyTickets();
        } else {
          this.supportTickets = [];
          this.clearSelection();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isErreurType(): boolean {
    return this.ticketForm.type === 'erreur';
  }

  isSelectedTicketLocked(): boolean {
    return this.isTicketLocked(this.selectedTicket);
  }

  sendSupportTicket(): void {
    if (this.isSendingTicket) {
      return;
    }

    const sujet = (this.ticketForm.sujet || '').trim();
    const actionsBeforeError = (this.ticketForm.actionsBeforeError || '').trim();

    if (!sujet) {
      this.dataSharingService.addErrorTxt(this.utils.tr('app.help.error.subjectRequired'));
      return;
    }

    if (this.isErreurType()) {
      if (!actionsBeforeError) {
        this.dataSharingService.addErrorTxt(this.utils.tr('app.help.error.actionsBeforeErrorRequired'));
        return;
      }
    }

    if (!this.currentUser) {
      this.dataSharingService.addErrorTxt(this.utils.tr('app.help.error.userNotConnected'));
      return;
    }

    this.isSendingTicket = true;
    this.dataSharingService.clearErrors();

    const ticketPayload = this.buildTicketPayload();

    this.supportService.addTicket(ticketPayload).pipe(
      catchError((error) => {
        this.logger.error('Erreur creation ticket support', error);
        return of(null);
      })
    ).subscribe((response: any) => {
      this.isSendingTicket = false;

      if (!this.isSuccessfulResponse(response)) {
        this.dataSharingService.addErrorTxt(this.utils.tr('app.help.error.ticketCreateFailed'));
        return;
      }

      this.utilsIhmService.infoDialog(this.utils.tr('app.help.info.ticketCreated'));
      this.resetTicketForm();
      this.loadMyTickets();
    });
  }

  loadMyTickets(selectTicketId: number = null): void {
    if (!this.currentUser) {
      return;
    }

    this.isLoadingTickets = true;
    this.supportService.findMyTickets()
      .pipe(
        catchError((error) => {
          this.logger.error('Erreur chargement tickets support', error);
          this.isLoadingTickets = false;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        this.isLoadingTickets = false;
        this.supportTickets = this.extractTicketList(response);

        if (!this.supportTickets.length) {
          this.clearSelection();
          this.activeTab = 'new';
          return;
        }

        this.activeTab = 'history';

        const targetId = selectTicketId || this.selectedTicket?.id || this.supportTickets[0].id;
        const selected = this.supportTickets.find(ticket => ticket.id === targetId) || this.supportTickets[0];
        this.selectTicket(selected, false);
      });
  }

  selectTicket(ticket: SupportTicket, switchToExchangesTab: boolean = true): void {
    if (!ticket) {
      this.clearSelection();
      return;
    }

    this.selectedTicket = ticket;
    if (switchToExchangesTab) {
      this.activeTab = 'exchanges';
    }
    this.loadSelectedTicket(ticket.id);
  }

  setActiveTab(tab: 'new' | 'history' | 'exchanges'): void {
    if (tab === 'exchanges' && !this.selectedTicket) {
      return;
    }

    this.activeTab = tab;
  }

  addExchange(): void {
    if (this.isSendingExchange || !this.selectedTicket || this.isSelectedTicketLocked()) {
      return;
    }

    const message = (this.exchangeForm.msg || '').trim();
    if (!message) {
      this.dataSharingService.addErrorTxt(this.utils.tr('app.help.error.exchangeMessageRequired'));
      return;
    }

    if (!this.currentUser) {
      this.dataSharingService.addErrorTxt(this.utils.tr('app.help.error.userNotConnected'));
      return;
    }

    this.isSendingExchange = true;
    this.dataSharingService.clearErrors();

    const payload = this.buildExchangePayload();
    this.supportService.addExchange(this.selectedTicket.id, payload)
      .pipe(
        catchError((error) => {
          this.logger.error('Erreur ajout echange support', error);
          this.isSendingExchange = false;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        this.isSendingExchange = false;

        if (!this.isSuccessfulResponse(response)) {
          this.dataSharingService.addErrorTxt(this.utils.tr('app.help.error.exchangeAddFailed'));
          return;
        }

        this.resetExchangeForm();
        this.loadSelectedTicket(this.selectedTicket.id);
        this.utilsIhmService.infoDialog(this.utils.tr('app.help.info.exchangeAdded'));
      });
  }

  private loadSelectedTicket(ticketId: number): void {
    if (!ticketId) {
      this.selectedTicketExchanges = [];
      return;
    }

    this.isLoadingTicketDetails = true;
    this.supportService.findById(ticketId)
      .pipe(
        catchError((error) => {
          this.logger.error('Erreur chargement ticket support', error);
          this.isLoadingTicketDetails = false;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        this.isLoadingTicketDetails = false;
        const ticket = this.extractTicket(response);
        if (!ticket) {
          this.selectedTicketExchanges = [];
          return;
        }

        this.selectedTicket = ticket;
        this.selectedTicketExchanges = this.sortExchangesDesc(ticket.echanges || []);
        this.syncTicketInList(ticket);
      });
  }

  isTicketLocked(ticket: SupportTicket): boolean {
    return !!ticket && (ticket.is_resolu === true || ticket.is_closed === true);
  }

  ticketStatusLabel(ticket: SupportTicket): string {
    if (!ticket) {
      return this.utils.tr('app.help.status.unknown');
    }

    if (ticket.is_closed) {
      return this.utils.tr('app.help.status.closed');
    }

    if (ticket.is_resolu) {
      return this.utils.tr('app.help.status.resolved');
    }

    return this.utils.tr('app.help.status.open');
  }

  ticketLockMessage(ticket: SupportTicket): string {
    if (!ticket) {
      return '';
    }

    if (ticket.is_closed) {
      return this.utils.tr('app.help.locked.closed');
    }

    if (ticket.is_resolu) {
      return this.utils.tr('app.help.locked.resolved');
    }

    return '';
  }

  ticketRowClass(ticket: SupportTicket): string {
    return this.selectedTicket && ticket && this.selectedTicket.id === ticket.id ? 'selected' : '';
  }

  exchangeCount(ticket: SupportTicket): number {
    return ticket && ticket.echanges ? ticket.echanges.length : 0;
  }

  trackByTicketId(_: number, ticket: SupportTicket): number {
    return ticket?.id;
  }

  trackByExchangeId(_: number, exchange: SupportExchange): number {
    return exchange?.id;
  }

  private buildTicketPayload(): any {
    return {
      date_ticket: new Date(),
      email_sender: this.currentUser?.email || '',
      type: this.ticketForm.type,
      sujet: (this.ticketForm.sujet || '').trim(),
      actions_before_error: this.isErreurType() ? (this.ticketForm.actionsBeforeError || '').trim() : '',
      fichiers_ticket: this.extractFileNames(this.ticketForm.files),
      is_resolu: false,
      is_closed: false
    };
  }

  private buildExchangePayload(): any {
    return {
      date: new Date(),
      auteur: this.currentUser?.fullName || this.currentUser?.username || '',
      msg: (this.exchangeForm.msg || '').trim(),
      fichiers_echange: this.extractFileNames(this.exchangeForm.files),
      authorConsultantId: this.currentUser?.id || null
    };
  }

  private extractFileNames(files: FileUpload[]): string[] {
    return (files || [])
      .map(file => (file?.name || '').trim())
      .filter(name => !!name);
  }

  private extractTicketList(response: any): SupportTicket[] {
    const rawList = response?.body?.result || [];
    if (!Array.isArray(rawList)) {
      return [];
    }

    return rawList
      .map(ticket => this.normalizeTicket(ticket))
      .sort((left, right) => this.toTime(right?.date_ticket || right?.createdDate) - this.toTime(left?.date_ticket || left?.createdDate));
  }

  private extractTicket(response: any): SupportTicket {
    const ticket = response?.body?.result || response?.body || response?.result || null;
    return this.normalizeTicket(ticket);
  }

  private normalizeTicket(rawTicket: any): SupportTicket {
    if (!rawTicket) {
      return null;
    }

    const ticket = rawTicket as SupportTicket;
    ticket.fichiers_ticket = Array.isArray(ticket.fichiers_ticket) ? ticket.fichiers_ticket : [];
    ticket.echanges = this.sortExchangesDesc(Array.isArray(ticket.echanges) ? ticket.echanges : []);
    ticket.is_resolu = ticket.is_resolu === true;
    ticket.is_closed = ticket.is_closed === true;
    return ticket;
  }

  private sortExchangesDesc(exchanges: SupportExchange[]): SupportExchange[] {
    return [...(exchanges || [])]
      .sort((left, right) => this.toTime(right?.date || right?.createdDate) - this.toTime(left?.date || left?.createdDate));
  }

  private syncTicketInList(ticket: SupportTicket): void {
    if (!ticket || !ticket.id) {
      return;
    }

    const index = this.supportTickets.findIndex(item => item.id === ticket.id);
    if (index >= 0) {
      this.supportTickets[index] = {
        ...this.supportTickets[index],
        ...ticket
      };
    }
  }

  private clearSelection(): void {
    this.selectedTicket = null;
    this.selectedTicketExchanges = [];
    this.resetExchangeForm();
  }

  private resetTicketForm(): void {
    this.ticketForm = {
      type: 'erreur',
      sujet: '',
      actionsBeforeError: '',
      files: []
    };
  }

  private resetExchangeForm(): void {
    this.exchangeForm = {
      msg: '',
      files: []
    };
  }

  private isSuccessfulResponse(response: any): boolean {
    return response?.body?.result === true || response?.success === true;
  }

  private isSameUser(previous: Consultant, current: Consultant): boolean {
    return this.userKey(previous) === this.userKey(current);
  }

  private userKey(user: Consultant): string {
    if (!user) {
      return '';
    }

    if (user.id != null) {
      return 'id:' + user.id;
    }

    return 'username:' + (user.username || '');
  }

  private toTime(value: any): number {
    if (!value) {
      return 0;
    }

    const time = new Date(value).getTime();
    return isNaN(time) ? 0 : time;
  }

}
