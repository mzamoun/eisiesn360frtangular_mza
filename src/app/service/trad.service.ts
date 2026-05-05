import { LoggerService } from './logger.service';



import { Injectable } from '@angular/core';

const lang0 = "fr";  //default lang"

@Injectable({
  providedIn: 'root'
})
export class TradService {

  constructor(private logger: LoggerService, ) {
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
    },
    "Add": {
      fr: "Ajouter",
      en: "Add",
    },

    "Save": {
      fr: "Enregistrer",
      en: "Save",
    },

    "List": {
      fr: "Liste",
      en: "List",
    },

    "New": {
      fr: "Nouveau",
      en: "New",
    },

    "NewFee": {
      fr: "Nouvelle Note frais",
      en: "New Fee",
    },

    "Edit": {
      fr: "Modifier",
      en: "Edit",
    },

    "Download": {
      fr: "T\u00e9l\u00e9charger",
      en: "Download",
    },

    "Accept": {
      fr: "Accepter",
      en: "Accept",
    },

    "Reject": {
      fr: "Rejeter",
      en: "Reject",
    },

    "Pay": {
      fr: "Payer",
      en: "Pay",
    },

    "Delete": {
      fr: "Supprimer",
      en: "Delete",
    },


    "Search": {
      fr: "Chercher",
      en: "Search",
    },

    "User": {
      fr: "Utlisateur",
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
    },
    "EditActivityType": {
      fr: "Modifier activiti\u00e9 type",
      en: "Edit Activity Type",
    },

    "NewActivity": {
      fr: "Nouvelle activiti\u00e9",
      en: "New Activity",
    },

    "EditActivity": {
      fr: "Modifier activity",
      en: "Edit Activity"
    },

    "ListActivites": {
      "fr": "Liste d'activites",
      "en": "List Activity"
    },

    "ListActivitesType": {
      "fr": "Liste d'activites type",
      "en": "List Activity Type"
    },

    "NewClient": {
      "fr": "Nouveau Client",
      "en": "New Client"
    },
    "EditClient": {
      "fr": "Modifier Client",
      "en": "Edit Client"
    },



    "Entitled": { fr: "Intitul\u00e9", en: "Entitled" },
    "ListAbsence": { "fr": "Liste absences", "en": "List absence" },

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
    },

    /////////////////////

    "main.menu.navbar.navitem.caption.navigation.label": {
      "fr": "Navigation",
      "en": "Navigation",
    },
    "main.menu.navbar.navitem.esn.title": {
      "fr": "Gestion Esn",
      "en": "Esn Management",
    },
    "main.menu.navbar.navitem.client.title": {
      "fr": "Gestion Client",
      "en": "Client Management",
    },
    "main.menu.navbar.navitem.project.title": {
      "fr": "Gestion Project",
      "en": "Project Management",
    },
    "main.menu.navbar.navitem.consultant.title": {
      "fr": "Gestion Consultant",
      "en": "Consultant Management",
    },
    "main.menu.navbar.navitem.activityType.title": {
      "fr": "Gestion Type d'Activit\u00e9",
      "en": "Activity Type Management",
    },
    "main.menu.navbar.navitem.activity.title": {
      "fr": "Gestion {{title}} ",
      "en": "{{title}} Management",
    },
    "main.menu.navbar.navitem.cra.title": {
      "fr": "Gestion Cra",
      "en": "Cra Management",
    },
    "main.menu.navbar.navitem.caption.fee.label": {
      "fr": "Gestion des Frais",
      "en": "Fee Management",
    },
    "main.menu.navbar.navitem.fee.category.title": {
      "fr": "Gestion des Cat\u00e9gories de Frais",
      "en": "Fee Category Management",
    },
    "main.menu.navbar.navitem.fee.note.title": {
      "fr": "Gestion des Notes de Frais",
      "en": "Fee Note Management",
    },
    "main.menu.navbar.navitem.fee.dashboard.title": {
      "fr": "Tableau de board",
      "en": "Dashboard",
    },
    "main.menu.navbar.navitem.caption.setting.label": {
      "fr": "R\u00e8glages",
      "en": "Setting",
    },
    "main.menu.navbar.navitem.setting.permission.title": {
      "fr": "Gestion des Autorisations",
      "en": "Permission Management",
    },
    "main.menu.navbar.navitem.setting.holiday.title": {
      "fr": "Gestion de Vacances",
      "en": "Holiday Management",
    },
    "main.menu.navbar.navitem.setting.user.my-profile": {
      "fr": "Mon Profile",
      "en": "My Profile",
      "ar": "ملفي",
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
    },
    "app.form.input.placeholder.prefix": {
      "fr": "Entrez Votre",
      "en": "Enter your",
    },
    "app.badge.required": {
      "fr": "est obligatoire",
      "en": "is required",
    },
    "app.compo.esn.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.esn.list.table.thead.profession": {
      "fr": "Profession",
      "en": "Profession",
    },
    "app.compo.esn.list.table.thead.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.esn.list.table.thead.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.esn.list.table.thead.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.esn.list.table.thead.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.esn.list.table.thead.webSite": {
      "fr": "Site Web",
      "en": "WebSite",
    },
    "app.compo.esn.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.esn.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.esn.list.table.thead.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
    },
    "app.compo.esn.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.esn.list.table.action.delete": {
      "fr": "Supprimer",
      "en": "Delete",
    },
    "app.compo.esn.list.table.action.edit": {
      "fr": "Modifier",
      "en": "Edit",
    },
    "app.compo.esn.list.table.action.add": {
      "fr": "Ajouter",
      "en": "Add",
    },
    "app.compo.esn.form.input.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.esn.form.input.profession": {
      "fr": "Activites",
      "en": "Activities",
    },
    "app.compo.esn.form.input.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.esn.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.esn.form.input.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.esn.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.esn.form.input.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
    },
    "app.compo.esn.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.esn.form.input.email": {
      "fr": "Email de l'ESN",
      "en": "ESN Email",
    },
    "app.compo.esn.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.client.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.client.list.table.thead.profession": {
      "fr": "Profession",
      "en": "Profession",
    },
    "app.compo.client.list.table.thead.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.client.list.table.thead.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.client.list.table.thead.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.client.list.table.thead.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.client.list.table.thead.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
    },
    "app.compo.client.list.table.thead.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
    },
    "app.compo.client.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.client.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.client.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.client.list.table.action.delete": {
      "fr": "Supprimer",
      "en": "Delete",
    },
    "app.compo.client.list.table.action.add": {
      "fr": "Ajouter",
      "en": "Add",
    },
    "app.compo.client.form.input.name": {
      "fr": "Name",
      "en": "Name",
    },
    "app.compo.client.form.input.profession": {
      "fr": "Profession",
      "en": "Profession",
    },
    "app.compo.client.form.input.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.client.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "Zip Code",
    },
    "app.compo.client.form.input.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.client.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.client.form.input.webSite": {
      "fr": "Site Web",
      "en": "Web Site",
    },
    "app.compo.client.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.client.form.input.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.client.form.input.respName": {
      "fr": "Nom Responsable",
      "en": "Responsible Name",
    },
    "app.compo.client.form.button.list": {
      "fr": "Retour \u00e0 la Liste",
      "en": "Back to list",
    },
    "app.compo.project.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.project.list.table.thead.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.project.list.table.thead.team": {
      "fr": "Equipe",
      "en": "Team",
    },
    "app.compo.project.list.table.thead.method": {
      "fr": "M\u00e9thode",
      "en": "Method",
    },
    "app.compo.project.list.table.thead.client": {
      "fr": "Client",
      "en": "Client",
    },
    "app.compo.project.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.project.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
    },
    "app.compo.project.list.table.action.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.project.form.input.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.project.form.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.project.form.input.teamNumber": {
      "fr": "Nombre d'\u00e9quipe",
      "en": "TeamNumber",
    },
    "app.compo.project.form.input.teamDesc": {
      "fr": "Description de l'\u00e9quipe",
      "en": "TeamDesc",
    },
    "app.compo.project.form.input.method": {
      "fr": "M\u00e9thode",
      "en": "Method",
    },
    "app.compo.project.form.input.environment": {
      "fr": "Environnement",
      "en": "Environment",
    },
    "app.compo.project.form.input.client": {
      "fr": "Client",
      "en": "Client",
    },
    "app.compo.project.form.input.comment": {
      "fr": "Commentaire",
      "en": "Comment",
    },
    "app.compo.project.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.consultant.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.consultant.list.table.thead.username": {
      "fr": "Nom Utilisateur",
      "en": "Username",
    },
    "app.compo.consultant.list.table.thead.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.consultant.list.table.thead.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.consultant.list.table.thead.esn": {
      "fr": "Esn",
      "en": "Esn",
    },
    "app.compo.consultant.list.table.thead.action": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.consultant.list.table.action.edit": {
      "fr": "Editer",
      "en": "edit",
    },
    "app.compo.consultant.list.table.action.delete": {
      "fr": "supprimer",
      "en": "delete",
    },
    "app.compo.consultant.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.consultant.form.input.firstName": {
      "fr": "Pr\u00e9nom",
      "en": "First Name",
    },
    "app.compo.consultant.form.input.lastName": {
      "fr": "Nom",
      "en": "Last Name",
    },
    "app.compo.consultant.form.input.tel": {
      "fr": "Tel",
      "en": "Tel",
    },
    "app.compo.consultant.form.input.email": {
      "fr": "Email",
      "en": "Email",
    },
    "app.compo.consultant.form.input.level": {
      "fr": "Niveau",
      "en": "Level",
    },
    "app.compo.consultant.form.input.birthDay": {
      "fr": "Date de naissance",
      "en": "Birth Day",
    },
    "app.compo.consultant.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.consultant.form.input.city": {
      "fr": "Ville",
      "en": "City",
    },
    "app.compo.consultant.form.input.zipCode": {
      "fr": "Code Postal",
      "en": "ZipCode",
    },
    "app.compo.consultant.form.input.street": {
      "fr": "Rue",
      "en": "Street",
    },
    "app.compo.consultant.form.input.manager": {
      "fr": "Directeur",
      "en": "Manager",
    },
    "app.compo.consultant.form.input.username": {
      "fr": "Nom Utilisateur",
      "en": "Username",
    },
    "app.compo.consultant.form.input.password": {
      "fr": "Mot de passe",
      "en": "Password",
    },
    "app.compo.consultant.form.input.confirmPassword": {
      "fr": "Confirm password",
      "en": "Confirm password",
    },
    "app.compo.consultant.form.input.active": {
      "fr": "Actif",
      "en": "Active",
    },
    "app.compo.consultant.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.activityType.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
      "ar": "الاسم",
    },
    "app.compo.activityType.list.table.thead.isWorkDay": {
      "fr": "jour ouvrable",
      "en": "isWorkDay",
    },
    "app.compo.activityType.list.table.thead.isBillDay": {
      "fr": "jour facturable",
      "en": "isBillDay",
    },
    "app.compo.activityType.list.table.thead.isHolidayDay": {
      "fr": "jour de vacance",
      "en": "isHolidayDay",
    },
    "app.compo.activityType.list.table.thead.isTrainingDay": {
      "fr": "jour de formation",
      "en": "isTrainingDay",
    },
    "app.compo.activityType.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.activityType.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
    },
    "app.compo.activityType.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activityType.form.input.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.activityType.form.input.isWorkDay": {
      "fr": "jour ouvrable",
      "en": "isWorkDay",
    },
    "app.compo.activityType.form.input.isBillDay": {
      "fr": "jour facturable",
      "en": "isBillDay",
    },
    "app.compo.activityType.form.input.isHolidayDay": {
      "fr": "jour de vacance",
      "en": "isHolidayDay",
    },
    "app.compo.activityType.form.input.isTrainingDay": {
      "fr": "jour de formation",
      "en": "isTrainingDay",
    },
    "app.compo.activityType.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.activity.select.consultant.title": {
      "fr": "Les activités du consultant",
      "en": "Consultant Activities",
    },
    "app.compo.activity.list.table.thead.name": {
      "fr": "Nom",
      "en": "Name",
    },
    "app.compo.activity.list.table.thead.type": {
      "fr": "Type",
      "en": "Type",
    },
    "app.compo.activity.list.table.thead.project": {
      "fr": "Project",
      "en": "Project",
    },
    "app.compo.activity.list.table.thead.client": {
      "fr": "Client",
      "en": "Client",
    },
    "app.compo.activity.list.table.thead.startDate": {
      "fr": "Date D\u00e9but",
      "en": "StartDate",
    },
    "app.compo.activity.list.table.thead.endDate": {
      "fr": "Date Fin",
      "en": "EndDate",
    },
    "app.compo.activity.list.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.list.table.thead.valid": {
      "fr": "Valide",
      "en": "Valid",
    },
    "app.compo.activity.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.activity.list.table.action.delete": {
      "fr": "SUPPRIMER",
      "en": "DELETE",
    },
    "app.compo.activity.list.button.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activity.list.button.addMultiple": {
      "fr": "AJOUTER ACTIVITE MULTIPLE",
      "en": "ADD MULTI ACTIVITY",
    },
    "app.compo.activity.form.input.type": {
      "fr": "Type",
      "en": "Type",
    },
    "app.compo.activity.form.input.project": {
      "fr": "Project",
      "en": "Project",
    },
    "app.compo.activity.form.input.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
    },
    "app.compo.activity.form.input.endDate": {
      "fr": "Date Fin",
      "en": "End date",
    },
    "app.compo.activity.form.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.activity.form.input.files": {
      "fr": "Fichiers",
      "en": "Files",
    },
    "app.compo.activity.form.input.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.form.input.valid": {
      "fr": "Valide",
      "en": "Valid",
    },
    "app.compo.activity.form.button.list": {
      "fr": "Retour \u00e0 la liste",
      "en": "Back to list",
    },
    "app.compo.activity.multiple.table.thead.activity": {
      "fr": "Activité",
      "en": "Activity",
    },
    "app.compo.activity.multiple.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.multiple.table.thead.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
    },
    "app.compo.activity.multiple.table.thead.endDate": {
      "fr": "Date Fin",
      "en": "End Date",
    },
    "app.compo.activity.multiple.table.thead.actions": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.activity.multiple.table.actions.delete": {
      "fr": "Supprimer",
      "en": "Remove",
    },
    "app.compo.activity.multiple.input.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.activity.multiple.input.type": {
      "fr": "Type",
      "en": "Type",
    },
    "app.compo.activity.multiple.input.project": {
      "fr": "Project",
      "en": "Project",
    },
    "app.compo.activity.multiple.input.startDate": {
      "fr": "Date D\u00e9but",
      "en": "Start date",
    },
    "app.compo.activity.multiple.input.endDate": {
      "fr": "Date Fin",
      "en": "End date",
    },
    "app.compo.activity.multiple.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.activity.multiple.input.files": {
      "fr": "Fichiers",
      "en": "Files",
    },
    "app.compo.activity.multiple.input.hourSup": {
      "fr": "Hueres suppl\u00e9mentaires",
      "en": "Hour Supplementary",
    },
    "app.compo.activity.multiple.input.valid": {
      "fr": "Valide",
      "en": "Valid",
    },
    "app.compo.activity.multiple.hourSup.select.target.hour": {
      "fr": "Heure",
      "en": "Hour",
    },
    "app.compo.activity.multiple.hourSup.select.target.saturday": {
      "fr": "Samedi",
      "en": "Saturday",
    },
    "app.compo.activity.multiple.hourSup.select.target.sunday": {
      "fr": "Dimanche",
      "en": "Sunday",
    },
    "app.compo.activity.multiple.hourSup.select.target.holiday": {
      "fr": "Vacance",
      "en": "Holiday",
    },
    "app.compo.activity.multiple.hourSup.table.thead.target": {
      "fr": "But",
      "en": "Target",
    },
    "app.compo.activity.multiple.hourSup.table.thead.price": {
      "fr": "Prix",
      "en": "Price",
    },
    "app.compo.activity.multiple.hourSup.table.thead.percent": {
      "fr": "%",
      "en": "%",
    },
    "app.compo.activity.multiple.hourSup.table.thead.actions": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.activity.multiple.hourSup.table.actions.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activity.multiple.actions.add": {
      "fr": "AJOUTER",
      "en": "ADD",
    },
    "app.compo.activity.multiple.actions.submit": {
      "fr": "SOUMETTRE",
      "en": "SUBMIT",
    },
    "app.compo.activity.multiple.modal.title": {
      "fr": "AJOUTER ACTIVITES MULTIPLES",
      "en": "ADD MULTI ACTIVITY",
    },
    "app.compo.cra.list.table.thead.consultant": {
      "fr": "Consultant",
      "en": "Consultant",
    },
    "app.compo.cra.list.table.thead.month": {
      "fr": "Mois",
      "en": "Month",
    },
    "app.compo.cra.list.table.thead.createdDate": {
      "fr": "Date Cr\u00e9ation",
      "en": "CreatedDate",
    },
    "app.compo.cra.list.table.thead.lastUpdateDate": {
      "fr": "Date Modification",
      "en": "LastUpdateDate",
    },
    "app.compo.cra.list.table.thead.status": {
      "fr": "Statut",
      "en": "Status",
    },
    "app.compo.cra.list.table.thead.action": {
      "fr": "Action",
      "en": "Action",
    },
    "app.compo.cra.list.table.action.showDetails": {
      "fr": "Voir CRA",
      "en": "Show CRA",
    },
    // "showConge":{
    "showConge": {
      "fr": "Voir Cong\u00e9",
      "en": "Show Conge",
    },
    "showCra": {
      "fr": "Voir Cra",
      "en": "Show Cra",
    },

    "Cra": {
      "fr": "Cra",
      "en": "Cra",
    },

    "Conge": {
      "fr": "Cong\u00e9",
      "en": "Conge",
    },

    "Show": {
      "fr": "Voir",
      "en": "Show",
    },


    "app.compo.cra.list.table.action.addConge": {
      "fr": "Ajouter Cong\u00e9",
      "en": "Add Conge",
    },
    "app.compo.cra.list.table.action.addCra": {
      "fr": "Ajouter Cra",
      "en": "Add Cra",
    },
    //Note de Frais Traduction
    "app.compo.frais.form.input.title": {
      "fr": "Titre",
      "en": "Title",
    },
    "app.compo.frais.form.input.dateFee": {
      "fr": "Date Frais",
      "en": "Fee Date",
    },
    "app.compo.frais.form.input.country": {
      "fr": "Pays",
      "en": "Country",
    },
    "app.compo.frais.form.input.activity": {
      "fr": "Mission",
      "en": "Activity",
    },
    "app.compo.frais.form.input.payementMode": {
      "fr": "Mode Paiement",
      "en": "Payement Mode",
    },
    "app.compo.frais.form.input.categories": {
      "fr": "Cat\u00e9gories",
      "en": "Categories",
    },
    "app.compo.frais.form.input.invoice": {
      "fr": "D\u00e9tails Facture",
      "en": "Invoice details",
    },
    "app.compo.frais.form.input.invoiceNumber": {
      "fr": "Num\u00e9ro Facture",
      "en": "Invoice Number",
    },
    "app.compo.frais.form.input.pretaxAmount": {
      "fr": "Prix HT",
      "en": "Pretax Amount",
    },
    "app.compo.frais.form.input.vat": {
      "fr": "TVA",
      "en": "VAT",
    },
    "app.compo.frais.form.input.amount": {
      "fr": "Montant Total",
      "en": "Amount",
    },
    "app.compo.frais.form.input.brand": {
      "fr": "Nom Enseigne",
      "en": "Brand Name",
    },
    "app.compo.frais.form.input.description": {
      "fr": "Description",
      "en": "Description",
    },
    "app.compo.frais.form.input.feeList": {
      "fr": "List Note Frais",
      "en": "Fee List",
    },
    "app.compo.frais.list.table.thead.title": {
      "fr": "Titre",
      "en": "Title",
    },
    "app.compo.frais.list.table.thead.date": {
      "fr": "Date",
      "en": "Date",
    },
    "app.compo.frais.list.table.thead.category": {
      "fr": "Cat\u00e9gorie",
      "en": "Category",
    },
    "app.compo.frais.list.table.thead.brandName": {
      "fr": "Nom Enseigne",
      "en": "Brand Name",
    },
    "app.compo.frais.list.table.thead.vat": {
      "fr": "TVA",
      "en": "VAT",
    },
    "app.compo.frais.list.table.thead.pretaxAmount": {
      "fr": "Prix HT",
      "en": "Pretax Amount",
    },
    "app.compo.frais.list.table.thead.amount": {
      "fr": "Montant",
      "en": "Amount",
    },
    "app.compo.frais.list.table.thead.status": {
      "fr": "Statut",
      "en": "Status",
    },
    "app.compo.frais.list.table.thead.action": {
      "fr": "Actions",
      "en": "Actions",
    },
    "app.compo.frais.list.payementDate": {
      "fr": "Date Paiement",
      "en": "Payement Date",
    },
    "app.compo.frais.list.button.add": {
      "fr": "Ajouter",
      "en": "Add",
    },
    "app.compo.frais.list.table.thead.consultantName": {
      "fr": "Nom Consultant",
      "en": "Consultant Name",
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
    "app.compo.msg.form.isReadByTo": {
      "fr": "Lu par destinataire",
      "en": "IsReadByTo",
      "ar": "مقروء من المستلم",
    },
    "app.compo.msg.form.listMsgs": {
      "fr": "Liste Messages",
      "en": "List msgs",
      "ar": "قائمة الرسائل",
    },
    "app.compo.msg.list.addMsg": {
      "fr": "Ajouter Message",
      "en": "Add Msg",
      "ar": "إضافة رسالة",
    },
    "app.compo.msgHisto.form.listMsgHistos": {
      "fr": "Liste Historique Messages",
      "en": "List msgHistos",
      "ar": "قائمة سجل الرسائل",
    },
    "app.compo.msgHisto.list.addMsgHisto": {
      "fr": "Ajouter Historique",
      "en": "Add MsgHisto",
      "ar": "إضافة سجل",
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
    "app.compo.menu.addEsnDemo": {
      "fr": "Ajouter ESN démo",
      "en": "Add Esn demo",
      "ar": "إضافة مؤسسة تجريبية",
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
    "app.compo.cra.config.weekLabel": {
      "fr": "SEMAINE",
      "en": "WEEK",
      "ar": "أسبوع",
    },
    "app.footer.esnName": {
      "fr": "Eisi Consulting",
      "en": "Eisi Consulting",
      "ar": "Eisi Consulting",
    },
  }
}
