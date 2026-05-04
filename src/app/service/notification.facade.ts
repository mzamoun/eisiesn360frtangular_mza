import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Notification } from '../model/notification';
import { GenericResponse } from '../model/response/genericResponse';
import { LoggerService } from './logger.service';
import { UiFeedbackFacade } from './ui-feedback.facade';
import { UtilsService } from './utils.service';

/**
 * NotificationFacade — extraite de DataSharingService (refactor progressif).
 * Gère le flux de notifications (stream, cooldown, CRUD HTTP).
 * DataSharingService reste responsable de l'enrichissement CRA via postLoadHook.
 */
@Injectable({ providedIn: 'root' })
export class NotificationFacade {

  private readonly notificationUrl: string;
  private listNotificationsSource = new BehaviorSubject<Notification[]>([]);
  listNotifications$ = this.listNotificationsSource.asObservable();

  nbCallNotifications = 0;
  private isCallNotifications = false;
  private readonly notificationsCooldownMs = 3000;
  private lastNotificationsFetchTs = 0;

  /**
   * Hook appelé après chaque chargement réussi des notifications depuis le serveur.
   * DataSharingService le positionne pour enrichir les objets CRA dans les notifications.
   */
  postLoadHook: (() => void) | null = null;

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private uiFeedback: UiFeedbackFacade,
    private utils: UtilsService,
  ) {
    this.notificationUrl = environment.apiUrl + '/notifications';
  }

  getListNotifications(): Notification[] {
    return this.listNotificationsSource.value;
  }

  setListNotifications(list: Notification[]): void {
    this.listNotificationsSource.next(list);
  }

  private getNotificationsFromServer(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.notificationUrl);
  }

  /**
   * Méthode centrale : fetch avec cooldown et garde anti-doublon.
   */
  private fetchNotificationsWithCooldown(): Observable<Notification[]> {
    const now = Date.now();
    const cached = this.getListNotifications() || [];

    if (this.isCallNotifications) {
      this.logger.debug('fetchNotificationsWithCooldown: appel en cours, retour du cache');
      return of(cached);
    }

    if ((now - this.lastNotificationsFetchTs) < this.notificationsCooldownMs) {
      return of(cached);
    }

    this.isCallNotifications = true;
    this.nbCallNotifications++;
    this.lastNotificationsFetchTs = now;
    this.logger.debug('fetchNotificationsWithCooldown #', this.nbCallNotifications);

    return this.getNotificationsFromServer().pipe(
      tap((resp) => {
        const notifications = resp?.body?.result || [];
        this.setListNotifications(notifications);
        if (this.postLoadHook) this.postLoadHook();
        this.isCallNotifications = false;
        this.lastNotificationsFetchTs = Date.now();
        this.logger.debug('fetchNotificationsWithCooldown: chargées, count =', notifications.length);
      }),
      map((resp) => resp?.body?.result || []),
      catchError((error) => {
        this.logger.error('fetchNotificationsWithCooldown: erreur', error);
        this.isCallNotifications = false;
        this.lastNotificationsFetchTs = Date.now();
        return of(cached);
      })
    );
  }

  public loadNotifications(): Observable<Notification[]> {
    return this.fetchNotificationsWithCooldown();
  }

  public refreshNotifications(): void {
    this.fetchNotificationsWithCooldown().subscribe();
  }

  public forceRefreshNotifications(): void {
    this.lastNotificationsFetchTs = 0;
    this.isCallNotifications = false;
    this.fetchNotificationsWithCooldown().subscribe();
  }

  public getNotifications(fctOk: Function, fctKo: Function): void {
    this.fetchNotificationsWithCooldown().subscribe(
      (notifications) => { if (fctOk) fctOk(notifications); },
      (error) => { if (fctKo) fctKo(error); }
    );
  }

  public addNotificationServer(notification: Notification): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.notificationUrl, notification);
  }

  addNotification(notification: Notification, fctOk: Function, fctKo: Function): void {
    this.addNotificationServer(notification).subscribe(() => {
      this.getNotifications(fctOk, fctKo);
    }, error => {
      this.logger.error('add notification error', error);
      if (fctKo) fctKo(error);
    });
  }

  public saveNotificationServer(notification: Notification): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(this.notificationUrl, notification);
  }

  saveNotification(notification: Notification, fctOk: Function, fctKo: Function): void {
    this.saveNotificationServer(notification).subscribe(() => {
      this.getNotifications(fctOk, fctKo);
    }, error => {
      this.logger.error('save notification error', error);
      if (fctKo) fctKo(error);
    });
  }

  public deleteNotificationServer(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.notificationUrl + '/deleteById/' + id);
  }

  deleteNotification(id: number, fctOk: Function, fctKo: Function): void {
    this.deleteNotificationServer(id).subscribe(() => {
      this.getNotifications(fctOk, fctKo);
    }, error => {
      this.logger.error('delete notification error id=' + id, error);
      if (fctKo) fctKo(error);
    });
  }

  public deleteNotificationsOfConsultant(consultantId: number, fctOk: Function, fctKo: Function): void {
    const label = 'deleteNotificationsOfConsultant consultantId=' + consultantId;
    this.logger.debug(label, 'START');
    this.http.delete<GenericResponse>(this.notificationUrl + '/deleteByConsultantId/' + consultantId).subscribe((data) => {
      this.logger.debug(label, 'deleteByConsultantId success', data);
      this.getNotifications(fctOk, fctKo);
    }, error => {
      this.logger.error(label, 'deleteByConsultantId error consultantId=' + consultantId, error);
      if (fctKo) fctKo(error);
    });
  }

  /**
   * @param username : résultat de DataSharingService.getLastUserName()
   */
  public deleteNotifications(username: string, fctOk: Function, fctKo: Function): void {
    const label = 'deleteNotifications';
    this.uiFeedback.addInfo(label);
    this.http.delete<GenericResponse>(this.notificationUrl + '/deleteAllByToUsername/' + username).subscribe((data) => {
      this.logger.debug(label, 'deleteAll success', data);
      this.uiFeedback.delInfo(label);
      this.getNotifications(fctOk, fctKo);
    }, error => {
      this.logger.error(label, 'deleteAll error', error);
      this.uiFeedback.delInfo(label);
      if (fctKo) fctKo(error);
    });
  }

  public getNotificationNettoyee(notification: Notification): Notification {
    notification.createdDate = this.utils.getDate(notification.createdDate);
    return notification;
  }
}
