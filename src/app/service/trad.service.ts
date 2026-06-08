import { LoggerService } from './logger.service';



import { Injectable } from '@angular/core';

const lang0 = "fr";  //default lang"

@Injectable({
  providedIn: 'root'
})
export class TradService {

  constructor(private logger: LoggerService,) {
    // localStorage.setItem('locale', code);
    this.lang = localStorage.getItem('locale');
  }

  private lang = lang0;
  public setLang(l: string) {
    this.lang = l;
    localStorage.setItem('locale', l);
  }
  public getLang(): string {
    return this.lang;
  }

  /**
   * 
   * @param cle 
   * @param paramJson 
   * @returns 
   */
  public get(cle: string, paramJson: Object = null): string {
    let res = "";
    let obj = this.data[cle]
    if (obj) {
      res = obj[this.lang]
      if (!res) {
        res = obj[lang0]
        if (!res) res = "";
      }
    }

    if (paramJson && res) {
      for (let key in paramJson) {
        res = res.replace("{{" + key + "}}", paramJson[key])
      }
    }

    return res;
  }

  data = {
    "welcome": {
      fr: "Bienvenue",
      en: "Welcome",
      ar: "أهلا بك",
    },
    "Add": {
      fr: "Ajouter",
      en: "Add",
      ar: "إضافة",
    },
    "All": {
      fr: "Tout",
      en: "All",
      ar: "الكل",
    },
    "OK": {
      fr: "OK",
      en: "OK",
      ar: "موافق",
    },

    "Save": {
      fr: "Enregistrer",
      en: "Save",
      ar: "حفظ",
    },

    "List": {
      fr: "Liste",
      en: "List",
      ar: "قائمة",
    },

    "New": {
      fr: "Nouveau",
      en: "New",
      ar: "جديد",
    },

    "NewFee": {
      fr: "Nouvelle Note frais",
      en: "New Fee",
      ar: "مصاريف جديدة",
    },
    "app.compo.msg.form.msg": {
      "fr": "Message",
      "en": "Message",
      "ar": "رسالة",
    },

    "Download": {
      fr: "T\u00e9l\u00e9charger",
      en: "Download",
      ar: "تحميل",
    },

    "Accept": {
      fr: "Accepter",
      en: "Accept",
      ar: "قبول",
    },

    "Reject": {
      fr: "Rejeter",
      en: "Reject",
      ar: "رفض",
    },

    "Pay": {
      fr: "Payer",
      en: "Pay",
      ar: "دفع",
    },

    "Edit": {
      fr: "Modifier",
      en: "Edit",
      ar: "تعديل",
    },

    "Delete": {
      fr: "Supprimer",
      en: "Delete",
      ar: "حذف",
    },


    "Search": {
      fr: "Chercher",
      en: "Search",
      ar: "بحث",
    },

    "User": {
      fr: "Utilisateur",
      en: "User",
      ar: "مستخدم",
    },

    "Consultant": {
      fr: "Consultant",
      en: "Consultant",
      ar: "مستشار",
    },

    "Frais": {
      fr: "Note Frais",
      en: "Fee",
      ar: "مصاريف",
    },

    "Project": {
      fr: "Project",
      en: "Project",
      ar: "مشروع",
    },

    "Esn": {
      fr: "Esn",
      en: "Esn",
      ar: "شركة ESN",
    },

    "NewActivityType": {
      fr: "Nouvelle activiti\u00e9 type",
      en: "New Activity Type",
      ar: "نوع النشاط الجديد",
    },
    "EditActivityType": {
      fr: "Modifier activiti\u00e9 type",
      en: "Edit Activity Type",
      ar: "تعديل نوع النشاط",
    },

    "NewActivity": {
      fr: "Nouvelle activiti\u00e9",
      en: "New Activity",
      ar: "نشاط جديد",
    },

    "EditActivity": {
      fr: "Modifier activity",
      en: "Edit Activity",
      ar: "تعديل النشاط",
    },

    "ListActivites": {
      "fr": "Liste d'activites",
      "en": "List Activity",
      "ar": "قائمة الأنشطة"
    },

    "ListActivitesType": {
      "fr": "Liste d'activites type",
      "en": "List Activity Type",
      "ar": "قائمة أنواع الأنشطة"
    },

    "NewClient": {
      "fr": "Nouveau Client",
      "en": "New Client",
      "ar": "عميل جديد"
    },
    "EditClient": {
      "fr": "Modifier Client",
      "en": "Edit Client",
      "ar": "تعديل العميل"
    },

    "Entitled": {
      fr: "Intitul\u00e9",
      en: "Entitled",
      ar: "العنوان"
    },

    "ListAbsence": {
      "fr": "Liste absences",
      "en": "List absence",
      "ar": "قائمة الغياب"
    },

    "Month": {
      fr: "Mois",
      en: "Month",
      ar: "الشهر",
    },

    "CreatedDate": {
      fr: "Date Creation",
      en: "Created Date",
      ar: "تاريخ الإنشاء",
    },

    "LastUpdateDate": {
      fr: "Date Dernierre MAJ",
      en: "Last Update Date",
      ar: "تاريخ آخر تحديث",
    },

    "Status": {
      fr: "Status",
      en: "Status",
      ar: "الحالة",
    },

    "Action": {
      fr: "Action",
      en: "Action",
      ar: "إجراء",
    },

    "Role": {
      "fr": "R\u00f4le",
      "en": "Role",
      "ar": "الدور",
    },

    /////////////////////

    "main.menu.navbar.navitem.caption.navigation.label": {
      "fr": "Navigation",
      "en": "Navigation",
      "ar": "التنقل"
    },
    "main.menu.navbar.navitem.esn.title": {
      "fr": "Gestion Esn",
      "en": "Esn Management",
      "ar": "إدارة شركة ESN"
    },
    "main.menu.navbar.navitem.client.title": {
      "fr": "Gestion Client",
      "en": "Client Management",
      "ar": "إدارة العملاء"
    },
    "main.menu.navbar.navitem.project.title": {
      "fr": "Gestion Project",
      "en": "Project Management",
      "ar": "إدارة المشاريع"
    },
    "main.menu.navbar.navitem.consultant.title": {
      "fr": "Gestion Consultant",
      "en": "Consultant Management",
      "ar": "إدارة المستشارين"
    },
    "main.menu.navbar.navitem.activityType.title": {
      "fr": "Gestion Type d'Activit\u00e9",
      "en": "Activity Type Management",
      "ar": "إدارة نوع النشاط"
    },
    "main.menu.navbar.navitem.activity.title": {
      "fr": "Gestion {{title}} ",
      "en": "{{title}} Management",
      "ar": "إدارة {{title}}"
    },
    "main.menu.navbar.navitem.cra.title": {
      "fr": "Gestion Cra",
      "en": "Cra Management",
      "ar": "إدارة Cra"
    },
    "main.menu.navbar.navitem.caption.fee.label": {
      "fr": "Gestion des Frais",
      "en": "Fee Management",
      "ar": "إدارة المصاريف"
    },
    "main.menu.navbar.navitem.fee.category.title": {
      "fr": "Gestion des Cat\u00e9gories de Frais",
      "en": "Fee Category Management",
      "ar": "إدارة فئات المصاريف"
    },
    "main.menu.navbar.navitem.fee.note.title": {
      "fr": "Gestion des Notes de Frais",
      "en": "Fee Note Management",
      "ar": "إدارة ملاحظات المصاريف"
    },
    "main.menu.navbar.navitem.fee.dashboard.title": {
      "fr": "Tableau de board",
      "en": "Dashboard",
      "ar": "لوحة القيادة"
    },
    "main.menu.navbar.navitem.caption.setting.label": {
      "fr": "R\u00e8glages",
      "en": "Setting",
      "ar": "الإعدادات"
    },
    "main.menu.navbar.navitem.setting.permission.title": {
      "fr": "Gestion des Autorisations",
      "en": "Permission Management",
      "ar": "إدارة الأذونات"
    },
    "main.menu.navbar.navitem.setting.holiday.title": {
      "fr": "Gestion de Vacances",
      "en": "Holiday Management",
      "ar": "إدارة العطلات"
    },
    "main.menu.navbar.navitem.setting.user.my-profile": {
      "fr": "Mon Profile",
      "en": "My Profile",
      "ar": "ملفي",
    },
    "main.menu.navbar.navitem.setting.user.help": {
      "fr": "Aide",
      "en": "Help",
      "ar": "مساعدة",
    },
    "main.menu.navbar.navitem.setting.user.notification": {
      "fr": "Mes Notifications",
      "en": "My Notifications",
      "ar": "إشعاراتي",
    },
    "app.header.notifications.showAll": {
      "fr": "Voir toutes les notifications",
      "en": "View all notifications",
      "ar": "عرض جميع الإشعارات",
    },
    "app.header.login": {
      "fr": "Connexion",
      "en": "Login",
      "ar": "تسجيل الدخول",
    },
    "app.header.language.en": {
      "fr": "Anglais",
      "en": "English",
      "ar": "الإنجليزية",
    },
    "app.header.language.fr": {
      "fr": "Français",
      "en": "French",
      "ar": "الفرنسية",
    },
    "app.header.language.ar": {
      "fr": "Arabe",
      "en": "Arabic",
      "ar": "العربية",
    },
    "app.common.cancel": {
      "fr": "Annuler",
      "en": "Cancel",
      "ar": "إلغاء",
    },
    "app.common.yes": {
      "fr": "Oui",
      "en": "Yes",
      "ar": "نعم",
    },
    "app.common.no": {
      "fr": "Non",
      "en": "No",
      "ar": "لا",
    },
    "app.login.title": {
      "fr": "Connexion",
      "en": "Login",
      "ar": "تسجيل الدخول",
    },
    "app.login.subtitle": {
      "fr": "Saisissez vos identifiants",
      "en": "Provide your credentials",
      "ar": "أدخل بيانات تسجيل الدخول",
    },
    "app.login.username": {
      "fr": "Nom d'utilisateur",
      "en": "Username",
      "ar": "اسم المستخدم",
    },
    "app.login.password": {
      "fr": "Mot de passe",
      "en": "Password",
      "ar": "كلمة المرور",
    },
    "app.login.show": {
      "fr": "Afficher",
      "en": "Show",
      "ar": "إظهار",
    },
    "app.login.usernameRequired": {
      "fr": "Le nom d'utilisateur est requis",
      "en": "Username is required",
      "ar": "اسم المستخدم مطلوب",
    },
    "app.login.passwordRequired": {
      "fr": "Le mot de passe est requis",
      "en": "Password is required",
      "ar": "كلمة المرور مطلوبة",
    },
    "app.login.forgotPassword": {
      "fr": "Mot de passe oublié ?",
      "en": "Forgot password?",
      "ar": "هل نسيت كلمة المرور؟",
    },
    "app.login.signup": {
      "fr": "Inscription",
      "en": "Sign up",
      "ar": "تسجيل",
    },
    "app.login.resetPasswordTitle": {
      "fr": "Réinitialiser votre mot de passe",
      "en": "Reset your password",
      "ar": "إعادة تعيين كلمة المرور",
    },
    "app.login.enterEmail": {
      "fr": "Entrez votre email",
      "en": "Enter your email",
      "ar": "أدخل بريدك الإلكتروني",
    },
    "app.login.validEmailRequired": {
      "fr": "Un email valide est requis",
      "en": "A valid email is required",
      "ar": "بريد إلكتروني صالح مطلوب",
    },
    "app.login.sendLink": {
      "fr": "Envoyer le lien",
      "en": "Send link",
      "ar": "إرسال الرابط",
    },
    "app.login.sending": {
      "fr": "Envoi en cours...",
      "en": "Sending...",
      "ar": "جارٍ الإرسال...",
    },
    "app.login.lastLogins": {
      "fr": "5 dernières connexions",
      "en": "Last 5 logins",
      "ar": "آخر 5 عمليات تسجيل دخول",
    },
    "app.login.loginColumn": {
      "fr": "Login",
      "en": "Login",
      "ar": "تسجيل الدخول",
    },
    "app.login.dateTimeColumn": {
      "fr": "Date / Heure",
      "en": "Date / Time",
      "ar": "التاريخ / الوقت",
    },
    "app.login.error.emailRequired": {
      "fr": "Email requis",
      "en": "Email is required",
      "ar": "البريد الإلكتروني مطلوب",
    },
    "app.login.error.userNotFound": {
      "fr": "Aucun utilisateur trouvé avec cet email.",
      "en": "No user found with this email.",
      "ar": "لم يتم العثور على مستخدم بهذا البريد الإلكتروني.",
    },
    "app.login.error.sendMail": {
      "fr": "Erreur lors de l'envoi du mail. Veuillez réessayer.",
      "en": "Error while sending email. Please try again.",
      "ar": "حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.",
    },
    "app.login.info.resetLinkSent": {
      "fr": "✅ Un lien de réinitialisation a été envoyé à {{email}}",
      "en": "✅ A reset link has been sent to {{email}}",
      "ar": "✅ تم إرسال رابط إعادة التعيين إلى {{email}}",
    },
    "app.dashboard.title": {
      "fr": "Tableau de bord",
      "en": "Dashboard",
      "ar": "لوحة القيادة",
    },
    "app.dashboard.section.profile": {
      "fr": "Mon Profil",
      "en": "My Profile",
      "ar": "ملفي",
    },
    "app.dashboard.section.notifications": {
      "fr": "Notifications",
      "en": "Notifications",
      "ar": "الإشعارات",
    },
    "app.dashboard.section.esn": {
      "fr": "ESN",
      "en": "ESN",
      "ar": "شركة ESN",
    },
    "app.dashboard.section.consultants": {
      "fr": "Consultants",
      "en": "Consultants",
      "ar": "الاستشاريون",
    },
    "app.dashboard.section.clients": {
      "fr": "Clients",
      "en": "Clients",
      "ar": "العملاء",
    },
    "app.dashboard.section.projects": {
      "fr": "Projets",
      "en": "Projects",
      "ar": "المشاريع",
    },
    "app.dashboard.section.myConsultants": {
      "fr": "Mes Consultants",
      "en": "My Consultants",
      "ar": "مستشاروني",
    },
    "app.dashboard.section.activities": {
      "fr": "Activités",
      "en": "Activities",
      "ar": "الأنشطة",
    },
    "app.dashboard.section.cra": {
      "fr": "CRA",
      "en": "CRA",
      "ar": "CRA",
    },
    "app.dashboard.section.myCra": {
      "fr": "Mes CRA",
      "en": "My CRA",
      "ar": "تقاريري CRA",
    },
    "app.dashboard.section.documents": {
      "fr": "Documents",
      "en": "Documents",
      "ar": "المستندات",
    },
    "app.dashboard.section.adminLogs": {
      "fr": "Logs Backend",
      "en": "Backend Logs",
      "ar": "سجلات الخلفية",
    },
    "app.dashboard.section.help": {
      "fr": "Aide",
      "en": "Help",
      "ar": "مساعدة",
    },
    "app.admin.logs.title": {
      "fr": "Dernieres lignes du log backend",
      "en": "Latest backend log lines",
      "ar": "آخر سطور سجل الخلفية",
    },
    "app.admin.logs.lastLines": {
      "fr": "Nombre de lignes",
      "en": "Line count",
      "ar": "عدد السطور",
    },
    "app.admin.logs.lastRefresh": {
      "fr": "Dernier rafraichissement",
      "en": "Last refresh",
      "ar": "آخر تحديث",
    },
    "app.admin.logs.refresh": {
      "fr": "Rafraichir",
      "en": "Refresh",
      "ar": "تحديث",
    },
    "app.admin.logs.copy": {
      "fr": "Copier",
      "en": "Copy",
      "ar": "نسخ",
    },
    "app.admin.logs.empty": {
      "fr": "Aucune ligne de log a afficher.",
      "en": "No log lines to display.",
      "ar": "لا توجد سطور سجلات للعرض.",
    },
    "app.dashboard.access": {
      "fr": "Accéder",
      "en": "Open",
      "ar": "الدخول",
    },
    "app.dashboard.showChart": {
      "fr": "Afficher le graphique",
      "en": "Show chart",
      "ar": "عرض الرسم البياني",
    },
    "app.dashboard.groupByYear": {
      "fr": "Par an",
      "en": "By year",
      "ar": "حسب السنة",
    },
    "app.dashboard.groupByMonth": {
      "fr": "Par mois",
      "en": "By month",
      "ar": "حسب الشهر",
    },
    "app.dashboard.groupByDay": {
      "fr": "Par jour",
      "en": "By day",
      "ar": "حسب اليوم",
    },
    "app.dashboard.auto": {
      "fr": "Auto",
      "en": "Auto",
      "ar": "تلقائي",
    },
    "app.dashboard.scale": {
      "fr": "Échelle",
      "en": "Scale",
      "ar": "المقياس",
    },
    "app.dashboard.tab.evolution": {
      "fr": "Évolution du nombre",
      "en": "Count evolution",
      "ar": "تطور العدد",
    },
    "app.dashboard.tab.revenue": {
      "fr": "Revenus",
      "en": "Revenue",
      "ar": "الإيرادات",
    },
    "app.dashboard.evolutionFor": {
      "fr": "Évolution cumulative pour:",
      "en": "Cumulative evolution for:",
      "ar": "التطور التراكمي لـ:",
    },
    "app.dashboard.total": {
      "fr": "Total",
      "en": "Total",
      "ar": "المجموع",
    },
    "app.dashboard.totalDays": {
      "fr": "Nombre de jours total",
      "en": "Total number of days",
      "ar": "إجمالي عدد الأيام",
    },
    "app.dashboard.noData": {
      "fr": "Aucune donnée disponible",
      "en": "No data available",
      "ar": "لا توجد بيانات متاحة",
    },
    "app.dashboard.noDataFor": {
      "fr": "Pas encore de données avec createdDate pour",
      "en": "No data with createdDate yet for",
      "ar": "لا توجد بيانات بتاريخ الإنشاء حتى الآن لـ",
    },
    "app.dashboard.revenueEvolutionByConsultant": {
      "fr": "Évolution des revenus (somme TJM) par consultant",
      "en": "Revenue evolution (TJM sum) by consultant",
      "ar": "تطور الإيرادات (مجموع TJM) حسب المستشار",
    },
    "app.dashboard.noRevenueData": {
      "fr": "Aucune donnée de revenus disponible",
      "en": "No revenue data available",
      "ar": "لا توجد بيانات إيرادات متاحة",
    },
    "app.dashboard.noCraRevenueData": {
      "fr": "Pas encore de CRA avec des activités et TJM renseignés",
      "en": "No CRA yet with activities and TJM provided",
      "ar": "لا توجد تقارير CRA بأنشطة وقيم TJM بعد",
    },
    "app.help.nav.ariaLabel": {
      "fr": "Navigation support",
      "en": "Support navigation",
      "ar": "تنقل الدعم",
    },
    "app.help.hero.eyebrow": {
      "fr": "Support",
      "en": "Support",
      "ar": "الدعم",
    },
    "app.help.hero.title": {
      "fr": "Tickets support et echanges",
      "en": "Support tickets and exchanges",
      "ar": "تذاكر الدعم والمراسلات",
    },
    "app.help.hero.subtitle": {
      "fr": "Suivez vos tickets, ouvrez-en un nouveau et poursuivez la discussion tant qu il reste ouvert.",
      "en": "Track your tickets, open a new one, and keep the discussion going while it remains open.",
      "ar": "تابع تذاكرك، وافتح تذكرة جديدة، وواصل النقاش ما دامت مفتوحة.",
    },
    "app.help.user.label": {
      "fr": "Utilisateur",
      "en": "User",
      "ar": "المستخدم",
    },
    "app.help.email.label": {
      "fr": "Email",
      "en": "Email",
      "ar": "البريد الإلكتروني",
    },
    "app.help.tab.newTicket": {
      "fr": "Nouveau ticket",
      "en": "New ticket",
      "ar": "تذكرة جديدة",
    },
    "app.help.tab.history": {
      "fr": "Historique",
      "en": "History",
      "ar": "السجل",
    },
    "app.help.tab.exchanges": {
      "fr": "Echanges",
      "en": "Exchanges",
      "ar": "المراسلات",
    },
    "app.help.newTicket.title": {
      "fr": "Nouveau ticket",
      "en": "New ticket",
      "ar": "تذكرة جديدة",
    },
    "app.help.newTicket.subtitle": {
      "fr": "Les tickets resolus ou fermes n acceptent plus de nouvel echange.",
      "en": "Resolved or closed tickets no longer accept new exchanges.",
      "ar": "التذاكر المحلولة أو المغلقة لا تقبل مراسلات جديدة.",
    },
    "app.help.form.type": {
      "fr": "Type",
      "en": "Type",
      "ar": "النوع",
    },
    "app.help.form.subject": {
      "fr": "Sujet",
      "en": "Subject",
      "ar": "الموضوع",
    },
    "app.help.form.actionsBeforeError": {
      "fr": "Actions avant erreur",
      "en": "Actions before error",
      "ar": "الإجراءات قبل الخطأ",
    },
    "app.help.form.ticketFiles": {
      "fr": "Fichiers ticket",
      "en": "Ticket files",
      "ar": "ملفات التذكرة",
    },
    "app.help.form.createTicket": {
      "fr": "Creer le ticket",
      "en": "Create ticket",
      "ar": "إنشاء التذكرة",
    },
    "app.help.form.creating": {
      "fr": "Creation...",
      "en": "Creating...",
      "ar": "جارٍ الإنشاء...",
    },
    "app.help.sender.title": {
      "fr": "Informations envoyeur",
      "en": "Sender information",
      "ar": "معلومات المرسل",
    },
    "app.help.sender.fullName": {
      "fr": "fullName",
      "en": "fullName",
      "ar": "الاسم الكامل",
    },
    "app.help.sender.role": {
      "fr": "role",
      "en": "role",
      "ar": "الدور",
    },
    "app.help.sender.esnName": {
      "fr": "esnName",
      "en": "esnName",
      "ar": "اسم ESN",
    },
    "app.help.history.title": {
      "fr": "Historique",
      "en": "History",
      "ar": "السجل",
    },
    "app.help.history.clickTicket": {
      "fr": "Cliquez sur un ticket pour voir ses echanges.",
      "en": "Click a ticket to view its exchanges.",
      "ar": "انقر على تذكرة لعرض المراسلات الخاصة بها.",
    },
    "app.help.history.empty": {
      "fr": "Aucun ticket support soumis pour le moment.",
      "en": "No support tickets have been submitted yet.",
      "ar": "لم يتم إرسال أي تذكرة دعم حتى الآن.",
    },
    "app.help.refresh": {
      "fr": "Rafraichir",
      "en": "Refresh",
      "ar": "تحديث",
    },
    "app.help.table.id": {
      "fr": "Id",
      "en": "Id",
      "ar": "المعرّف",
    },
    "app.help.table.date": {
      "fr": "Date ticket",
      "en": "Ticket date",
      "ar": "تاريخ التذكرة",
    },
    "app.help.table.emailSender": {
      "fr": "Email sender",
      "en": "Sender email",
      "ar": "بريد المرسل الإلكتروني",
    },
    "app.help.table.type": {
      "fr": "Type",
      "en": "Type",
      "ar": "النوع",
    },
    "app.help.table.subject": {
      "fr": "Sujet",
      "en": "Subject",
      "ar": "الموضوع",
    },
    "app.help.table.resolved": {
      "fr": "Resolu",
      "en": "Resolved",
      "ar": "محلول",
    },
    "app.help.table.closed": {
      "fr": "Ferme",
      "en": "Closed",
      "ar": "مغلق",
    },
    "app.help.table.exchanges": {
      "fr": "Echanges",
      "en": "Exchanges",
      "ar": "المراسلات",
    },
    "app.help.ticket.title": {
      "fr": "Ticket #{{id}}",
      "en": "Ticket #{{id}}",
      "ar": "التذكرة #{{id}}",
    },
    "app.help.summary.date": {
      "fr": "Date ticket",
      "en": "Ticket date",
      "ar": "تاريخ التذكرة",
    },
    "app.help.summary.emailSender": {
      "fr": "Email sender",
      "en": "Sender email",
      "ar": "بريد المرسل الإلكتروني",
    },
    "app.help.summary.actionsBeforeError": {
      "fr": "Actions avant erreur",
      "en": "Actions before error",
      "ar": "الإجراءات قبل الخطأ",
    },
    "app.help.summary.ticketFiles": {
      "fr": "Fichiers ticket",
      "en": "Ticket files",
      "ar": "ملفات التذكرة",
    },
    "app.help.exchanges.title": {
      "fr": "Echanges",
      "en": "Exchanges",
      "ar": "المراسلات",
    },
    "app.help.exchanges.loadingTicket": {
      "fr": "Chargement du ticket...",
      "en": "Loading ticket...",
      "ar": "جارٍ تحميل التذكرة...",
    },
    "app.help.exchanges.empty": {
      "fr": "Aucun echange pour ce ticket.",
      "en": "No exchanges for this ticket.",
      "ar": "لا توجد مراسلات لهذه التذكرة.",
    },
    "app.help.exchanges.selectTicket": {
      "fr": "Selectionnez un ticket depuis l onglet Historique pour afficher les echanges.",
      "en": "Select a ticket from the History tab to display its exchanges.",
      "ar": "اختر تذكرة من تبويب السجل لعرض مراسلاتها.",
    },
    "app.help.form.addExchange": {
      "fr": "Ajouter un echange",
      "en": "Add an exchange",
      "ar": "إضافة مراسلة",
    },
    "app.help.form.exchangeFiles": {
      "fr": "Fichiers echange",
      "en": "Exchange files",
      "ar": "ملفات المراسلة",
    },
    "app.help.form.addExchangeButton": {
      "fr": "Ajouter l echange",
      "en": "Add exchange",
      "ar": "إضافة المراسلة",
    },
    "app.help.form.sendingExchange": {
      "fr": "Envoi...",
      "en": "Sending...",
      "ar": "جارٍ الإرسال...",
    },
    "app.help.locked.closed": {
      "fr": "Ce ticket est ferme. Aucun nouvel echange ne peut etre ajoute.",
      "en": "This ticket is closed. No new exchange can be added.",
      "ar": "هذه التذكرة مغلقة. لا يمكن إضافة مراسلة جديدة.",
    },
    "app.help.locked.resolved": {
      "fr": "Ce ticket est resolu. Aucun nouvel echange ne peut etre ajoute.",
      "en": "This ticket is resolved. No new exchange can be added.",
      "ar": "هذه التذكرة محلولة. لا يمكن إضافة مراسلة جديدة.",
    },
    "app.help.status.open": {
      "fr": "Ouvert",
      "en": "Open",
      "ar": "مفتوح",
    },
    "app.help.status.resolved": {
      "fr": "Resolu",
      "en": "Resolved",
      "ar": "محلول",
    },
    "app.help.status.closed": {
      "fr": "Ferme",
      "en": "Closed",
      "ar": "مغلق",
    },
    "app.help.status.unknown": {
      "fr": "Inconnu",
      "en": "Unknown",
      "ar": "غير معروف",
    },
    "app.help.type.erreur": {
      "fr": "erreur",
      "en": "error",
      "ar": "خطأ",
    },
    "app.help.type.aide": {
      "fr": "aide",
      "en": "help",
      "ar": "مساعدة",
    },
    "app.help.type.proposition": {
      "fr": "proposition",
      "en": "suggestion",
      "ar": "اقتراح",
    },
    "app.help.error.subjectRequired": {
      "fr": "Le sujet est obligatoire.",
      "en": "The subject is required.",
      "ar": "الموضوع مطلوب.",
    },
    "app.help.error.actionsBeforeErrorRequired": {
      "fr": "L action realisee est obligatoire pour une erreur.",
      "en": "The action performed is required for an error ticket.",
      "ar": "الإجراء الذي تم تنفيذه مطلوب في حالة الخطأ.",
    },
    "app.help.error.userNotConnected": {
      "fr": "Utilisateur non connecte.",
      "en": "User is not logged in.",
      "ar": "المستخدم غير متصل.",
    },
    "app.help.error.ticketCreateFailed": {
      "fr": "Erreur lors de la creation du ticket support. Merci de reessayer.",
      "en": "Error while creating the support ticket. Please try again.",
      "ar": "حدث خطأ أثناء إنشاء تذكرة الدعم. يرجى المحاولة مرة أخرى.",
    },
    "app.help.error.exchangeMessageRequired": {
      "fr": "Le message de l echange est obligatoire.",
      "en": "The exchange message is required.",
      "ar": "رسالة المراسلة مطلوبة.",
    },
    "app.help.error.exchangeAddFailed": {
      "fr": "Impossible d ajouter l echange.",
      "en": "Unable to add the exchange.",
      "ar": "تعذر إضافة المراسلة.",
    },
    "app.help.info.ticketCreated": {
      "fr": "Votre ticket support a bien ete cree.",
      "en": "Your support ticket has been created.",
      "ar": "تم إنشاء تذكرة الدعم الخاصة بك بنجاح.",
    },
    "app.help.info.exchangeAdded": {
      "fr": "Votre echange a bien ete ajoute.",
      "en": "Your exchange has been added.",
      "ar": "تمت إضافة المراسلة بنجاح.",
    },
    "app.msg.form.new": {
      "fr": "Nouveau Msg",
      "en": "New Message",
      "ar": "رسالة جديدة",
    },
    "app.msg.form.edit": {
      "fr": "Edit Msg",
      "en": "Edit Message",
      "ar": "تعديل الرسالة",
    },
    "app.msghisto.form.new": {
      "fr": "Nouveau MsgHisto",
      "en": "New Message History",
      "ar": "سجل رسالة جديد",
    },
    "app.msghisto.form.edit": {
      "fr": "Edit MsgHisto",
      "en": "Edit Message History",
      "ar": "تعديل سجل الرسائل",
    },
    "app.common.loading": {
      "fr": "Chargement...",
      "en": "Loading...",
      "ar": "جار التحميل...",
    },
    "main.menu.navbar.navitem.setting.payment.mode.title": {
      "fr": "Gestion Mode de Paiement",
      "en": "Payment Mode Management",
      "ar": "إدارة طريقة الدفع",
    },
    "app.form.input.placeholder.prefix": {
      "fr": "Entrez Votre",
      "en": "Enter your",
      "ar": "أدخل",
    },
    "app.badge.required": {
      "fr": "est obligatoire",
      "en": "is required",
      "ar": "مطلوب",
    },
    "app.compo.esn.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.esn.list.table.thead.profession": {
      "fr": "Profession",
      "en": "Profession",
      "ar": "المهنة",
    },
    "app.compo.esn.list.table.thead.street": {
      "fr": "Rue",
      "en": "Street",
      "ar": "الشارع",
    },
    "app.compo.esn.list.table.thead.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
      "ar": "الرمز البريدي",
    },
    "app.compo.esn.list.table.thead.city": {
      "fr": "Ville",
      "en": "City",
      "ar": "المدينة",
    },
    "app.compo.esn.list.table.thead.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "البلد",
    },
    "app.compo.esn.list.table.thead.webSite": {
      "fr": "Site Web",
      "en": "WebSite",
      "ar": "الموقع الإلكتروني",
    },
    "app.compo.esn.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
      "ar": "الهاتف",
    },
    "app.compo.esn.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
      "ar": "البريد الإلكتروني",
    },
    "app.compo.esn.list.table.thead.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
      "ar": "اسم المسؤول",
    },
    "app.compo.esn.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
      "ar": "الإجراء",
    },
    "app.compo.esn.list.table.action.delete": {
      "fr": "Supprimer",
      "en": "Delete",
      "ar": "حذف",
    },
    "app.compo.esn.list.table.action.edit": {
      "fr": "Modifier",
      "en": "Edit",
      "ar": "تعديل",
    },
    "app.compo.esn.list.table.action.add": {
      "fr": "Ajouter",
      "en": "Add",
      "ar": "إضافة",
    },
    "app.compo.esn.form.input.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.esn.form.input.profession": {
      "fr": "Activites",
      "en": "Activities",
      "ar": "الأنشطة",
    },
    "app.compo.esn.form.input.street": {
      "fr": "Rue",
      "en": "Street",
      "ar": "الشارع",
    },
    "app.compo.esn.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
      "ar": "الرمز البريدي",
    },
    "app.compo.esn.form.input.city": {
      "fr": "Ville",
      "en": "City",
      "ar": "المدينة",
    },
    "app.compo.esn.form.input.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "البلد",
    },
    "app.compo.esn.form.input.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
      "ar": "الموقع الإلكتروني",
    },
    "app.compo.esn.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
      "ar": "الهاتف",
    },
    "app.compo.esn.form.input.email": {
      "fr": "Email de l'ESN",
      "en": "ESN Email",
      "ar": "البريد الإلكتروني للمؤسسة",
    },
    "app.compo.esn.form.payroll.sectionTitle": {
      "fr": "Informations Paie (Societe)",
      "en": "Payroll Information (Company)",
      "ar": "معلومات الرواتب (الشركة)",
    },
    "app.compo.esn.form.input.payrollSiret": {
      "fr": "SIRET",
      "en": "SIRET",
      "ar": "رقم SIRET",
    },
    "app.compo.esn.form.input.payrollCodeNaf": {
      "fr": "Code NAF",
      "en": "NAF Code",
      "ar": "رمز NAF",
    },
    "app.compo.esn.form.input.payrollUrssaf": {
      "fr": "URSSAF",
      "en": "URSSAF",
      "ar": "URSSAF",
    },
    "app.compo.esn.form.input.payrollConventionCollective": {
      "fr": "Convention collective",
      "en": "Collective agreement",
      "ar": "الاتفاقية الجماعية",
    },
    "app.compo.esn.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
      "ar": "العودة إلى القائمة",
    },
    "app.compo.client.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.client.list.table.thead.profession": {
      "fr": "Profession",
      "en": "Profession",
      "ar": "المهنة",
    },
    "app.compo.client.list.table.thead.street": {
      "fr": "Rue",
      "en": "Street",
      "ar": "الشارع",
    },
    "app.compo.client.list.table.thead.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
      "ar": "الرمز البريدي",
    },
    "app.compo.client.list.table.thead.city": {
      "fr": "Ville",
      "en": "City",
      "ar": "المدينة",
    },
    "app.compo.client.list.table.thead.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "البلد",
    },
    "app.compo.client.list.table.thead.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
      "ar": "الموقع الإلكتروني",
    },
    "app.compo.client.list.table.thead.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
      "ar": "اسم المسؤول",
    },
    "app.compo.client.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
      "ar": "الهاتف",
    },
    "app.compo.client.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
      "ar": "البريد الإلكتروني",
    },
    "app.compo.client.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
      "ar": "الإجراء",
    },
    "app.compo.client.list.table.action.delete": {
      "fr": "Supprimer",
      "en": "Delete",
      "ar": "حذف",
    },
    "app.compo.client.list.table.action.add": {
      "fr": "Ajouter",
      "en": "Add",
      "ar": "إضافة",
    },
    "app.compo.client.form.input.name": {
      "fr": "Name",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.client.form.input.profession": {
      "fr": "Profession",
      "en": "Profession",
      "ar": "المهنة",
    },
    "app.compo.client.form.input.street": {
      "fr": "Rue",
      "en": "Street",
      "ar": "الشارع",
    },
    "app.compo.client.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
      "ar": "الرمز البريدي",
    },
    "app.compo.client.form.input.city": {
      "fr": "Ville",
      "en": "City",
      "ar": "المدينة",
    },
    "app.compo.client.form.input.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "البلد",
    },
    "app.compo.client.form.input.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
      "ar": "الموقع الإلكتروني",
    },
    "app.compo.client.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
      "ar": "الهاتف",
    },
    "app.compo.client.form.input.email": {
      "fr": "Email",
      "en": "Email",
      "ar": "البريد الإلكتروني",
    },
    "app.compo.client.form.input.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
      "ar": "اسم المسؤول",
    },
    "app.compo.client.form.button.list": {
      "fr": "Retour \u00e0 la Liste",
      "en": "Back to list",
      "ar": "العودة إلى القائمة",
    },
    "app.compo.project.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.project.list.table.thead.description": {
      "fr": "Description",
      "en": "Description",
      "ar": "الوصف",
    },
    "app.compo.project.list.table.thead.team": {
      "fr": "Equipe",
      "en": "Team",
      "ar": "الفريق",
    },
    "app.compo.project.list.table.thead.method": {
      "fr": "M\u00e9thode",
      "en": "Method",
      "ar": "المنهجية",
    },
    "app.compo.project.list.table.thead.client": {
      "fr": "Client",
      "en": "Client",
      "ar": "العميل",
    },
    "app.compo.project.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
      "ar": "الإجراء",
    },
    "app.compo.project.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
      "ar": "حذف",
    },
    "app.compo.project.list.table.action.add": {
      "fr": "AJOUTER",
      "en": "ADD",
      "ar": "إضافة",
    },
    "app.compo.project.form.input.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.project.form.input.description": {
      "fr": "Description",
      "en": "Description",
      "ar": "الوصف",
    },
    "app.compo.project.form.input.teamNumber": {
      "fr": "Nombre d'\u00e9quipe",
      "en": "TeamNumber",
      "ar": "عدد أعضاء الفريق",
    },
    "app.compo.project.form.input.teamDesc": {
      "fr": "Description de l'\u00e9quipe",
      "en": "TeamDesc",
      "ar": "وصف الفريق",
    },
    "app.compo.project.form.input.method": {
      "fr": "M\u00e9thode",
      "en": "Method",
      "ar": "المنهجية",
    },
    "app.compo.project.form.input.environment": {
      "fr": "Environnement",
      "en": "Environment",
      "ar": "البيئة",
    },
    "app.compo.project.form.input.client": {
      "fr": "Client",
      "en": "Client",
      "ar": "العميل",
    },
    "app.compo.project.form.input.comment": {
      "fr": "Commentaire",
      "en": "Comment",
      "ar": "ملاحظة",
    },
    "app.compo.project.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
      "ar": "العودة إلى القائمة",
    },
    "app.compo.consultant.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.consultant.list.table.thead.username": {
      "fr": "Nom Utilisateur",
      "en": "Username",
      "ar": "اسم المستخدم",
    },
    "app.compo.consultant.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
      "ar": "الهاتف",
    },
    "app.compo.consultant.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
      "ar": "البريد الإلكتروني",
    },
    "app.compo.consultant.list.table.thead.esn": {
      "fr": "Esn",
      "en": "Esn",
      "ar": "المؤسسة",
    },
    "app.compo.consultant.list.table.thead.action": {
      "fr": "Actions",
      "en": "Actions",
      "ar": "الإجراءات",
    },
    "app.compo.consultant.list.table.action.edit": {
      "fr": "Editer",
      "en": "edit",
      "ar": "تعديل",
    },
    "app.compo.consultant.list.table.action.delete": {
      "fr": "supprimer",
      "en": "delete",
      "ar": "حذف",
    },
    "app.compo.consultant.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
      "ar": "إضافة",
    },
    "consultant.all.abo": {
      "fr": "Afficher l'arborescence",
      "en": "Display hierarchy",
      "ar": "عرض الشجرة",
    },
    "app.compo.consultant.form.input.firstName": {
      "fr": "Pr\u00e9nom",
      "en": "First Name",
      "ar": "الاسم الأول",
    },
    "app.compo.consultant.form.input.lastName": {
      "fr": "Nom",
      "en": "Last Name",
      "ar": "اسم العائلة",
    },
    "app.compo.consultant.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
      "ar": "الهاتف",
    },
    "app.compo.consultant.form.input.email": {
      "fr": "Email",
      "en": "Email",
      "ar": "البريد الإلكتروني",
    },
    "app.compo.consultant.form.input.level": {
      "fr": "Niveau",
      "en": "Level",
      "ar": "المستوى",
    },
    "app.compo.consultant.form.input.birthDay": {
      "fr": "Date de naissance",
      "en": "Birth Day",
      "ar": "تاريخ الميلاد",
    },
    "app.compo.consultant.form.input.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "البلد",
    },
    "app.compo.consultant.form.input.city": {
      "fr": "Ville",
      "en": "City",
      "ar": "المدينة",
    },
    "app.compo.consultant.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "ZipCode",
      "ar": "الرمز البريدي",
    },
    "app.compo.consultant.form.input.street": {
      "fr": "Rue",
      "en": "Street",
      "ar": "الشارع",
    },
    "app.compo.consultant.form.input.manager": {
      "fr": "Directeur",
      "en": "Manager",
      "ar": "المدير",
    },
    "app.compo.consultant.form.input.username": {
      "fr": "Nom Utilisateur",
      "en": "Username",
      "ar": "اسم المستخدم",
    },
    "app.compo.consultant.form.validation.usernameInvalid": {
      "fr": "Username invalide (3-64 chars: lettres, chiffres, '.', '_' ou '-')",
      "en": "Invalid username (3-64 chars: letters, numbers, '.', '_' or '-')",
      "ar": "اسم مستخدم غير صالح (3-64 حرفًا: أحرف، أرقام، '.'، '_' أو '-')",
    },
    "app.compo.consultant.form.input.tjmInterne": {
      "fr": "TJM Interne",
      "en": "Internal TJM",
      "ar": "السعر الداخلي",
    },
    "app.compo.consultant.form.input.matricule": {
      "fr": "Matricule",
      "en": "Matricule",
      "ar": "الرقم التعريفي",
    },
    "app.compo.consultant.form.input.photo": {
      "fr": "Photo (cliquer sur l'avatar)",
      "en": "Photo (click on the avatar)",
      "ar": "الصورة (انقر على الصورة الرمزية)",
    },
    "app.compo.consultant.form.input.photoHelp": {
      "fr": "PNG/JPEG/GIF/WebP - max 2 Mo",
      "en": "PNG/JPEG/GIF/WebP - max 2 MB",
      "ar": "PNG/JPEG/GIF/WebP - الحد الأقصى 2 ميغابايت",
    },
    "app.compo.consultant.form.payroll.sectionTitle": {
      "fr": "Informations Paie (Referentiel)",
      "en": "Payroll Information (Reference)",
      "ar": "معلومات الرواتب (المرجعية)",
    },
    "app.compo.consultant.form.input.socialSecurityNumber": {
      "fr": "Numero securite sociale",
      "en": "Social security number",
      "ar": "رقم الضمان الاجتماعي",
    },
    "app.compo.consultant.form.input.jobTitle": {
      "fr": "Emploi",
      "en": "Job title",
      "ar": "المسمى الوظيفي",
    },
    "app.compo.consultant.form.input.professionalStatus": {
      "fr": "Statut professionnel",
      "en": "Professional status",
      "ar": "الوضع المهني",
    },
    "app.compo.consultant.form.input.positionCode": {
      "fr": "Position",
      "en": "Position",
      "ar": "المنصب",
    },
    "app.compo.consultant.form.input.payrollCoefficient": {
      "fr": "Coefficient",
      "en": "Coefficient",
      "ar": "المعامل",
    },
    "app.compo.consultant.form.input.defaultPaymentMode": {
      "fr": "Mode de paiement",
      "en": "Payment method",
      "ar": "طريقة الدفع",
    },
    "app.compo.consultant.form.input.entryDate": {
      "fr": "Date d'entree",
      "en": "Entry date",
      "ar": "تاريخ الالتحاق",
    },
    "app.compo.consultant.form.input.password": {
      "fr": "Mot de passe",
      "en": "Password",
      "ar": "كلمة المرور",
    },
    "app.compo.consultant.form.input.confirmPassword": {
      "fr": "Confirm password",
      "en": "Confirm password",
      "ar": "تأكيد كلمة المرور",
    },
    "app.compo.consultant.form.input.active": {
      "fr": "Actif",
      "en": "Active",
      "ar": "نشط",
    },
    "app.compo.consultant.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
      "ar": "العودة إلى القائمة",
    },
    "app.compo.activityType.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.activityType.list.table.thead.isWorkDay": {
      "fr": "jour ouvrable",
      "en": "isWorkDay",
      "ar": "يوم عمل",
    },
    "app.compo.activityType.list.table.thead.isBillDay": {
      "fr": "jour facturable",
      "en": "isBillDay",
      "ar": "يوم قابل للفوترة",
    },
    "app.compo.activityType.list.table.thead.isHolidayDay": {
      "fr": "jour de vacance",
      "en": "isHolidayDay",
      "ar": "يوم عطلة",
    },
    "app.compo.activityType.list.table.thead.isTrainingDay": {
      "fr": "jour de formation",
      "en": "isTrainingDay",
      "ar": "يوم تدريب",
    },
    "app.compo.activityType.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
      "ar": "الإجراء",
    },
    "app.compo.activityType.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
      "ar": "حذف",
    },
    "app.compo.activityType.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
      "ar": "إضافة",
    },
    "app.compo.activityType.form.input.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.activityType.form.input.isWorkDay": {
      "fr": "jour ouvrable",
      "en": "isWorkDay",
      "ar": "يوم عمل",
    },
    "app.compo.activityType.form.input.isBillDay": {
      "fr": "jour facturable",
      "en": "isBillDay",
      "ar": "يوم قابل للفوترة",
    },
    "app.compo.activityType.form.input.isHolidayDay": {
      "fr": "jour de vacance",
      "en": "isHolidayDay",
      "ar": "يوم عطلة",
    },
    "app.compo.activityType.form.input.isTrainingDay": {
      "fr": "jour de formation",
      "en": "isTrainingDay",
      "ar": "يوم تدريب",
    },
    "app.compo.activityType.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
      "ar": "العودة إلى القائمة",
    },
    "app.compo.activity.select.consultant.title": {
      "fr": "Les activités du consultant",
      "en": "Consultant Activities",
      "ar": "أنشطة المستشار",
    },
    "app.compo.activity.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.activity.list.table.thead.type": {
      "fr": "Type",
      "en": "Type",
      "ar": "النوع",
    },
    "app.compo.activity.list.table.thead.project": {
      "fr": "Project",
      "en": "Project",
      "ar": "المشروع",
    },
    "app.compo.activity.list.table.thead.client": {
      "fr": "Client",
      "en": "Client",
      "ar": "العميل",
    },
    "app.compo.activity.list.table.thead.startDate": {
      "fr": "Date D\u00e9but",
      "en": "StartDate",
      "ar": "تاريخ البداية",
    },
    "app.compo.activity.list.table.thead.endDate": {
      "fr": "Date Fin",
      "en": "EndDate",
      "ar": "تاريخ النهاية",
    },
    "app.compo.activity.list.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
      "ar": "المستشار",
    },
    "app.compo.activity.list.table.thead.valid": {
      "fr": "Valide",
      "en": "Valid",
      "ar": "صالح",
    },
    "app.compo.activity.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
      "ar": "الإجراء",
    },
    "app.compo.activity.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
      "ar": "حذف",
    },
    "app.compo.activity.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
      "ar": "إضافة",
    },
    "app.compo.activity.list.button.addMultiple": {
      "fr": "AJOUTER ACTIVITE MULTIPLE",
      "en": "ADD MULTI ACTIVITY",
      "ar": "إضافة نشاط متعدد",
    },
    "app.compo.activity.form.input.type": {
      "fr": "Type",
      "en": "Type",
      "ar": "النوع",
    },
    "app.compo.activity.form.input.project": {
      "fr": "Project",
      "en": "Project",
      "ar": "المشروع",
    },
    "app.compo.activity.form.input.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
      "ar": "تاريخ البداية",
    },
    "app.compo.activity.form.input.endDate": {
      "fr": "Date Fin",
      "en": "End date",
      "ar": "تاريخ النهاية",
    },
    "app.compo.activity.form.input.description": {
      "fr": "Description",
      "en": "Description",
      "ar": "الوصف",
    },
    "app.compo.activity.form.input.files": {
      "fr": "Fichiers",
      "en": "Files",
      "ar": "الملفات",
    },
    "app.compo.activity.form.input.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
      "ar": "المستشار",
    },
    "app.compo.activity.form.input.valid": {
      "fr": "Valide",
      "en": "Valid",
      "ar": "صالح",
    },
    "app.compo.activity.form.input.tjm": {
      "fr": "TJM",
      "en": "TJM",
      "ar": "TJM",
    },
    "app.compo.activity.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
      "ar": "العودة إلى القائمة",
    },
    "app.compo.activity.multiple.table.thead.activity": {
      "fr": "Activité",
      "en": "Activity",
      "ar": "النشاط",
    },
    "app.compo.activity.multiple.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
      "ar": "المستشار",
    },
    "app.compo.activity.multiple.table.thead.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
      "ar": "تاريخ البداية",
    },
    "app.compo.activity.multiple.table.thead.endDate": {
      "fr": "Date Fin",
      "en": "End Date",
      "ar": "تاريخ النهاية",
    },
    "app.compo.activity.multiple.table.thead.actions": {
      "fr": "Actions",
      "en": "Actions",
      "ar": "الإجراءات",
    },
    "app.compo.activity.multiple.table.actions.delete": {
      "fr": "Supprimer",
      "en": "Remove",
      "ar": "حذف",
    },
    "app.compo.activity.multiple.input.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
      "ar": "المستشار",
    },
    "app.compo.activity.multiple.input.type": {
      "fr": "Type",
      "en": "Type",
      "ar": "النوع",
    },
    "app.compo.activity.multiple.input.project": {
      "fr": "Project",
      "en": "Project",
      "ar": "المشروع",
    },
    "app.compo.activity.multiple.input.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
      "ar": "تاريخ البداية",
    },
    "app.compo.activity.multiple.input.endDate": {
      "fr": "Date Fin",
      "en": "End date",
      "ar": "تاريخ النهاية",
    },
    "app.compo.activity.multiple.input.description": {
      "fr": "Description",
      "en": "Description",
      "ar": "الوصف",
    },
    "app.compo.activity.multiple.input.files": {
      "fr": "Fichiers",
      "en": "Files",
      "ar": "الملفات",
    },
    "app.compo.activity.multiple.input.hourSup": {
      "fr": "Hueres suppl\u00e9mentaires",
      "en": "Hour Supplementary",
      "ar": "ساعات إضافية",
    },
    "app.compo.activity.multiple.input.valid": {
      "fr": "Valide",
      "en": "Valid",
      "ar": "صالح",
    },
    "app.compo.activity.multiple.hourSup.select.target.hour": {
      "fr": "Heure",
      "en": "Hour",
      "ar": "ساعة",
    },
    "app.compo.activity.multiple.hourSup.select.target.saturday": {
      "fr": "Samedi",
      "en": "Saturday",
      "ar": "السبت",
    },
    "app.compo.activity.multiple.hourSup.select.target.sunday": {
      "fr": "Dimanche",
      "en": "Sunday",
      "ar": "الأحد",
    },
    "app.compo.activity.multiple.hourSup.select.target.holiday": {
      "fr": "Vacance",
      "en": "Holiday",
      "ar": "عطلة",
    },
    "app.compo.activity.multiple.hourSup.table.thead.target": {
      "fr": "But",
      "en": "Target",
      "ar": "الهدف",
    },
    "app.compo.activity.multiple.hourSup.table.thead.price": {
      "fr": "Prix",
      "en": "Price",
      "ar": "السعر",
    },
    "app.compo.activity.multiple.hourSup.table.thead.percent": {
      "fr": "%",
      "en": "%",
      "ar": "%",
    },
    "app.compo.activity.multiple.hourSup.table.thead.actions": {
      "fr": "Actions",
      "en": "Actions",
      "ar": "الإجراءات",
    },
    "app.compo.activity.multiple.hourSup.table.actions.add": {
      "fr": "AJOUTER",
      "en": "ADD",
      "ar": "إضافة",
    },
    "app.compo.activity.multiple.actions.add": {
      "fr": "AJOUTER",
      "en": "ADD",
      "ar": "إضافة",
    },
    "app.compo.activity.multiple.actions.submit": {
      "fr": "SOUMETTRE",
      "en": "SUBMIT",
      "ar": "إرسال",
    },
    "app.compo.activity.multiple.modal.title": {
      "fr": "AJOUTER ACTIVITES MULTIPLES",
      "en": "ADD MULTI ACTIVITY",
      "ar": "إضافة أنشطة متعددة",
    },
    "app.compo.activity.multiple.error.endDateBeforeStart": {
      "fr": "La date de fin du projet doit être supérieure ou égale à la date de début",
      "en": "Project end date must be greater than or equal to start date",
      "ar": "يجب أن يكون تاريخ نهاية المشروع أكبر من أو يساوي تاريخ البداية",
    },
    "app.compo.activity.multiple.error.targetAlreadyExists": {
      "fr": "La cible {{target}} existe déjà",
      "en": "Target {{target}} already exists",
      "ar": "الهدف {{target}} موجود بالفعل",
    },
    "app.compo.cra.list.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
      "ar": "المستشار",
    },
    "app.compo.cra.list.table.thead.month": {
      "fr": "Mois",
      "en": "Month",
      "ar": "الشهر",
    },
    "app.compo.cra.list.table.thead.createdDate": {
      "fr": "Date Cr\u00e9ation",
      "en": "CreatedDate",
      "ar": "تاريخ الإنشاء",
    },
    "app.compo.cra.list.table.thead.lastUpdateDate": {
      "fr": "Date Modification",
      "en": "LastUpdateDate",
      "ar": "تاريخ التعديل",
    },
    "app.compo.cra.list.table.thead.status": {
      "fr": "Statut",
      "en": "Status",
      "ar": "الحالة",
    },
    "app.compo.cra.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
      "ar": "الإجراء",
    },
    "showConge": {
      "fr": "Voir Congé",
      "en": "Show Vacation",
      "ar": "عرض الإجازة",
    },
    "showCra": {
      "fr": "Voir Cra",
      "en": "Show Cra",
      "ar": "عرض CRA",
    },

    "Cra": {
      "fr": "Cra",
      "en": "Cra",
      "ar": "CRA",
    },

    "Conge": {
      "fr": "Congé",
      "en": "Vacation",
      "ar": "إجازة",
    },

    "Show": {
      "fr": "Voir",
      "en": "Show",
      "ar": "عرض",
    },


    "app.compo.cra.list.table.action.addConge": {
      "fr": "Ajouter Congé",
      "en": "Add Vacation",
      "ar": "إضافة إجازة",
    },
    "app.compo.cra.list.table.action.addCra": {
      "fr": "Ajouter Cra",
      "en": "Add Cra",
      "ar": "إضافة CRA",
    },
    "app.compo.cra.list.table.action.delCra": {
      "fr": "Supprimer Cra",
      "en": "Delete Cra",
      "ar": "حذف CRA",
    },
    //Note de Frais Traduction
    "app.compo.frais.form.input.title": {
      "fr": "Titre",
      "en": "Title",
      "ar": "العنوان",
    },
    "app.compo.frais.form.input.dateFee": {
      "fr": "Date Frais",
      "en": "Fee Date",
      "ar": "تاريخ المصروف",
    },
    "app.compo.frais.form.input.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "البلد",
    },
    "app.compo.frais.form.input.activity": {
      "fr": "Mission",
      "en": "Activity",
      "ar": "المهمة",
    },
    "app.compo.frais.form.input.payementMode": {
      "fr": "Mode Paiement",
      "en": "Payement Mode",
      "ar": "طريقة الدفع",
    },
    "app.compo.frais.form.input.categories": {
      "fr": "Cat\u00e9gories",
      "en": "Categories",
      "ar": "الفئات",
    },
    "app.compo.frais.form.input.invoice": {
      "fr": "D\u00e9tails Facture",
      "en": "Invoice details",
      "ar": "تفاصيل الفاتورة",
    },
    "app.compo.frais.form.input.invoiceNumber": {
      "fr": "Num\u00e9ro Facture",
      "en": "Invoice Number",
      "ar": "رقم الفاتورة",
    },
    "app.compo.frais.form.input.pretaxAmount": {
      "fr": "Prix HT",
      "en": "Pretax Amount",
      "ar": "السعر قبل الضريبة",
    },
    "app.compo.frais.form.input.vat": {
      "fr": "TVA",
      "en": "VAT",
      "ar": "الضريبة على القيمة المضافة",
    },
    "app.compo.frais.form.input.amount": {
      "fr": "Montant Total",
      "en": "Amount",
      "ar": "المبلغ الإجمالي",
    },
    "app.compo.frais.form.input.brand": {
      "fr": "Nom Enseigne",
      "en": "Brand Name",
      "ar": "اسم العلامة التجارية",
    },
    "app.compo.frais.form.input.description": {
      "fr": "Description",
      "en": "Description",
      "ar": "الوصف",
    },
    "app.compo.frais.form.input.feeList": {
      "fr": "List Note Frais",
      "en": "Fee List",
      "ar": "قائمة المصاريف",
    },
    "app.compo.frais.list.table.thead.title": {
      "fr": "Titre",
      "en": "Title",
      "ar": "العنوان",
    },
    "app.compo.frais.list.table.thead.date": {
      "fr": "Date",
      "en": "Date",
      "ar": "التاريخ",
    },
    "app.compo.frais.list.table.thead.category": {
      "fr": "Cat\u00e9gorie",
      "en": "Category",
      "ar": "الفئة",
    },
    "app.compo.frais.list.table.thead.brandName": {
      "fr": "Nom Enseigne",
      "en": "Brand Name",
      "ar": "اسم العلامة التجارية",
    },
    "app.compo.frais.list.table.thead.vat": {
      "fr": "TVA",
      "en": "VAT",
      "ar": "الضريبة على القيمة المضافة",
    },
    "app.compo.frais.list.table.thead.pretaxAmount": {
      "fr": "Prix HT",
      "en": "Pretax Amount",
      "ar": "السعر قبل الضريبة",
    },
    "app.compo.frais.list.table.thead.amount": {
      "fr": "Montant",
      "en": "Amount",
      "ar": "المبلغ",
    },
    "app.compo.frais.list.table.thead.status": {
      "fr": "Statut",
      "en": "Status",
      "ar": "الحالة",
    },
    "app.compo.frais.list.table.thead.action": {
      "fr": "Actions",
      "en": "Actions",
      "ar": "الإجراءات",
    },
    "app.compo.frais.list.payementDate": {
      "fr": "Date Paiement",
      "en": "Payement Date",
      "ar": "تاريخ الدفع",
    },
    "app.compo.frais.list.button.add": {
      "fr": "Ajouter",
      "en": "Add",
      "ar": "إضافة",
    },
    "app.compo.frais.list.table.thead.consultantName": {
      "fr": "Nom Consultant",
      "en": "Consultant Name",
      "ar": "اسم المستشار",
    },
    "Refresh": {
      "fr": "Actualiser",
      "en": "Refresh",
      "ar": "تحديث",
    },
    "Clear": {
      "fr": "Effacer",
      "en": "Clear",
      "ar": "مسح",
    },
    "Validate": {
      "fr": "Valider",
      "en": "Validate",
      "ar": "تأكيد",
    },
    "Name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "Level": {
      "fr": "Niveau",
      "en": "Level",
      "ar": "المستوى",
    },
    "app.compo.cra.list.historyTitle": {
      "fr": "Historique CRA Consultant",
      "en": "CRA Consultant History",
      "ar": "سجل CRA المستشار",
    },
    "app.compo.cra.list.validByConsultant": {
      "fr": "Validé par Consultant",
      "en": "Valid By Consultant",
      "ar": "موافقة المستشار",
    },
    "app.compo.cra.list.validByManager": {
      "fr": "Validé par Manager",
      "en": "Valid By Manager",
      "ar": "موافقة المدير",
    },
    "app.compo.cra.list.dateCR": {
      "fr": "Date CR",
      "en": "Date CR",
      "ar": "تاريخ CR",
    },
    "app.compo.cra.addMultiDate.title": {
      "fr": "AJOUTER PLAGE DE DATES",
      "en": "ADD MULTI DATE RANGE",
      "ar": "إضافة نطاق تاريخ",
    },
    "app.compo.notification.deleteAll": {
      "fr": "Tout supprimer pour moi",
      "en": "Delete All To Me",
      "ar": "حذف كل الإشعارات",
    },
    "app.compo.notification.every": {
      "fr": "Toutes les",
      "en": "Every",
      "ar": "كل",
    },
    "app.compo.notification.seconds": {
      "fr": "secondes.",
      "en": "seconds.",
      "ar": "ثانية.",
    },
    "app.compo.notification.showFee": {
      "fr": "Voir Note de Frais",
      "en": "View Fee Note",
      "ar": "عرض ملاحظة المصروفات",
    },
    "app.compo.notification.showDoc": {
      "fr": "Voir Document",
      "en": "View Document",
      "ar": "عرض الوثيقة",
    },
    "app.compo.notification.empty": {
      "fr": "Aucune notification.",
      "en": "No notifications.",
      "ar": "لا توجد إشعارات.",
    },
    "app.compo.notification.document": {
      "fr": "Document",
      "en": "Document",
      "ar": "وثيقة",
    },
    "app.compo.notification.category": {
      "fr": "Catégorie",
      "en": "Category",
      "ar": "الفئة",
    },
    "app.compo.notification.categoryName": {
      "fr": "Nom Catégorie",
      "en": "Category Name",
      "ar": "اسم الفئة",
    },
    "app.compo.notification.createdBy": {
      "fr": "Créé par",
      "en": "Created by",
      "ar": "أنشئ بواسطة",
    },
    "app.compo.connection.date": {
      "fr": "Date",
      "en": "Date",
      "ar": "التاريخ",
    },
    "app.compo.connection.login": {
      "fr": "Login",
      "en": "Login",
      "ar": "تسجيل الدخول",
    },
    "app.compo.connection.ip": {
      "fr": "IP",
      "en": "IP",
      "ar": "IP",
    },
    "app.compo.connection.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "البلد",
    },
    "app.compo.connection.city": {
      "fr": "Ville",
      "en": "City",
      "ar": "المدينة",
    },
    "app.compo.connection.map": {
      "fr": "Carte",
      "en": "Map",
      "ar": "الخريطة",
    },
    "app.compo.connection.view": {
      "fr": "Voir",
      "en": "View",
      "ar": "عرض",
    },
    "app.compo.frais.list.selectPaymentDate": {
      "fr": "Séléctionnez la date de paiement",
      "en": "Select payment date",
      "ar": "حدد تاريخ الدفع",
    },
    "app.compo.inscription.title": {
      "fr": "Inscription ESN & Responsable",
      "en": "ESN & Manager Registration",
      "ar": "تسجيل ESN والمسؤول",
    },
    "app.compo.docCategory.enabledForAdmin": {
      "fr": "Activé pour Admin",
      "en": "Enabled For Admin",
      "ar": "مفعّل للمشرف",
    },
    "app.compo.docCategory.enabledForConsultant": {
      "fr": "Activé pour Consultant",
      "en": "Enabled For Consultant",
      "ar": "مفعّل للمستشار",
    },
    "app.compo.payementMode.addBtn": {
      "fr": "Ajouter Mode Paiement",
      "en": "Add Payment Mode",
      "ar": "إضافة طريقة دفع",
    },
    "app.compo.loading": {
      "fr": "CHARGEMENT...",
      "en": "LOADING...",
      "ar": "جار التحميل...",
    },
    "app.compo.category.form.new": {
      "fr": "Nouvelle Catégorie",
      "en": "New Category",
      "ar": "فئة جديدة",
    },
    "app.compo.category.form.edit": {
      "fr": "Modifier Catégorie",
      "en": "Edit Category",
      "ar": "تعديل الفئة",
    },
    "app.compo.payementMode.form.new": {
      "fr": "Nouveau Mode Paiement",
      "en": "New Payment Mode",
      "ar": "طريقة دفع جديدة",
    },
    "app.compo.payementMode.form.edit": {
      "fr": "Modifier Mode Paiement",
      "en": "Edit Payment Mode",
      "ar": "تعديل طريقة الدفع",
    },
    "app.compo.docCategory.form.new": {
      "fr": "Nouvelle Catégorie de Document",
      "en": "New Document Category",
      "ar": "فئة وثيقة جديدة",
    },
    "app.compo.docCategory.form.edit": {
      "fr": "Modifier Catégorie de Document",
      "en": "Edit Document Category",
      "ar": "تعديل فئة الوثيقة",
    },
    "app.compo.esn.arbo.listResp": {
      "fr": "Liste Responsables",
      "en": "List Managers",
      "ar": "قائمة المسؤولين",
    },
    "app.compo.esn.arbo.listClients": {
      "fr": "Liste Clients",
      "en": "List Clients",
      "ar": "قائمة العملاء",
    },
    "app.compo.esn.arbo.listProjects": {
      "fr": "Liste Projets",
      "en": "List Projects",
      "ar": "قائمة المشاريع",
    },
    "app.compo.esn.arbo.listActivity": {
      "fr": "Liste Activités",
      "en": "List Activities",
      "ar": "قائمة الأنشطة",
    },
    "app.compo.esn.arbo.listActivityType": {
      "fr": "Liste Types Activité",
      "en": "List Activity Types",
      "ar": "قائمة أنواع النشاط",
    },
    "app.compo.consultant.arbo.listCra": {
      "fr": "Liste CRA",
      "en": "List CRA",
      "ar": "قائمة CRA",
    },
    "app.compo.adminDoc.list.myDocuments": {
      "fr": "Mes Documents",
      "en": "My Documents",
      "ar": "وثائقي",
    },
    "app.compo.adminDoc.list.shared": {
      "fr": "Partagés",
      "en": "Shared",
      "ar": "مشترك",
    },
    "app.compo.adminDoc.list.category": {
      "fr": "Catégorie",
      "en": "Category",
      "ar": "الفئة",
    },
    "app.compo.adminDoc.list.documents": {
      "fr": "Documents",
      "en": "Documents",
      "ar": "الوثائق",
    },
    "app.compo.adminDoc.list.addDocument": {
      "fr": "Ajouter Document",
      "en": "Add Document",
      "ar": "إضافة وثيقة",
    },
    "app.compo.adminDoc.list.shareDocTitle": {
      "fr": "Partager le document",
      "en": "Share document",
      "ar": "مشاركة الوثيقة",
    },
    "app.compo.adminDoc.list.addDocTitle": {
      "fr": "Ajouter document",
      "en": "Add document",
      "ar": "إضافة وثيقة",
    },
    "app.compo.adminDoc.permission.title": {
      "fr": "Gérer les Permissions Document",
      "en": "Manage Document Permissions",
      "ar": "إدارة أذونات الوثيقة",
    },
    "app.compo.adminDoc.permission.categoryDoc": {
      "fr": "Catégorie Document",
      "en": "Document Category",
      "ar": "فئة الوثيقة",
    },
    "app.compo.adminDoc.permission.managementName": {
      "fr": "Nom Gestion",
      "en": "Management Name",
      "ar": "اسم الإدارة",
    },
    "app.compo.adminDoc.permission.enabledForManager": {
      "fr": "Activé pour Manager",
      "en": "Enabled For Manager",
      "ar": "مفعّل للمدير",
    },
    "app.compo.adminDoc.list.listDocs": {
      "fr": "Liste Documents",
      "en": "List Docs",
      "ar": "قائمة الوثائق",
    },
    "app.compo.adminDoc.multiple.addBtn": {
      "fr": "Ajouter",
      "en": "Add",
      "ar": "إضافة",
    },
    "Update": {
      "fr": "Mettre à jour",
      "en": "Update",
      "ar": "تحديث",
    },
    "Share": {
      "fr": "Partager",
      "en": "Share",
      "ar": "مشاركة",
    },
    "DateCreation": {
      "fr": "Date Création",
      "en": "Creation Date",
      "ar": "تاريخ الإنشاء",
    },
    "File": {
      "fr": "Fichier",
      "en": "File",
      "ar": "ملف",
    },
    "Previous": {
      "fr": "Précédent",
      "en": "Previous",
      "ar": "السابق",
    },
    "Today": {
      "fr": "Aujourd'hui",
      "en": "Today",
      "ar": "اليوم",
    },
    "Next": {
      "fr": "Suivant",
      "en": "Next",
      "ar": "التالي",
    },
    "app.compo.craConfig.editHoliday": {
      "fr": "Modifier le congé personnel",
      "en": "Edit personal holiday",
      "ar": "تعديل العطلة الشخصية",
    },
    "app.compo.craConfig.addHoliday": {
      "fr": "Ajouter un congé personnel",
      "en": "Add personal holiday",
      "ar": "إضافة عطلة شخصية",
    },
    "app.compo.craConfig.eventTitle": {
      "fr": "Titre de l'événement",
      "en": "Event title",
      "ar": "عنوان الحدث",
    },
    "Address": {
      "fr": "Adresse",
      "en": "Address",
      "ar": "العنوان",
    },
    "app.compo.consultant.form.notExist": {
      "fr": "N'existe pas",
      "en": "Not Exist",
      "ar": "غير موجود",
    },
    "app.compo.consultant.form.resetPassword": {
      "fr": "Réinitialiser le mot de passe",
      "en": "Reset Password",
      "ar": "إعادة تعيين كلمة المرور",
    },
    "app.compo.frais.dash.currentMonth": {
      "fr": "Ce Mois",
      "en": "Current Month",
      "ar": "هذا الشهر",
    },
    "app.compo.frais.dash.currentYear": {
      "fr": "Cette Année",
      "en": "Current Year",
      "ar": "هذا العام",
    },
    "app.compo.frais.dash.lastMonth": {
      "fr": "Mois dernier",
      "en": "Last Month",
      "ar": "الشهر الماضي",
    },
    "app.compo.frais.dash.lastYear": {
      "fr": "Année dernière",
      "en": "Last Year",
      "ar": "العام الماضي",
    },
    "app.compo.cra.form.summary": {
      "fr": "Résumé",
      "en": "Summary",
      "ar": "الملخص",
    },
    "app.compo.cra.form.addMultiDate": {
      "fr": "Ajouter plage de dates",
      "en": "Add Multi Date",
      "ar": "إضافة نطاق تواريخ",
    },
    "app.compo.cra.form.changeTypeToCra": {
      "fr": "Changer le type en CRA",
      "en": "Change Type To CRA",
      "ar": "تغيير النوع إلى CRA",
    },
    "app.compo.cra.form.listCras": {
      "fr": "Liste CRAs/Congés",
      "en": "List CRAs/Conges",
      "ar": "قائمة CRA/الإجازات",
    },
    "app.compo.cra.form.weekNumber": {
      "fr": "Numéro Semaine",
      "en": "Week Number",
      "ar": "رقم الأسبوع",
    },
    "app.compo.cra.form.showWeekNumber": {
      "fr": "Afficher numéro de semaine",
      "en": "Show Week Number",
      "ar": "إظهار رقم الأسبوع",
    },
    "app.compo.cra.form.hideWeekNumber": {
      "fr": "Masquer numéro de semaine",
      "en": "Hide Week Number",
      "ar": "إخفاء رقم الأسبوع",
    },
    "app.compo.cra.form.daysOpen": {
      "fr": "Jours ouvrables",
      "en": "Days Open",
      "ar": "أيام العمل",
    },
    "app.compo.cra.form.daysAbs": {
      "fr": "Jours absents",
      "en": "Days Abs",
      "ar": "أيام الغياب",
    },
    "app.compo.cra.form.daysWorked": {
      "fr": "Jours travaillés",
      "en": "Days Worked",
      "ar": "أيام العمل الفعلية",
    },
    "app.compo.cra.form.daysBilled": {
      "fr": "Jours facturés",
      "en": "Days Billed",
      "ar": "أيام الفوترة",
    },
    "app.compo.cra.form.totalBilled": {
      "fr": "Total facturé",
      "en": "Total Billed",
      "ar": "إجمالي الفوترة",
    },
    "app.compo.cra.form.downloadAttachment": {
      "fr": "Télécharger pièce jointe",
      "en": "Download attachment",
      "ar": "تحميل المرفق",
    },
    "app.compo.cra.form.checkValidation": {
      "fr": "Vérifier validation de",
      "en": "Check Validation of",
      "ar": "التحقق من صحة",
    },
    "app.compo.cra.form.submit": {
      "fr": "Soumettre",
      "en": "Submit",
      "ar": "إرسال",
    },
    "app.compo.cra.form.pdfForClient": {
      "fr": "PDF pour Client",
      "en": "PDF for Client",
      "ar": "PDF للعميل",
    },
    "app.compo.cra.form.pdfForEsn": {
      "fr": "PDF pour ESN",
      "en": "Pdf for ESN",
      "ar": "PDF لـ ESN",
    },
    "app.compo.cra.form.generateFichePaieFromCra": {
      "fr": "Fiche de paie",
      "en": "Payroll slip",
      "ar": "قسيمة الراتب",
    },
    "app.compo.cra.form.deleteAll": {
      "fr": "Tout supprimer",
      "en": "Delete All",
      "ar": "حذف الكل",
    },
    "app.compo.cra.form.approve": {
      "fr": "Approuver",
      "en": "Approve",
      "ar": "موافقة",
    },
    "app.compo.cra.form.reject": {
      "fr": "Rejeter",
      "en": "Reject",
      "ar": "رفض",
    },
    "app.compo.cra.form.selectActivity": {
      "fr": "Sélectionner activité",
      "en": "Select activity",
      "ar": "اختر النشاط",
    },
    "app.compo.cra.form.startHour": {
      "fr": "Heure début",
      "en": "Start Hour",
      "ar": "ساعة البداية",
    },
    "app.compo.cra.form.endHour": {
      "fr": "Heure fin",
      "en": "End Hour",
      "ar": "ساعة النهاية",
    },
    "app.compo.cra.form.time": {
      "fr": "Durée",
      "en": "Time",
      "ar": "المدة",
    },
    "app.compo.cra.form.normalDay": {
      "fr": "Jour normal",
      "en": "Normal Day",
      "ar": "يوم عادي",
    },
    "app.compo.cra.form.overtime": {
      "fr": "Heures sup",
      "en": "Overtime",
      "ar": "وقت إضافي",
    },
    "app.compo.cra.form.comment": {
      "fr": "Commentaire",
      "en": "Comment",
      "ar": "تعليق",
    },
    "app.compo.cra.form.addActivity": {
      "fr": "Ajouter activité",
      "en": "Add Activity",
      "ar": "إضافة نشاط",
    },
    "app.compo.cra.form.addActivities": {
      "fr": "Ajouter activités",
      "en": "Add Activities",
      "ar": "إضافة أنشطة",
    },
    "app.compo.cra.form.alreadyValidatedReadonly": {
      "fr": "CRA déjà validé. Modification impossible.",
      "en": "CRA already validated. You cannot modify it.",
      "ar": "تم اعتماد CRA بالفعل. لا يمكن تعديله.",
    },
    "app.compo.cra.form.activity.invalidForDate": {
      "fr": "Impossible d'ajouter l'activité \"{{name}}\" à cette date.\nElle est valide uniquement du {{deb}} au {{fin}}.",
      "en": "Cannot add activity \"{{name}}\" on this date.\nIt is valid only from {{deb}} to {{fin}}.",
      "ar": "لا يمكن إضافة النشاط \"{{name}}\" في هذا التاريخ.\nهو صالح فقط من {{deb}} إلى {{fin}}.",
    },
    "app.compo.cra.form.activity.skippedOutOfRange": {
      "fr": "{{count}} jour(s) ignoré(s) : l'activité \"{{name}}\" est valide uniquement du {{deb}} au {{fin}}.",
      "en": "{{count}} day(s) skipped: activity \"{{name}}\" is valid only from {{deb}} to {{fin}}.",
      "ar": "تم تجاهل {{count}} يوم(أيام): النشاط \"{{name}}\" صالح فقط من {{deb}} إلى {{fin}}.",
    },
    "app.compo.cra.form.validation.congeTypeOnly": {
      "fr": "Veuillez vérifier vos congés. Tous les jours doivent être de type congé.",
      "en": "Please check your leave entries. All days must be leave type.",
      "ar": "يرجى التحقق من الإجازات. يجب أن تكون كل الأيام من نوع إجازة.",
    },
    "app.compo.cra.form.validation.noPastConge": {
      "fr": "Veuillez vérifier vos congés. Impossible de saisir un congé dans le passé.",
      "en": "Please check your leave entries. You cannot add leave in the past.",
      "ar": "يرجى التحقق من الإجازات. لا يمكن إدخال إجازة في الماضي.",
    },
    "app.compo.cra.form.validation.atLeastOneConge": {
      "fr": "Vous devez saisir au moins un congé.",
      "en": "You must enter at least one leave day.",
      "ar": "يجب إدخال يوم إجازة واحد على الأقل.",
    },
    "app.compo.cra.form.validation.congeValidSubmit": {
      "fr": "Votre demande de congé est valide.\nVous pouvez la soumettre à votre manager.",
      "en": "Your leave request is valid.\nYou can submit it to your manager.",
      "ar": "طلب الإجازة صالح.\nيمكنك إرساله إلى المدير.",
    },
    "app.compo.cra.form.validation.dayMustEqualOne": {
      "fr": "Veuillez vérifier votre CRA. Chaque jour travaillé doit totaliser 1.",
      "en": "Please check your CRA. Each worked day must total 1.",
      "ar": "يرجى التحقق من CRA. يجب أن يكون مجموع كل يوم عمل 1.",
    },
    "app.compo.cra.form.validation.craValidSubmit": {
      "fr": "Votre CRA est valide.\nVous pouvez le soumettre à votre manager.",
      "en": "Your CRA is valid.\nYou can submit it to your manager.",
      "ar": "CRA صالح.\nيمكنك إرساله إلى المدير.",
    },
    "app.compo.cra.form.confirmValidate": {
      "fr": "Voulez-vous valider le {{name}} ?",
      "en": "Do you want to validate {{name}}?",
      "ar": "هل تريد اعتماد {{name}}؟",
    },
    "app.compo.cra.form.confirmSubmit": {
      "fr": "Voulez-vous soumettre le {{name}} ?\nUne fois soumis, impossible de le modifier.",
      "en": "Do you want to submit {{name}}?\nOnce submitted, it cannot be modified.",
      "ar": "هل تريد إرسال {{name}}؟\nبعد الإرسال، لا يمكن تعديله.",
    },
    "app.compo.cra.form.currentUserNull": {
      "fr": "Utilisateur courant introuvable.",
      "en": "Current user is null.",
      "ar": "المستخدم الحالي غير موجود.",
    },
    "app.compo.cra.form.confirmDeleteAllEvents": {
      "fr": "Voulez-vous vraiment supprimer tous les {{count}} événements ?",
      "en": "Do you really want to delete all {{count}} events?",
      "ar": "هل تريد فعلاً حذف كل الأحداث وعددها {{count}}؟",
    },
    "app.compo.cra.form.noEventToDelete": {
      "fr": "Aucun événement à effacer !",
      "en": "No event to delete!",
      "ar": "لا توجد أحداث للحذف!",
    },
    "app.compo.cra.form.pdfClient.craNotFound": {
      "fr": "CRA introuvable. Impossible de générer le PDF client.",
      "en": "CRA not found. Cannot generate client PDF.",
      "ar": "لم يتم العثور على CRA. تعذر إنشاء PDF للعميل.",
    },
    "app.compo.cra.form.pdfClient.userNotFound": {
      "fr": "Consultant introuvable. Impossible de générer le PDF client.",
      "en": "Consultant not found. Cannot generate client PDF.",
      "ar": "لم يتم العثور على المستشار. تعذر إنشاء PDF للعميل.",
    },
    "app.compo.cra.form.pdfClient.noClientFound": {
      "fr": "Aucun client trouvé pour ce CRA.",
      "en": "No client found for this CRA.",
      "ar": "لم يتم العثور على عميل لهذا CRA.",
    },
    "app.compo.cra.form.attachment.invalidFormat": {
      "fr": "Seuls les fichiers [pdf,png,jpg] sont acceptés.",
      "en": "Only [pdf,png,jpg] files are accepted.",
      "ar": "يتم قبول ملفات [pdf,png,jpg] فقط.",
    },
    "app.compo.cra.form.listReportsPdf": {
      "fr": "LISTE RAPPORTS PDF ACTIVITÉS",
      "en": "LIST REPORTS PDF ACTIVITIES",
      "ar": "قائمة تقارير PDF الأنشطة",
    },
    "app.compo.cra.form.numberDayWorked": {
      "fr": "Nombre Jours Travaillés",
      "en": "Number Day Worked",
      "ar": "عدد أيام العمل",
    },
    "app.compo.cra.form.download": {
      "fr": "TÉLÉCHARGER",
      "en": "DOWNLOAD",
      "ar": "تحميل",
    },
    "app.compo.cra.form.weekEnd": {
      "fr": "WE",
      "en": "WEEK",
      "ar": "نهاية الأسبوع",
    },
    "app.compo.cra.form.activitiesOfDay": {
      "fr": "Activités du jour",
      "en": "Activities of day",
      "ar": "أنشطة اليوم",
    },
    "Activity": {
      "fr": "Activité",
      "en": "Activity",
      "ar": "النشاط",
    },
    "Actions": {
      "fr": "Actions",
      "en": "Actions",
      "ar": "الإجراءات",
    },
    "app.compo.cra.form.chooseDateRange": {
      "fr": "Choix de date début et fin",
      "en": "Choose start and end date",
      "ar": "اختر تاريخ البداية والنهاية",
    },
    "app.compo.cra.form.startDate": {
      "fr": "Choix date début",
      "en": "Choose start date",
      "ar": "اختر تاريخ البداية",
    },
    "app.compo.cra.form.endDate": {
      "fr": "Choix date fin",
      "en": "Choose end date",
      "ar": "اختر تاريخ النهاية",
    },
    "app.compo.cra.form.alertValidation": {
      "fr": "Alerte validation",
      "en": "Alert validation",
      "ar": "تنبيه التحقق",
    },
    "app.compo.cra.form.rejectedByManager": {
      "fr": "a été rejeté par le manager. Vous pouvez voir le commentaire ci-dessus.",
      "en": "has been rejected by the manager. You can see above the comment.",
      "ar": "تم رفضه من قبل المدير. يمكنك رؤية التعليق أعلاه.",
    },
    "app.compo.cra.form.notInCurrentMonth": {
      "fr": "On ne peut pas saisir en dehors du mois courant :",
      "en": "Cannot enter outside current month:",
      "ar": "لا يمكن الإدخال خارج الشهر الحالي:",
    },
    "app.compo.adminDoc.form.docCategories": {
      "fr": "Document Catégories :",
      "en": "Document Categories:",
      "ar": "فئات الوثيقة:",
    },
    "app.compo.adminDoc.form.chooseCategory": {
      "fr": "Choisir une catégorie",
      "en": "Choose a category",
      "ar": "اختر فئة",
    },
    "app.compo.adminDoc.form.selectCategory": {
      "fr": "Sélectionner une catégorie",
      "en": "Select a category",
      "ar": "اختر فئة",
    },
    "app.compo.adminDoc.form.specifyCategory": {
      "fr": "Préciser la catégorie :",
      "en": "Specify the category:",
      "ar": "حدد الفئة:",
    },
    "app.compo.adminDoc.form.enterCategoryName": {
      "fr": "Entrez le nom du catégorie",
      "en": "Enter category name",
      "ar": "أدخل اسم الفئة",
    },
    "app.compo.adminDoc.form.consultantLabel": {
      "fr": "Consultant :",
      "en": "Consultant:",
      "ar": "المستشار:",
    },
    "app.compo.adminDoc.form.selectConsultant": {
      "fr": "Sélectionner un consultant",
      "en": "Select a consultant",
      "ar": "اختر مستشاراً",
    },
    "app.compo.adminDoc.form.chooseConsultant": {
      "fr": "Choisir un consultant",
      "en": "Choose a consultant",
      "ar": "اختر مستشاراً",
    },
    "app.compo.adminDoc.form.categoryNamePlaceholder": {
      "fr": "Nom de la catégorie",
      "en": "Category name",
      "ar": "اسم الفئة",
    },
    "app.compo.adminDoc.form.titlePlaceholder": {
      "fr": "Titre du document",
      "en": "Document title",
      "ar": "عنوان المستند",
    },
    "app.compo.adminDoc.form.expirationDatePlaceholder": {
      "fr": "Date d'expiration",
      "en": "Expiration date",
      "ar": "تاريخ انتهاء الصلاحية",
    },
    "app.compo.adminDoc.form.shareWith": {
      "fr": "Partager avec :",
      "en": "Share with:",
      "ar": "شارك مع:",
    },
    "app.compo.adminDoc.form.titleLabel": {
      "fr": "Titre :",
      "en": "Title:",
      "ar": "العنوان:",
    },
    "app.compo.adminDoc.form.enterTitle": {
      "fr": "Entrez le titre du document",
      "en": "Enter document title",
      "ar": "أدخل عنوان الوثيقة",
    },
    "app.compo.adminDoc.form.expirationDate": {
      "fr": "Date d'expiration :",
      "en": "Expiration date:",
      "ar": "تاريخ الانتهاء:",
    },
    "app.compo.adminDoc.form.chooseFile": {
      "fr": "Choisissez un fichier",
      "en": "Choose a file",
      "ar": "اختر ملفاً",
    },
    "app.compo.adminDoc.form.allFilesSelected": {
      "fr": "Tous les fichiers sélectionnés",
      "en": "All selected files",
      "ar": "جميع الملفات المحددة",
    },
    "app.compo.adminDoc.multiple.checkData": {
      "fr": "Vérifiez vos données",
      "en": "Check your data",
      "ar": "تحقق من بياناتك",
    },
    "app.compo.adminDoc.multiple.chooseConsultantFile": {
      "fr": "Veuillez choisir un consultant et un fichier",
      "en": "Please choose a consultant and a file",
      "ar": "يرجى اختيار مستشار وملف",
    },
    "app.compo.activityType.list.esnLabel": {
      "fr": "Esn :",
      "en": "Esn:",
      "ar": "المؤسسة:",
    },
    "app.compo.cra.addMultiDate.activityLabel": {
      "fr": "Activité",
      "en": "Activity",
      "ar": "النشاط",
    },
    "app.compo.cra.addMultiDate.timeLabel": {
      "fr": "Durée",
      "en": "Time",
      "ar": "المدة",
    },
    "app.compo.cra.addMultiDate.startDate": {
      "fr": "Date début",
      "en": "Start date",
      "ar": "تاريخ البداية",
    },
    "app.compo.cra.addMultiDate.endDate": {
      "fr": "Date fin",
      "en": "End date",
      "ar": "تاريخ النهاية",
    },
    "app.compo.cra.addMultiDate.activityRequired": {
      "fr": "L'activité est requise",
      "en": "Activity is required",
      "ar": "النشاط مطلوب",
    },
    "app.compo.cra.addMultiDate.timeRequired": {
      "fr": "La durée est requise",
      "en": "Time is required",
      "ar": "المدة مطلوبة",
    },
    "app.compo.cra.addMultiDate.startDateRequired": {
      "fr": "La date de début est requise",
      "en": "Start date is required",
      "ar": "تاريخ البداية مطلوب",
    },
    "app.compo.cra.addMultiDate.endDateRequired": {
      "fr": "La date de fin est requise",
      "en": "End date is required",
      "ar": "تاريخ النهاية مطلوب",
    },
    "app.compo.cra.addMultiDate.error.endDateBeforeStart": {
      "fr": "La date de fin doit etre superieure ou egale a la date de debut",
      "en": "End date must be greater than or equal to start date",
      "ar": "يجب أن يكون تاريخ النهاية أكبر من أو يساوي تاريخ البداية",
    },
    "app.compo.cra.addMultiDate.error.outOfInterval": {
      "fr": "Cette date est hors de l'intervalle de l'activite selectionnee",
      "en": "This date is outside the selected activity interval",
      "ar": "هذا التاريخ خارج نطاق النشاط المحدد",
    },
    "app.compo.cra.list.confirmDelete": {
      "fr": "Voulez-vous vraiment supprimer la ligne avec id=",
      "en": "Do you really want to delete the row with id=",
      "ar": "هل تريد حقا حذف السطر ذي المعرف=",
    },
    "app.common.confirm.deleteConsultantByUsername": {
      "fr": "Voulez-vous vraiment supprimer le consultant {{username}}",
      "en": "Do you really want to delete consultant {{username}}",
      "ar": "هل تريد فعلا حذف المستشار {{username}}",
    },
    "app.common.confirm.deleteConsultantByFullName": {
      "fr": "Voulez-vous vraiment supprimer le consultant : {{fullName}}",
      "en": "Do you really want to delete consultant: {{fullName}}",
      "ar": "هل تريد فعلا حذف المستشار: {{fullName}}",
    },
    "app.common.confirm.deleteCraByLabel": {
      "fr": "Voulez-vous vraiment supprimer le CRA {{label}}",
      "en": "Do you really want to delete CRA {{label}}",
      "ar": "هل تريد فعلا حذف CRA {{label}}",
    },
    "app.common.confirm.deleteActivityByName": {
      "fr": "Voulez-vous vraiment supprimer l'activité {{name}}",
      "en": "Do you really want to delete activity {{name}}",
      "ar": "هل تريد فعلا حذف النشاط {{name}}",
    },
    "app.common.confirm.deleteActivityTypeByName": {
      "fr": "Voulez-vous vraiment supprimer le type d'activité {{name}}",
      "en": "Do you really want to delete activity type {{name}}",
      "ar": "هل تريد فعلا حذف نوع النشاط {{name}}",
    },
    "app.common.confirm.deleteEsnByName": {
      "fr": "Voulez-vous vraiment supprimer l'ESN {{name}}",
      "en": "Do you really want to delete ESN {{name}}",
      "ar": "هل تريد فعلا حذف المؤسسة {{name}}",
    },
    "app.common.confirm.deleteClientByName": {
      "fr": "Voulez-vous vraiment supprimer le client {{name}}",
      "en": "Do you really want to delete client {{name}}",
      "ar": "هل تريد فعلا حذف العميل {{name}}",
    },
    "app.common.confirm.deleteProjectByName": {
      "fr": "Voulez-vous vraiment supprimer le projet {{name}}",
      "en": "Do you really want to delete project {{name}}",
      "ar": "هل تريد فعلا حذف المشروع {{name}}",
    },
    "app.common.confirm.deleteByDate": {
      "fr": "Voulez-vous vraiment supprimer la ligne avec date=",
      "en": "Do you really want to delete the row with date=",
      "ar": "هل تريد فعلا حذف السطر بالتاريخ=",
    },
    "app.common.confirm.deleteAllNotifications": {
      "fr": "Voulez-vous vraiment supprimer toutes les notifications",
      "en": "Do you really want to delete all notifications",
      "ar": "هل تريد فعلا حذف كل الإشعارات",
    },
    "app.common.confirm.deleteFileByName": {
      "fr": "Voulez-vous vraiment supprimer le fichier : {{name}}",
      "en": "Do you really want to delete file: {{name}}",
      "ar": "هل تريد فعلا حذف الملف: {{name}}",
    },
    "app.common.error.invalidFileFormatPdfPngJpg": {
      "fr": "Format de fichier erroné, seuls les fichiers Pdf/png/jpg sont acceptés.",
      "en": "Invalid file format, only Pdf/png/jpg files are accepted.",
      "ar": "تنسيق ملف غير صالح، الملفات المقبولة فقط هي Pdf/png/jpg.",
    },
    "app.compo.cra.app.listCra": {
      "fr": "Liste CRA",
      "en": "List CRA",
      "ar": "قائمة تقارير النشاط",
    },
    "app.compo.cra.app.addCra": {
      "fr": "Ajouter CRA",
      "en": "Add CRA",
      "ar": "إضافة تقرير نشاط",
    },
    "app.compo.esn.app.listEsn": {
      "fr": "Liste ESN",
      "en": "List ESN",
      "ar": "قائمة المؤسسات",
    },
    "app.compo.esn.app.addEsn": {
      "fr": "Ajouter ESN",
      "en": "Add ESN",
      "ar": "إضافة مؤسسة",
    },
    "app.compo.client.app.listClient": {
      "fr": "Liste Clients",
      "en": "List Clients",
      "ar": "قائمة العملاء",
    },
    "app.compo.client.app.addClient": {
      "fr": "Ajouter Client",
      "en": "Add Client",
      "ar": "إضافة عميل",
    },
    "app.compo.consultant.app.listConsultant": {
      "fr": "Liste Consultants",
      "en": "List Consultants",
      "ar": "قائمة المستشارين",
    },
    "app.compo.consultant.app.addConsultant": {
      "fr": "Ajouter Consultant",
      "en": "Add Consultant",
      "ar": "إضافة مستشار",
    },
    "app.compo.project.app.listProject": {
      "fr": "Liste Projets",
      "en": "List Projects",
      "ar": "قائمة المشاريع",
    },
    "app.compo.project.app.addProject": {
      "fr": "Ajouter Projet",
      "en": "Add Project",
      "ar": "إضافة مشروع",
    },
    "app.compo.msg.app.listMsg": {
      "fr": "Liste Messages",
      "en": "List Messages",
      "ar": "قائمة الرسائل",
    },
    "app.compo.msg.app.addMsg": {
      "fr": "Ajouter Message",
      "en": "Add Message",
      "ar": "إضافة رسالة",
    },
    "app.compo.msgHisto.app.listMsgHisto": {
      "fr": "Liste Historique Messages",
      "en": "List Message History",
      "ar": "قائمة سجل الرسائل",
    },
    "app.compo.msgHisto.app.addMsgHisto": {
      "fr": "Ajouter Historique",
      "en": "Add History",
      "ar": "إضافة سجل",
    },
    "app.compo.msg.form.msgRequired": {
      "fr": "Le message est requis",
      "en": "Msg is required",
      "ar": "الرسالة مطلوبة",
    },
    "app.compo.msg.form.type": {
      "fr": "Type",
      "en": "Type",
      "ar": "النوع",
    },
    "app.compo.msg.form.typeId": {
      "fr": "TypeId",
      "en": "TypeId",
      "ar": "معرف النوع",
    },
    "app.compo.msg.form.from": {
      "fr": "De",
      "en": "From",
      "ar": "من",
    },
    "app.compo.msg.form.fromRequired": {
      "fr": "De est requis",
      "en": "From is required",
      "ar": "المرسل مطلوب",
    },
    "app.compo.msg.form.toRequired": {
      "fr": "Destinataire requis",
      "en": "To is required",
      "ar": "المستلم مطلوب",
    },
    "app.compo.msg.form.to": {
      "fr": "À",
      "en": "To",
      "ar": "إلى",
    },
    "app.compo.msg.form.listMsgs": {
      "fr": "Liste Messages",
      "en": "List msgs",
      "ar": "قائمة الرسائل",
    },
    "app.compo.profile.birthDay": {
      "fr": "Date de naissance",
      "en": "Birth date",
      "ar": "تاريخ الميلاد",
    },
    "app.compo.profile.chooseDate": {
      "fr": "Choix de date",
      "en": "Choose date",
      "ar": "اختر التاريخ",
    },
    "app.compo.msg.list.addMsg": {
      "fr": "Ajouter Message",
      "en": "Add Msg",
      "ar": "إضافة رسالة",
    },
    "app.compo.userConnected.enterSamePassword": {
      "fr": "Entrez le même mot de passe",
      "en": "Enter same password",
      "ar": "أدخل نفس كلمة المرور",
    },
    "app.compo.userConnected.passwordCriteria": {
      "fr": "Le mot de passe est requis et doit respecter tous les critères",
      "en": "Password is required and must meet all criteria",
      "ar": "كلمة المرور مطلوبة ويجب أن تستوفي كل المعايير",
    },
    "app.compo.msgHisto.form.listMsgHistos": {
      "fr": "Liste Historique Messages",
      "en": "List msgHistos",
      "ar": "قائمة سجل الرسائل",
    },
    "app.compo.validEmail.newPasswordPlaceholder": {
      "fr": "Entrez votre nouveau mot de passe",
      "en": "Enter your new password",
      "ar": "أدخل كلمة المرور الجديدة",
    },
    "app.compo.validEmail.confirmPasswordPlaceholder": {
      "fr": "Confirmez votre nouveau mot de passe",
      "en": "Confirm your new password",
      "ar": "أكد كلمة المرور الجديدة",
    },
    "app.compo.validEmail.passwordMismatch": {
      "fr": "Les mots de passe ne correspondent pas",
      "en": "Passwords do not match",
      "ar": "كلمتا المرور غير متطابقتين",
    },
    "app.compo.msgHisto.list.addMsgHisto": {
      "fr": "Ajouter Historique",
      "en": "Add MsgHisto",
      "ar": "إضافة سجل",
    },
    "app.compo.payementMode.form.input.name": {
      "fr": "Mode de paiement",
      "en": "Payment mode",
      "ar": "طريقة الدفع",
    },
    "app.compo.notefrais.form.chooseFile": {
      "fr": "Choix du fichier (.jpg, .png, .pdf) :",
      "en": "Choose file (.jpg, .png, .pdf):",
      "ar": "اختر ملفاً (.jpg, .png, .pdf):",
    },
    "app.compo.profile.title": {
      "fr": "Gérer les paramètres du compte",
      "en": "Manage account settings",
      "ar": "إدارة إعدادات الحساب",
    },
    "app.compo.profile.firstName": {
      "fr": "Prénom",
      "en": "First Name",
      "ar": "الاسم الأول",
    },
    "app.compo.profile.firstNameRequired": {
      "fr": "Le prénom est requis",
      "en": "firstName is required",
      "ar": "الاسم الأول مطلوب",
    },
    "app.compo.profile.lastName": {
      "fr": "Nom",
      "en": "Last Name",
      "ar": "اسم العائلة",
    },
    "app.compo.profile.lastNameRequired": {
      "fr": "Le nom est requis",
      "en": "lastName is required",
      "ar": "اسم العائلة مطلوب",
    },
    "app.compo.profile.telRequired": {
      "fr": "Le téléphone est requis",
      "en": "Tel is required",
      "ar": "رقم الهاتف مطلوب",
    },
    "app.compo.profile.emailRequired": {
      "fr": "L'email est requis",
      "en": "Email is required",
      "ar": "البريد الإلكتروني مطلوب",
    },
    "app.compo.profile.street": {
      "fr": "Rue",
      "en": "Street",
      "ar": "الشارع",
    },
    "app.compo.profile.streetRequired": {
      "fr": "La rue est requise",
      "en": "Street is required",
      "ar": "الشارع مطلوب",
    },
    "app.compo.profile.zipCode": {
      "fr": "Code postal",
      "en": "ZipCode",
      "ar": "الرمز البريدي",
    },
    "app.compo.profile.zipCodeRequired": {
      "fr": "Le code postal est requis",
      "en": "ZipCode is required",
      "ar": "الرمز البريدي مطلوب",
    },
    "app.compo.profile.city": {
      "fr": "Ville",
      "en": "City",
      "ar": "المدينة",
    },
    "app.compo.profile.country": {
      "fr": "Pays",
      "en": "Country",
      "ar": "الدولة",
    },
    "app.compo.profile.countryRequired": {
      "fr": "Le pays est requis",
      "en": "Country is required",
      "ar": "الدولة مطلوبة",
    },
    "app.compo.profile.username": {
      "fr": "Nom d'utilisateur",
      "en": "Username",
      "ar": "اسم المستخدم",
    },
    "app.compo.project.form.team": {
      "fr": "Équipe",
      "en": "Team",
      "ar": "الفريق",
    },
    "app.compo.project.form.projectRequired": {
      "fr": "Le projet est requis",
      "en": "Project is required",
      "ar": "المشروع مطلوب",
    },
    "app.compo.inscription.esnSaved": {
      "fr": "ESN sauvegardée :",
      "en": "Esn Saved:",
      "ar": "تم حفظ المؤسسة:",
    },
    "app.compo.inscription.respSaved": {
      "fr": "Resp ESN sauvegardé :",
      "en": "Resp Esn Saved:",
      "ar": "تم حفظ المسؤول:",
    },
    "app.compo.inscription.responsibleEsn": {
      "fr": "Responsable ESN",
      "en": "ESN Manager",
      "ar": "مسؤول المؤسسة",
    },
    "app.compo.inscription.dialogTitle": {
      "fr": "Inscription ESN & Responsable",
      "en": "ESN & Manager Registration",
      "ar": "تسجيل المؤسسة والمسؤول",
    },
    "app.compo.signup.validate": {
      "fr": "Valider",
      "en": "Validate",
      "ar": "تحقق",
    },
    "app.compo.permission.title": {
      "fr": "Gérer les Permissions",
      "en": "Manage Permissions",
      "ar": "إدارة الصلاحيات",
    },
    "app.compo.permission.roleLabel": {
      "fr": "Rôle :",
      "en": "Role:",
      "ar": "الدور:",
    },
    "app.compo.permission.feature": {
      "fr": "Fonctionnalité",
      "en": "Feature",
      "ar": "الميزة",
    },
    "app.compo.permission.view": {
      "fr": "VOIR",
      "en": "VIEW",
      "ar": "عرض",
    },
    "app.compo.permission.update": {
      "fr": "MODIFIER",
      "en": "UPDATE",
      "ar": "تعديل",
    },
    "app.compo.permission.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
      "ar": "حذف",
    },
    "app.compo.permission.checkAll": {
      "fr": "TOUT COCHER",
      "en": "CHECK ALL",
      "ar": "تحديد الكل",
    },
    "app.compo.userConnected.managerLabel": {
      "fr": "Manager :",
      "en": "Manager:",
      "ar": "المدير:",
    },
    "app.compo.userConnected.logOut": {
      "fr": "Déconnexion",
      "en": "Log out",
      "ar": "تسجيل الخروج",
    },
    "app.compo.userConnected.logIn": {
      "fr": "Connexion",
      "en": "Log in",
      "ar": "تسجيل الدخول",
    },
    "app.compo.userConnected.changePassword": {
      "fr": "Changer le mot de passe :",
      "en": "Change password:",
      "ar": "تغيير كلمة المرور:",
    },
    "app.compo.userConnected.manageAccount": {
      "fr": "Gérer votre compte",
      "en": "Manage your account",
      "ar": "إدارة حسابك",
    },
    "app.compo.validEmail.validationTitle": {
      "fr": "Validation de votre email",
      "en": "Email validation",
      "ar": "التحقق من بريدك الإلكتروني",
    },
    "app.compo.validEmail.resetTitle": {
      "fr": "Réinitialisation de votre mot de passe",
      "en": "Password reset",
      "ar": "إعادة تعيين كلمة المرور",
    },
    "app.compo.validEmail.processing": {
      "fr": "Traitement en cours...",
      "en": "Processing...",
      "ar": "جارٍ المعالجة...",
    },
    "app.compo.validEmail.resetPasswordTitle": {
      "fr": "Réinitialisez votre mot de passe",
      "en": "Reset your password",
      "ar": "أعد تعيين كلمة المرور",
    },
    "app.compo.validEmail.emailId": {
      "fr": "Email (identifiant) :",
      "en": "Email (identifier):",
      "ar": "البريد الإلكتروني (المعرف):",
    },
    "app.compo.validEmail.newPassword": {
      "fr": "Nouveau mot de passe :",
      "en": "New password:",
      "ar": "كلمة المرور الجديدة:",
    },
    "app.compo.validEmail.confirmPassword": {
      "fr": "Confirmer le mot de passe :",
      "en": "Confirm password:",
      "ar": "تأكيد كلمة المرور:",
    },
    "app.compo.validEmail.updatePassword": {
      "fr": "Mettre à jour le mot de passe",
      "en": "Update password",
      "ar": "تحديث كلمة المرور",
    },
    "app.compo.validEmail.updating": {
      "fr": "Mise à jour en cours...",
      "en": "Updating...",
      "ar": "جارٍ التحديث...",
    },
    "app.compo.validEmail.signIn": {
      "fr": "Se connecter",
      "en": "Sign In",
      "ar": "تسجيل الدخول",
    },
    "app.compo.validEmail.enterNewPassword": {
      "fr": "Entrer votre nouveau mot de passe",
      "en": "Enter your new password",
      "ar": "أدخل كلمة المرور الجديدة",
    },
    "app.compo.validEmail.passwordsMatch": {
      "fr": "✅ Les mots de passe correspondent et sont valides",
      "en": "✅ Passwords match and are valid",
      "ar": "✅ كلمات المرور متطابقة وصالحة",
    },
    "app.compo.menu.general": {
      "fr": "Général",
      "en": "General",
      "ar": "عام",
    },
    "app.compo.menu.showTables": {
      "fr": "Afficher les Tables",
      "en": "Show Tables",
      "ar": "عرض الجداول",
    },
    "app.compo.menu.connections": {
      "fr": "Connexions",
      "en": "Connections",
      "ar": "الاتصالات",
    },
    "app.compo.menu.adminLogs": {
      "fr": "Logs Backend",
      "en": "Backend Logs",
      "ar": "سجلات الخلفية",
    },
    "app.compo.menu.addEsnDemo": {
      "fr": "Ajouter ESN démo",
      "en": "Add Esn demo",
      "ar": "إضافة مؤسسة تجريبية",
    },
    "app.compo.menu.confirmAddEsnDemo": {
      "fr": "Voulez-vous vraiment ajouter une ESN Demo",
      "en": "Do you really want to add a Demo ESN",
      "ar": "هل تريد فعلا إضافة مؤسسة تجريبية",
    },
    "app.compo.menu.addEsnDemoSuccess": {
      "fr": "L'ESN Demo a bien été ajoutée",
      "en": "Demo ESN has been added successfully",
      "ar": "تمت إضافة المؤسسة التجريبية بنجاح",
    },
    "app.compo.menu.setDefaultPermissions": {
      "fr": "Définir permissions par défaut",
      "en": "Set default permissions",
      "ar": "تعيين الصلاحيات الافتراضية",
    },
    "app.compo.menu.adminDoc": {
      "fr": "Document Administratif",
      "en": "Administrative Document",
      "ar": "وثيقة إدارية",
    },
    "app.compo.menu.categoryDocument": {
      "fr": "Catégorie Document",
      "en": "Category Document",
      "ar": "فئة الوثيقة",
    },
    "app.compo.menu.addDocument": {
      "fr": "Ajouter Document",
      "en": "Add Document",
      "ar": "إضافة وثيقة",
    },
    "app.compo.menu.multipleDocuments": {
      "fr": "Documents Multiples",
      "en": "Multiple Documents",
      "ar": "وثائق متعددة",
    },
    "app.compo.menu.documentList": {
      "fr": "Liste Documents",
      "en": "Document List",
      "ar": "قائمة الوثائق",
    },
    "app.compo.menu.documentPermission": {
      "fr": "Permission Document",
      "en": "Document Permission",
      "ar": "صلاحية الوثيقة",
    },
    "app.compo.login.emailLabel": {
      "fr": "Email :",
      "en": "Email:",
      "ar": "البريد الإلكتروني:",
    },
    "app.compo.client.form.address": {
      "fr": "Adresse",
      "en": "Address",
      "ar": "العنوان",
    },
    "app.compo.consultant.form.birthdayRequired": {
      "fr": "La date de naissance est requise",
      "en": "Birthday is required",
      "ar": "تاريخ الميلاد مطلوب",
    },
    "app.compo.notefrais.perConsultant.consultantLabel": {
      "fr": "Consultant :",
      "en": "Consultant:",
      "ar": "المستشار:",
    },
    "app.compo.notefrais.perConsultant.chooseConsultant": {
      "fr": "Choisir un consultant...",
      "en": "Choose a consultant...",
      "ar": "اختر مستشارا...",
    },
    "app.compo.utils.relations.back": {
      "fr": "Retour",
      "en": "Back",
      "ar": "رجوع",
    },
    "app.compo.utils.relations.fkPk": {
      "fr": "FK → PK",
      "en": "FK → PK",
      "ar": "FK → PK",
    },
    "app.compo.utils.tableViewer.getAllTables": {
      "fr": "Obtenir tous les noms de tables",
      "en": "Get All Table Names",
      "ar": "الحصول على جميع أسماء الجداول",
    },
    "app.compo.utils.tableViewer.exportAllToJson": {
      "fr": "Exporter toutes les tables en JSON",
      "en": "Export All Tables To Json",
      "ar": "تصدير جميع الجداول إلى JSON",
    },
    "app.compo.utils.tableViewer.importFromJson": {
      "fr": "Importer depuis JSON vers la table sélectionnée",
      "en": "Import From Json To Selected Table",
      "ar": "الاستيراد من JSON إلى الجدول المحدد",
    },
    "app.compo.utils.tableViewer.runBatchCra": {
      "fr": "Lancer l'export batch CRA manuellement",
      "en": "Run Batch Cra Export Manually",
      "ar": "تشغيل تصدير دفعي CRA يدوياً",
    },
    "app.compo.utils.tableViewer.runBatchConsultant": {
      "fr": "Lancer l'import batch Consultant manuellement",
      "en": "Run Batch Consultant Import Manually",
      "ar": "تشغيل استيراد دفعي للمستشارين يدوياً",
    },
    "app.compo.utils.tableViewer.addTableLike": {
      "fr": "Ajouter table similaire",
      "en": "Add Table Like",
      "ar": "إضافة جدول مماثل",
    },
    "app.compo.utils.tableViewer.updateSelectedRow": {
      "fr": "Mettre à jour la ligne sélectionnée",
      "en": "Update Selected Row",
      "ar": "تحديث الصف المحدد",
    },
    "app.compo.utils.tableViewer.insertLikeSelected": {
      "fr": "Insérer comme sélection",
      "en": "Insert Like Selected",
      "ar": "إدراج مماثل للمحدد",
    },
    "app.compo.utils.tableViewer.insertEmptyRow": {
      "fr": "Insérer ligne vide",
      "en": "Insert Empty Row",
      "ar": "إدراج صف فارغ",
    },
    "app.compo.utils.tableViewer.deleteTable": {
      "fr": "Supprimer la table",
      "en": "Delete Table",
      "ar": "حذف الجدول",
    },
    "app.compo.utils.tableViewer.deleteRow": {
      "fr": "Supprimer la ligne",
      "en": "Delete Selected Row",
      "ar": "حذف الصف المحدد",
    },
    "app.compo.utils.tableViewer.colonne": {
      "fr": "Colonne",
      "en": "Column",
      "ar": "العمود",
    },
    "app.compo.utils.tableViewer.executeSQL": {
      "fr": "Exécuter SQL",
      "en": "Execute SQL",
      "ar": "تنفيذ SQL",
    },
    "app.compo.utils.tableViewer.result": {
      "fr": "Résultat :",
      "en": "Result:",
      "ar": "النتيجة:",
    },
    "app.compo.utils.tableViewer.tab.data": {
      "fr": "Données",
      "en": "Data",
      "ar": "البيانات",
    },
    "app.compo.utils.tableViewer.tab.relations": {
      "fr": "Relations",
      "en": "Relations",
      "ar": "العلاقات",
    },
    "app.compo.utils.tableViewer.tab.structure": {
      "fr": "Structure",
      "en": "Structure",
      "ar": "الهيكل",
    },
    "app.compo.utils.tableViewer.tab.sql": {
      "fr": "SQL",
      "en": "SQL",
      "ar": "SQL",
    },
    "app.compo.utils.relations.fit": {
      "fr": "🔍 Ajuster",
      "en": "🔍 Fit",
      "ar": "🔍 ملاءمة",
    },
    "app.compo.utils.relations.table": {
      "fr": "Table",
      "en": "Table",
      "ar": "جدول",
    },
    "app.compo.datePicker.dateRange": {
      "fr": "Plage de dates",
      "en": "Date Range",
      "ar": "نطاق التاريخ",
    },
    "app.compo.datePicker.chooseDateRange": {
      "fr": "Choix de date début et fin",
      "en": "Choose start and end date",
      "ar": "اختر تاريخ البداية والنهاية",
    },
    "app.compo.datePicker.invalidStartDate": {
      "fr": "Date de début invalide",
      "en": "Invalid start date",
      "ar": "تاريخ البداية غير صالح",
    },
    "app.compo.datePicker.invalidEndDate": {
      "fr": "Date de fin invalide",
      "en": "Invalid end date",
      "ar": "تاريخ النهاية غير صالح",
    },
    "app.compo.uploadFile.error.todo": {
      "fr": "Erreur détectée",
      "en": "Error detected",
      "ar": "تم اكتشاف خطأ",
    },
    "app.compo.uploadFile.error.doneFixLob": {
      "fr": "Correctif appliqué : type de fichier modifié en TEXT avec @Lob au lieu de LONGTEXT (classe back-end)",
      "en": "Fix applied: file type changed to TEXT with @Lob instead of LONGTEXT (back-end class)",
      "ar": "تم تطبيق الإصلاح: تم تغيير نوع الملف إلى TEXT مع @Lob بدلاً من LONGTEXT (فئة الواجهة الخلفية)",
    },
    "app.compo.uploadFile.table.sizeOctets": {
      "fr": "Taille (octets)",
      "en": "Size (bytes)",
      "ar": "الحجم (بايت)",
    },
    "app.compo.uploadFile.table.date": {
      "fr": "Date",
      "en": "Date",
      "ar": "التاريخ",
    },
    "app.compo.uploadFile.table.image": {
      "fr": "Image",
      "en": "Image",
      "ar": "صورة",
    },
    "app.compo.uploadFile.imagePreviewAlt": {
      "fr": "Aperçu de l'image",
      "en": "Image preview",
      "ar": "معاينة الصورة",
    },
    "app.compo.cra.config.weekLabel": {
      "fr": "SEMAINE",
      "en": "WEEK",
      "ar": "أسبوع",
    },
    "app.footer.esnName": {
      "fr": "Eisi Consulting",
      "en": "Eisi Consulting",
      "ar": "Eisi Consulting - إيزي كنسيلتيكنج",
    },
  }
}
