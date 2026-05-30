import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Feature } from 'src/app/authorization/authorization.types';
import { AuthorizationService } from 'src/app/authorization/service/authorization.service';
import { Activity } from 'src/app/model/activity';
import { Client } from 'src/app/model/client';
import { Consultant } from 'src/app/model/consultant';
import { Cra } from 'src/app/model/cra';
import { Esn } from 'src/app/model/esn';
import { Notification } from 'src/app/model/notification';
import { Project } from 'src/app/model/project';
import { MyError } from 'src/app/resource/MyError';
import { ActivityService } from 'src/app/service/activity.service';
import { AdminLogService } from 'src/app/service/admin-log.service';
import { ClientService } from 'src/app/service/client.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { CraService } from 'src/app/service/cra.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { DocumentService } from 'src/app/service/document.service';
import { EsnService } from 'src/app/service/esn.service';
import { LoggerService } from 'src/app/service/logger.service';
import { MsgService } from 'src/app/service/msg.service';
import { ProjectService } from 'src/app/service/project.service';
import { SupportService } from 'src/app/service/support.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent implements OnInit, OnDestroy {
    selectedSection: any = null;
    chartData: any = null;
    activeTab: string = 'evolution';
    heightMultiplier: number = 1;
    autoScale: boolean = true;
    targetBarHeight: number = 200; // Hauteur cible en pixels pour la barre max
    timeGrouping: 'day' | 'month' | 'year' = 'year';
    revenueData: any = null;
    visibleSections: Array<{ id: string; titleKey: string; route: string; feature?: Feature | null; count?: number | string; roles?: string[]; queryParams?: any; chartable?: boolean }> = [];

        sections: Array<{ id: string; titleKey: string; route: string; feature?: Feature | null; count?: number | string; roles?: string[]; queryParams?: any; chartable?: boolean }> = [
        // Visible par tous les roles (selon permissions)
        { id: 'PROFILE', titleKey: 'app.dashboard.section.profile', route: '/my-profile', feature: null },
        { id: 'NOTIFICATIONS', titleKey: 'app.dashboard.section.notifications', route: '/notification' },
        // ADMIN uniquement
        { id: 'ESN', titleKey: 'app.dashboard.section.esn', route: '/esn_app', feature: 'ESN_MANAGEMENT', roles: ['ADMIN'] },
        // ADMIN + RESPONSIBLE_ESN
        { id: 'CONSULTANTS', titleKey: 'app.dashboard.section.consultants', route: '/consultant_app', feature: 'CONSULTANT_MANAGEMENT', roles: ['ADMIN', 'RESPONSIBLE_ESN'] },
        { id: 'CLIENTS', titleKey: 'app.dashboard.section.clients', route: '/client_app', feature: 'CLIENT_MANAGEMENT', roles: ['ADMIN', 'RESPONSIBLE_ESN'] },
        { id: 'PROJECTS', titleKey: 'app.dashboard.section.projects', route: '/project_app', feature: 'PROJECT_MANAGEMENT', roles: ['ADMIN', 'RESPONSIBLE_ESN'] },
        // MANAGER : ses consultants uniquement
        { id: 'MY_CONSULTANTS', titleKey: 'app.dashboard.section.myConsultants', route: '/consultant_list', feature: 'CONSULTANT_MANAGEMENT', roles: ['MANAGER'], queryParams: { myConsultants: true } },
        // ADMIN + RESPONSIBLE_ESN + MANAGER : toutes les activites
        { id: 'ACTIVITIES', titleKey: 'app.dashboard.section.activities', route: '/activity_app', feature: 'ACTIVITY_MANAGEMENT', roles: ['ADMIN', 'RESPONSIBLE_ESN', 'MANAGER'] },
        // ADMIN + RESPONSIBLE_ESN + MANAGER : tous les CRA
        { id: 'CRA', titleKey: 'app.dashboard.section.cra', route: '/cra_app', feature: 'CRA_MANAGEMENT', roles: ['ADMIN', 'RESPONSIBLE_ESN', 'MANAGER'] },
        // CONSULTANT : uniquement ses CRA
        { id: 'MY_CRA', titleKey: 'app.dashboard.section.myCra', route: '/cra_app', feature: 'CRA_MANAGEMENT', roles: ['CONSULTANT'], queryParams: { myCra: true } },
        // Documents administratifs
        { id: 'DOCUMENTS', titleKey: 'app.dashboard.section.documents', route: '/admindoc_list', feature: 'IDENTITY_DOCUMENT_MANAGEMENT' },
        { id: 'ADMIN_LOGS', titleKey: 'app.dashboard.section.adminLogs', route: '/admin_logs', feature: 'ESN_MANAGEMENT', roles: ['ADMIN'], chartable: false },
        // Section Aide (visible par tous les rôles, pas de feature spécifique)
        { id: 'SUPPORT', titleKey: 'app.dashboard.section.help', route: '/help', feature: null, chartable: false },
    ];

    listNotifications: Notification[] = [];
    listEsn: Esn[] = [];
    listClient: Client[] = [];
    listProject: Project[] = [];
    listActivity: Activity[] = [];
    listConsultant: Consultant[] = [];
    listCra: Cra[] = [];
    listDocument: Document[] = [];
    listSupportTickets: any[] = [];
    esn: Esn = null;
    esnId: number = 0;
    private destroy$ = new Subject<void>();
    private lastLoadedEsnId: number = null;
    private hasLoadedCounts = false;
    private adminCountsLoaded = false;
    private isResolvingEsnForCounts = false;
    private isCraLoading: boolean = false;
    private isCraLoaded: boolean = false;

    constructor(
        private authz: AuthorizationService,
        private msgService: MsgService,
        private adminLogService: AdminLogService,
        private clientService: ClientService,
        private projectService: ProjectService,
        private activityService: ActivityService,
        private consultantService: ConsultantService,
        private craService: CraService,
        private esnService: EsnService,
        private documentService: DocumentService,
        private supportService: SupportService,
        private dataSharingService: DataSharingService,
        private logger: LoggerService,
        private utilsIhm: UtilsIhmService,
        private router: Router,
        public utils: UtilsService
    ) {
        this.logger.debug('DashboardComponent.constructor called');
    }

    ngOnInit(): void {
        this.logger.debug('DashboardComponent.ngOnInit called');
        this.refreshVisibleSections();
        this.dataSharingService.userConnected$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
            this.refreshVisibleSections();
            this.tryLoadCountsFromUserContext(user);
        });

        // Pour les rôles non ADMIN, le chargement se fait une seule fois par esnId.
        // Le BehaviorSubject rejoue la valeur courante, donc pas besoin de fallback séparé.
        this.dataSharingService.esnCurrentReady$.pipe(
            takeUntil(this.destroy$),
            filter((esn: Esn) => !!esn),
            distinctUntilChanged((prev, curr) => prev?.id === curr?.id)
        ).subscribe((esn: Esn) => {
            this.logger.debug('DashboardComponent: esnCurrentReady event received, esn = ', esn);
            this.esn = esn;
            this.esnId = esn.id;
            if (!this.esnId) this.esnId = this.dataSharingService.userConnected?.esnId;
            this.logger.debug('DashboardComponent: esnId 1 = ', this.esnId);
            this.loadCountsOncePerEsn();
        });

        this.tryLoadCountsFromUserContext(this.dataSharingService.userConnected);

        this.adminLogService.lineCount$()
            .pipe(takeUntil(this.destroy$))
            .subscribe((count: number) => {
                const role = this.dataSharingService.userConnected?.role;
                if (role !== 'ADMIN' || count < 0) {
                    return;
                }
                this.updateSectionCount('ADMIN_LOGS', count);
            });
    }

    private tryLoadCountsFromUserContext(user: Consultant): void {
        if (!user) {
            return;
        }

        const role = user?.role;
        if (role === 'ADMIN') {
            if (this.adminCountsLoaded) {
                return;
            }
            this.adminCountsLoaded = true;
            this.esnId = 0;
            this.logger.debug('DashboardComponent: admin context detected, loading counts');
            this.loadCounts();
            return;
        }

        const fallbackEsnId =
            user?.esn?.id ||
            user?.esnId ||
            this.dataSharingService.idEsnCurrent;

        if (fallbackEsnId) {
            this.esnId = fallbackEsnId;
            this.logger.debug('DashboardComponent: fallback esnId = ', this.esnId);
            this.loadCountsOncePerEsn();
            return;
        }

        // Au refresh, l'utilisateur peut exister sans esn/esnId hydraté.
        // On tente une seule résolution ESN puis on déclenche le premier chargement.
        if (!this.hasLoadedCounts && !this.isResolvingEsnForCounts) {
            this.isResolvingEsnForCounts = true;
            this.dataSharingService.majEsnOnConsultant(
                () => {
                    this.isResolvingEsnForCounts = false;
                    const resolvedEsnId =
                        this.dataSharingService.userConnected?.esn?.id ||
                        this.dataSharingService.userConnected?.esnId ||
                        this.dataSharingService.idEsnCurrent;

                    if (resolvedEsnId) {
                        this.esnId = resolvedEsnId;
                    }
                    this.loadCountsOncePerEsn();
                },
                () => {
                    this.isResolvingEsnForCounts = false;
                    this.loadCountsOncePerEsn();
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.logger.debug('DashboardComponent.ngOnDestroy called');
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadCountsOncePerEsn(): void {
        this.logger.debug('DashboardComponent.loadCountsOncePerEsn called');
        const currentEsnId = this.esnId || null;
        if (this.hasLoadedCounts && this.lastLoadedEsnId === currentEsnId) {
            return;
        }
        this.hasLoadedCounts = true;
        this.lastLoadedEsnId = currentEsnId;
        this.loadCounts();
    }

    loadCounts(): void {
        this.logger.debug('DashboardComponent.loadCounts called');
        const role = this.dataSharingService.userConnected?.role;

        // Notifications (pour tous les rôles)
        let idConsultant = this.dataSharingService.userConnected?.id;
        if (role === 'ADMIN') {
            idConsultant = 0; // pour admin, récupérer toutes les notifications
        }

        this.logger.debug('DashboardComponent: Loading Notifications for consultantId = ', idConsultant);
        this.dataSharingService.forceRefreshNotifications(); // force refresh
        let labelNotif = role === 'ADMIN' ? 'Toutes les Notifications' : 'Mes Notifications';
        this.logger.debug('DashboardComponent: labelNotif = ', labelNotif);
        this.dataSharingService.addInfo(labelNotif);
        this.dataSharingService.getNotifications(
            (listNotif) => {
                this.logger.debug('DashboardComponent: Loaded Notif, count = ', listNotif?.length);
                this.dataSharingService.delInfo(labelNotif);
                const listNotifications = listNotif as Notification[];
                this.listNotifications = this.dataSharingService.getListNotifications() || listNotifications;
                this.updateSectionCount('NOTIFICATIONS', this.listNotifications.length);
            }, (error) => {
                this.logger.debug('DashboardComponent: Error loading Notifications', error);
                this.dataSharingService.delInfo(labelNotif);
                this.dataSharingService.addError(new MyError('Erreur lors du chargement des Notifications : ', JSON.stringify(error)));
                this.listNotifications = this.dataSharingService.getListNotifications() || [];
                this.updateSectionCount('NOTIFICATIONS', this.listNotifications.length);
            }
        );

        // ESN (pour tous les rôles)
        let labelEsn = 'Chargement des ESN...';
        this.dataSharingService.addInfo(labelEsn);

        this.esnService.findAll().subscribe({
            next: (resp) => {
                this.logger.debug('DashboardComponent: Loaded ESNs, resp = ', resp);
                this.dataSharingService.delInfo(labelEsn);
                this.listEsn = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('ESN', this.listEsn.length);
            },
            error: (err) => {
                this.logger.debug('DashboardComponent: Error loading ESNs', err);
                this.dataSharingService.delInfo(labelEsn);
                this.dataSharingService.addError(new MyError('Erreur lors du chargement des ESN : ', JSON.stringify(err)));
                this.updateSectionCount('ESN', 0);
            }
        });

        // CRA (pour tous les rôles)
        if (this.isCraLoaded) {
            this.updateSectionCount('CRA', this.listCra.length);
        } else if (!this.isCraLoading) {
            this.isCraLoading = true;
            let labelCra = 'Chargement des CRA...';
            this.dataSharingService.addInfo(labelCra);

            this.craService.findAll().subscribe({
                next: (resp) => {
                    this.isCraLoading = false;
                    this.isCraLoaded = true;
                    this.listCra = resp && resp.body && resp.body.result ? resp.body.result : [];
                    this.logger.debug('DashboardComponent: Loaded CRA, listCra = ', this.listCra);

                    this.dataSharingService.setListCra(this.listCra);
                    this.dataSharingService.majListCra();

                    setTimeout(() => {
                        this.logger.debug('DashboardComponent: ap set timeout, listCra = ', this.listCra);
                        this.dataSharingService.delInfo(labelCra);
                        this.updateSectionCount('CRA', this.listCra.length);
                    }, 3000);

                },
                error: (error) => {
                    this.isCraLoading = false;
                    this.dataSharingService.delInfo(labelCra);
                    this.dataSharingService.addError(new MyError('Erreur lors du chargement des CRA : ', JSON.stringify(error)));
                    this.updateSectionCount('CRA', 0);
                }
            });
        }

        // Documents (pour tous les rôles)
        let labelDocuments = 'Chargement des Documents...';
        this.dataSharingService.addInfo(labelDocuments);

        this.documentService.findAllByConsultant(this.dataSharingService.userConnected?.id).subscribe({
            next: (resp) => {
                this.dataSharingService.delInfo(labelDocuments);
                this.listDocument = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('DOCUMENTS', this.listDocument.length);
            },
            error: (error) => {
                this.dataSharingService.delInfo(labelDocuments);
                this.dataSharingService.addError(new MyError('Erreur lors du chargement des documents : ', JSON.stringify(error)));
                this.updateSectionCount('DOCUMENTS', 0);
            }
        });

        this.loadSupportTicketCount(role);
        this.loadAdminLogCount(role);

        // Consultants
        this.loadAllConsultantsAndUpdateCounts();

        // Pour ADMIN et CONSULTANT: juste les listes de base
        if (role === 'ADMIN' || role === 'CONSULTANT') {
            // Pour ADMIN, utiliser findAllAll() pour récupérer TOUS les clients sans restriction d'ESN
            const clientObservable = role === 'ADMIN'
                ? this.clientService.findAllAll()
                : this.clientService.findAll(this.esnId);

            clientObservable.subscribe({
                next: (resp) => {
                    this.listClient = resp && resp.body && resp.body.result ? resp.body.result : [];
                    this.updateSectionCount('CLIENTS', this.listClient.length);
                },
                error: (error) => {
                    this.dataSharingService.addError(new MyError('Erreur lors du chargement des clients : ', JSON.stringify(error)));
                    this.updateSectionCount('CLIENTS', 0);
                }
            });

            this.projectService.findAll(this.esnId).subscribe({
                next: (resp) => {
                    this.listProject = resp && resp.body && resp.body.result ? resp.body.result : [];
                    this.updateSectionCount('PROJECTS', this.listProject.length);
                },
                error: (error) => {
                    this.dataSharingService.addError(new MyError('Erreur lors du chargement des projets : ', JSON.stringify(error)));
                    this.updateSectionCount('PROJECTS', 0);
                }
            });

            this.activityService.findAll().subscribe({
                next: (resp) => {
                    this.listActivity = resp && resp.body && resp.body.result ? resp.body.result : [];
                    this.updateSectionCount('ACTIVITIES', this.listActivity.length);
                },
                error: (error) => {
                    this.dataSharingService.addError(new MyError('Erreur lors du chargement des activités : ', JSON.stringify(error)));
                    this.updateSectionCount('ACTIVITIES', 0);
                }
            });
        }

        // Pour MANAGER: vérifications hiérarchiques
        if (role === 'MANAGER') {
            this.loadClientAndCheckHierarchy();
        }
    }

    private loadAdminLogCount(role: string): void {
        if (role !== 'ADMIN') {
            this.updateSectionCount('ADMIN_LOGS', 0);
            return;
        }

        const cachedCount = this.adminLogService.getLineCountSnapshot();
        if (cachedCount >= 0) {
            this.updateSectionCount('ADMIN_LOGS', cachedCount);
            return;
        }

        this.adminLogService.getLineCount().subscribe({
            next: (count) => {
                if (count >= 0) {
                    this.updateSectionCount('ADMIN_LOGS', count);
                    return;
                }
                this.updateSectionCount('ADMIN_LOGS', 'N/A');
            },
            error: () => {
                this.updateSectionCount('ADMIN_LOGS', 'N/A');
            }
        });
    }

    private loadSupportTicketCount(role: string): void {
        const supportObservable = role === 'ADMIN'
            ? this.supportService.findAll()
            : this.supportService.findMyTickets();

        supportObservable.subscribe({
            next: (resp) => {
                this.listSupportTickets = resp?.body?.result || [];
                this.updateSectionCount('SUPPORT', this.listSupportTickets.length);
            },
            error: () => {
                this.updateSectionCount('SUPPORT', 0);
            }
        });
    }

    private loadClientAndCheckHierarchy(): void {
        this.logger.debug('DashboardComponent.loadClientAndCheckHierarchy called');
        let labelClient = 'Chargement des Clients...';
        this.dataSharingService.addInfo(labelClient);
        this.clientService.findAll(this.esnId).subscribe({
            next: (resp) => {
                this.dataSharingService.delInfo(labelClient);
                this.listClient = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('CLIENTS', this.listClient.length);

                // Test 1: Si aucun client, proposer d'en créer un
                if (this.listClient.length === 0) {
                    // Afficher le message seulement si pas encore affiché
                    if (!this.dataSharingService.clientWarningShown) {
                        this.dataSharingService.clientWarningShown = true;
                        this.utilsIhm.confirmDialog(
                            "Aucun <b>CLIENT</b> n'est associé à cette ESN.<br>Veuillez ajouter un client pour pouvoir créer des projets.",
                            () => this.router.navigate(['/client_app']),
                            () => { }
                        );
                    }
                    // Toujours arrêter ici s'il n'y a pas de clients
                    return;
                }

                // Continuer avec les projets
                this.loadProjectAndCheckHierarchy();
            },
            error: (error) => {
                this.dataSharingService.delInfo(labelClient);
                this.dataSharingService.addError(new MyError('Erreur lors du chargement des clients : ', JSON.stringify(error)));
                this.updateSectionCount('CLIENTS', 0);
            }
        });
    }

    private loadProjectAndCheckHierarchy(): void {
        this.logger.debug('DashboardComponent.loadProjectAndCheckHierarchy called');
        let labelProject = 'Chargement des Projets...';
        this.dataSharingService.addInfo(labelProject);
        this.projectService.findAll(this.esnId).subscribe({
            next: (resp) => {
                this.dataSharingService.delInfo(labelProject);
                this.listProject = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('PROJECTS', this.listProject.length);

                // Test 2: Si ya au moins un client et aucun projet, proposer d'en créer un
                if (this.listProject.length === 0 && !this.dataSharingService.projectWarningShown) {
                    this.dataSharingService.projectWarningShown = true;
                    this.utilsIhm.confirmDialog(
                        "Aucun <b>PROJET</b> n'est associé à cette ESN.<br>Veuillez ajouter un projet pour pouvoir avancer.",
                        () => this.router.navigate(['/project_app']),
                        () => { }
                    );
                    return; // Stop here
                }

                // Continuer avec les consultants
                this.loadActivityAndCheckHierarchy();
            },
            error: (error) => {
                    this.dataSharingService.delInfo(labelProject);
                this.dataSharingService.addError(new MyError('Erreur lors du chargement des projets : ', JSON.stringify(error)));
                this.updateSectionCount('PROJECTS', 0);
            }
        });
    }

    private loadActivityAndCheckHierarchy(): void {
        this.logger.debug('DashboardComponent.loadActivityAndCheckHierarchy called');
        let labelActivity = 'Chargement des Activités...';
        this.dataSharingService.addInfo(labelActivity);
        this.activityService.findAll().subscribe({
            next: (resp) => {
                this.dataSharingService.delInfo(labelActivity);
                this.listActivity = resp && resp.body && resp.body.result ? resp.body.result : [];
                this.updateSectionCount('ACTIVITIES', this.listActivity.length);

                // Test 3: Si ya au moins un projet et au moins un consultant de type CONSULTANT et aucune activité de type MISSION, proposer d'en créer une
                const hasConsultantRole = this.listConsultant.some(c => c.role === 'CONSULTANT');
                // Vérifier via typeName (propriété disponible) ou type.name
                const hasMissionActivity = this.listActivity.some(a =>
                    (a.typeName && a.typeName === 'MISSION') ||
                    (a.type && a.type.name === 'MISSION')
                );

                this.logger.debug('Dashboard - hasConsultantRole:', hasConsultantRole);
                this.logger.debug('Dashboard - hasMissionActivity:', hasMissionActivity);
                this.logger.debug('Dashboard - listActivity:', this.listActivity);
                this.logger.debug('Dashboard - activity types:', this.listActivity.map(a => ({ typeName: a.typeName, type: a.type })));

                if (this.listProject.length > 0 && hasConsultantRole && !hasMissionActivity && !this.dataSharingService.missionActivityWarningShown) {
                    this.dataSharingService.missionActivityWarningShown = true;
                    this.utilsIhm.confirmDialog(
                        "Aucune <b>ACTIVITÉ de type MISSION</b> n'est enregistrée.<br>Veuillez ajouter une activité de type MISSION pour permettre aux consultants de saisir leurs CRA.",
                        () => this.router.navigate(['/activity_app']),
                        () => { }
                    );
                }
            },
            error: (error) => {
                this.dataSharingService.delInfo(labelActivity);
                this.dataSharingService.addError(new MyError('Erreur lors du chargement des activités : ', JSON.stringify(error)));
                this.updateSectionCount('ACTIVITIES', 0);
            }
        });
    }

    private loadAllConsultantsAndUpdateCounts(): void {
        this.logger.debug('DashboardComponent.loadAllConsultantsAndUpdateCounts called');
        const user = this.dataSharingService.userConnected;
        const role = user?.role;

        if (!user) {
            this.updateSectionCount('CONSULTANTS', 0);
            this.updateSectionCount('MY_CONSULTANTS', 0);
            return;
        }

        // Load all consultants for ADMIN
        if (role === 'ADMIN') {
            this.consultantService.findAll().subscribe({
                next: (resp) => {
                    this.listConsultant = resp?.body?.result || [];
                    this.updateSectionCount('CONSULTANTS', this.listConsultant.length);
                },
                error: () => this.updateSectionCount('CONSULTANTS', 0)
            });
            return;
        }

        // Load ESN consultants for RESPONSIBLE_ESN
        if (role === 'RESPONSIBLE_ESN') {
            let labelConsultant = 'Chargement des Consultants...';
            this.dataSharingService.addInfo(labelConsultant);
            this.consultantService.findAllByEsn(this.esnId).subscribe({
                next: (resp) => {
                    this.listConsultant = resp?.body?.result || [];
                    this.updateSectionCount('CONSULTANTS', this.listConsultant.length);
                    this.dataSharingService.delInfo(labelConsultant);

                    // Test: si listConsultant ne contient pas un manager, afficher dialog
                    let hasManager = this.listConsultant.some(c => c.role === 'MANAGER');
                    if (!hasManager && !this.dataSharingService.managerWarningShown) {
                        this.dataSharingService.managerWarningShown = true;
                        this.utilsIhm.confirmDialog(
                            "Aucun consultant de rôle MANAGER n'est associé à cette ESN. Veuillez ajouter un consultant avec le rôle MANAGER pour une gestion optimale.",
                            () => this.router.navigate(['/consultant_app']),
                            () => { }
                        );
                    }
                },
                error: (error) => {
                    this.dataSharingService.delInfo(labelConsultant);
                    this.dataSharingService.addError(new MyError('Erreur lors du chargement des consultants : ', JSON.stringify(error)));
                    this.updateSectionCount('CONSULTANTS', 0);
                }
            });
            return;
        }

        // Load ESN consultants once for MANAGER
        if (role === 'MANAGER') {
            const esnId = user?.esn?.id || user?.esnId;
            let labelConsultant = 'Chargement des Consultants...';
            this.dataSharingService.addInfo(labelConsultant);

            this.consultantService.findAllByEsn(esnId).subscribe({
                next: (resp) => {
                    this.dataSharingService.delInfo(labelConsultant);
                    const allConsultants = resp?.body?.result || [];
                    this.listConsultant = allConsultants;
                    // Mes Consultants: filter by adminConsultantId = userConnected.id, include manager himself
                    const myConsultants = allConsultants.filter(c => c.adminConsultantId === user.id || c.id === user.id);
                    this.updateSectionCount('CONSULTANTS', this.listConsultant.length);
                    this.updateSectionCount('MY_CONSULTANTS', myConsultants.length);

                    // Test hiérarchique dans loadClientAndCheckHierarchy: vérifier si consultant CONSULTANT existe
                    if (!this.listConsultant.some(c => c.role === 'CONSULTANT') &&
                        !this.dataSharingService.consultantWarningShown &&
                        this.listProject.length > 0) {
                        this.dataSharingService.consultantWarningShown = true;
                        this.utilsIhm.confirmDialog(
                            "Aucun <b>CONSULTANT</b> de rôle CONSULTANT n'est associé à cette ESN. Veuillez ajouter un consultant avec le rôle CONSULTANT pour une gestion optimale des activités.",
                            () => this.router.navigate(['/consultant_app']),
                            () => { }
                        );
                    }
                },
                error: (error) => {
                    this.dataSharingService.delInfo(labelConsultant);
                    this.dataSharingService.addError(new MyError('Erreur lors du chargement des consultants : ', JSON.stringify(error)));
                    this.updateSectionCount('CONSULTANTS', 0);
                    this.updateSectionCount('MY_CONSULTANTS', 0);
                }
            });
            return;
        }

        // Default fallback: consultants of current ESN
        let labelConsultant = 'Chargement des Consultants...';
        this.dataSharingService.addInfo(labelConsultant);
        this.consultantService.findAllByEsn(this.esnId).subscribe({
            next: (resp) => {
                this.dataSharingService.delInfo(labelConsultant);
                this.listConsultant = resp?.body?.result || [];
                this.updateSectionCount('CONSULTANTS', this.listConsultant.length);
                this.updateSectionCount('MY_CONSULTANTS', 0);
            },
            error: (error) => {
                this.dataSharingService.delInfo(labelConsultant);
                this.dataSharingService.addError(new MyError('Erreur lors du chargement des consultants : ', JSON.stringify(error)));
                this.updateSectionCount('CONSULTANTS', 0);
                this.updateSectionCount('MY_CONSULTANTS', 0);
            }
        });
    }

    private updateSectionCount(id: string, count: any): void {
        this.logger.debug('DashboardComponent.updateSectionCount called', { id, count });
        const section = this.sections.find(s => s.id === id);
        if (section) {
            section.count = count;
        }
    }

    private refreshVisibleSections(): void {
        this.logger.debug('DashboardComponent.refreshVisibleSections called');
        const role = this.dataSharingService.userConnected?.role;
        this.visibleSections = this.sections.filter(s => {
            if (s.roles && (!role || !s.roles.includes(role))) return false;
            if (!s.feature) return true; // always visible (e.g., profile)
            return this.authz.hasPermission(s.feature, 'VIEW');
        });
    }

    showChart(section: any): void {
        this.logger.debug('DashboardComponent.showChart called', section);
        if (section?.chartable === false) {
            return;
        }
        this.selectedSection = section;
        this.activeTab = 'evolution';
        this.chartData = this.generateChartData(section);
        
        // Générer les données de revenus pour CRA
        if (section.id === 'CRA') {
            this.revenueData = this.generateRevenueData();
        }
        
        // Calculer le multiplicateur auto si activé
        if (this.autoScale) {
            this.calculateAutoMultiplier();
        }
    }

    closeChart(): void {
        this.logger.debug('DashboardComponent.closeChart called');
        this.selectedSection = null;
        this.chartData = null;
        this.activeTab = 'evolution';
        this.revenueData = null;
    }

    switchTab(tabName: string): void {
        this.logger.debug('DashboardComponent.switchTab called', tabName);
        this.activeTab = tabName;
        
        // Recalculer le multiplicateur auto si activé lors du changement d'onglet
        if (this.autoScale) {
            this.calculateAutoMultiplier();
        }
    }

    changeTimeGrouping(grouping: 'day' | 'month' | 'year'): void {
        this.logger.debug('DashboardComponent.changeTimeGrouping called', grouping);
        this.timeGrouping = grouping;
        if (this.selectedSection) {
            this.chartData = this.generateChartData(this.selectedSection);
            if (this.selectedSection.id === 'CRA') {
                this.revenueData = this.generateRevenueData();
            }
            
            // Recalculer le multiplicateur auto si activé
            if (this.autoScale) {
                this.calculateAutoMultiplier();
            }
        }
    }

    /**
     * Calcule le multiplicateur automatique basé sur la valeur maximale
     */
    calculateAutoMultiplier(): void {
        this.logger.debug('DashboardComponent.calculateAutoMultiplier called');
        let maxValue = 0;
        
        if (this.activeTab === 'evolution' && this.chartData) {
            // Pour l'onglet évolution, utiliser la valeur cumulative max
            maxValue = Math.max(...(this.chartData.cumulativeCount || [0]));
        } else if (this.activeTab === 'revenus' && this.revenueData) {
            // Pour l'onglet revenus, trouver le TJM max parmi tous les consultants
            this.revenueData.forEach((item: any) => {
                item.periodData.forEach((period: any) => {
                    if (period.tjmSum > maxValue) {
                        maxValue = period.tjmSum;
                    }
                });
            });
        }
        
        // Calculer le multiplicateur pour atteindre la hauteur cible
        if (maxValue > 0) {
            this.heightMultiplier = this.targetBarHeight / maxValue;
            this.logger.debug('Auto-scale calculated:', { maxValue, multiplier: this.heightMultiplier });
        } else {
            this.heightMultiplier = 1;
        }
    }
    
    /**
     * Active/désactive l'auto-scaling
     */
    toggleAutoScale(): void {
        this.logger.debug('DashboardComponent.toggleAutoScale called');
        if (this.autoScale) {
            this.calculateAutoMultiplier();
        }
    }
    
    /**
     * Retourne le multiplicateur à utiliser pour les barres
     */
    getEffectiveMultiplier(): number {
        this.logger.debug('DashboardComponent.getEffectiveMultiplier called');
        return this.heightMultiplier;
    }

    /**
     * Génère les données du graphique basées sur la propriété createdDate
     */
    private generateChartData(section: any): any {
        this.logger.debug('DashboardComponent.generateChartData called', section);
        let dataList: any[] = [];

        // Récupérer les données correspondantes à la section
        switch (section.id) {
            case 'NOTIFICATIONS':
                dataList = this.listNotifications;
                break;
            case 'CONSULTANTS':
            case 'MY_CONSULTANTS':
                dataList = this.listConsultant;
                break;
            case 'ESN':
                dataList = this.listEsn;
                break;
            case 'CLIENTS':
                dataList = this.listClient;
                break;
            case 'PROJECTS':
                dataList = this.listProject;
                break;
            case 'ACTIVITIES':
                dataList = this.listActivity;
                break;
            case 'CRA':
                dataList = this.listCra;
                break;
            case 'DOCUMENTS':
                dataList = this.listDocument;
                break;
            default:
                dataList = [];
        }

        this.logger.debug(`DashboardComponent: Generating chart data for ${section.id}, count : `, dataList.length);

        // Grouper par date de création
        const dateGroups = this.groupByCreatedDate(dataList);

        this.logger.debug(`DashboardComponent: Date groups for ${section.id} : `, dateGroups);

        // Convertir en format de graphique avec dates et counts cumulés
        const chartData = this.convertToChartFormat(dateGroups);

        this.logger.debug(`DashboardComponent: Chart data for ${section.id} : `, chartData);

        return chartData;
    }

    /**
     * Groupe les données par date de création selon le mode sélectionné
     */
    private groupByCreatedDate(dataList: any[]): Map<string, number> {
        this.logger.debug('DashboardComponent.groupByCreatedDate called, count =', dataList?.length || 0);
        const groups = new Map<string, number>();

        dataList.forEach(item => {
            if (item.createdDate) {
                const date = new Date(item.createdDate);
                let dateKey: string;
                
                switch (this.timeGrouping) {
                    case 'year':
                        dateKey = date.getFullYear().toString();
                        break;
                    case 'month':
                        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        break;
                    case 'day':
                    default:
                        dateKey = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
                        break;
                }
                
                groups.set(dateKey, (groups.get(dateKey) || 0) + 1);
            }
        });

        return groups;
    }

    /**
     * Convertit les groupes de dates en format de graphique avec cumul
     */
    private convertToChartFormat(dateGroups: Map<string, number>): any {
        this.logger.debug('DashboardComponent.convertToChartFormat called, groups =', dateGroups?.size || 0);
        // Trier les dates
        const sortedDates = Array.from(dateGroups.keys()).sort();

        const labels: string[] = [];
        const data: number[] = [];
        const cumulativeData: number[] = [];
        let cumulative = 0;

        sortedDates.forEach(date => {
            const count = dateGroups.get(date) || 0;
            cumulative += count;

            labels.push(this.formatDate(date));
            data.push(count);
            cumulativeData.push(cumulative);
        });

        return {
            labels: labels,
            dailyCount: data,
            cumulativeCount: cumulativeData,
            totalDays: labels.length,
            currentTotal: cumulative
        };
    }

    /**
     * Formate une date pour l'affichage selon le mode de groupement
     */
    private formatDate(dateStr: string): string {
        this.logger.debug('DashboardComponent.formatDate called', dateStr);
        switch (this.timeGrouping) {
            case 'year':
                return dateStr; // Déjà au format YYYY
            case 'month':
                const [year, month] = dateStr.split('-');
                const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
                return `${monthNames[parseInt(month) - 1]} ${year}`;
            case 'day':
            default:
                const date = new Date(dateStr);
                return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
    }

    /**
     * Génère les données de revenus (sum TJM) par consultant et par période
     */
    private generateRevenueData(): any {
        this.logger.debug('DashboardComponent.generateRevenueData called');
        const consultantRevenueMap = new Map<number, { consultant: Consultant, periods: Map<string, number> }>();

        // Parcourir tous les CRA
        this.listCra.forEach(cra => {
            if (cra.consultant && cra.craDays) {
                const consultantId = cra.consultant.id;
                
                // Initialiser le consultant s'il n'existe pas encore
                if (!consultantRevenueMap.has(consultantId)) {
                    consultantRevenueMap.set(consultantId, {
                        consultant: cra.consultant,
                        periods: new Map<string, number>()
                    });
                }

                const consultantData = consultantRevenueMap.get(consultantId);

                // Parcourir les craDays pour calculer les TJM
                cra.craDays.forEach(craDay => {
                    if (craDay.day && craDay.craDayActivities) {
                        const date = new Date(craDay.day);
                        let periodKey: string;

                        switch (this.timeGrouping) {
                            case 'year':
                                periodKey = date.getFullYear().toString();
                                break;
                            case 'month':
                                periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                                break;
                            case 'day':
                            default:
                                periodKey = date.toISOString().split('T')[0];
                                break;
                        }

                        // Parcourir les craDayActivities pour sommer les TJM
                        craDay.craDayActivities.forEach(craDayActivity => {
                            if (craDayActivity.activity && craDayActivity.activity.tjm) {
                                const currentSum = consultantData.periods.get(periodKey) || 0;
                                consultantData.periods.set(periodKey, currentSum + craDayActivity.activity.tjm);
                            }
                        });
                    }
                });
            }
        });

        // Convertir en format pour affichage
        const result = Array.from(consultantRevenueMap.values()).map(data => {
            const sortedPeriods = Array.from(data.periods.keys()).sort();
            const periodData = sortedPeriods.map(period => ({
                period: this.formatDate(period),
                tjmSum: data.periods.get(period) || 0
            }));

            return {
                consultant: data.consultant,
                periodData: periodData,
                totalRevenue: Array.from(data.periods.values()).reduce((sum, val) => sum + val, 0)
            };
        });

        this.logger.debug('DashboardComponent: Revenue data generated:', result);
        return result;
    }

    hasRole(role: string): boolean {
        const userRole = this.dataSharingService.userConnected?.role;
        return userRole === role;
    }
}
