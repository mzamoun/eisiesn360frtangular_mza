# DOC_USER - Guide d utilisation ESN360

## 1. Objectif de l application
ESN360 permet d'inscrire une esn, gerer les activites (missions, formations, congés, inter-contrat, ...), CRA, notes de frais, facturations, documents (fiches de paye, contrats, attestations, ...), vacances spécifiques, notifications, profils utilisateurs et elements administratifs d'une ESN.

### 1.1 Perimetre fonctionnel detaille
Le perimetre couvre les besoins suivants:
- Pilotage des activites consultants (mission, conge, formation, inter-contrat, etc.)
- Saisie et suivi des CRA, avec validation selon le role
- Gestion des notes de frais (saisie, suivi, visualisation, dashboards)
- Suivi de la facturation et des elements de pilotage associes
- Gestion documentaire RH et administrative (fiches de paye, contrats, attestations, autres documents)
- Gestion des vacances specifiques et regles associees
- Diffusion d informations via notifications metier
- Administration des utilisateurs, profils, clients, projets et parametres
- Gestion des ESN (Entreprises de Services du Numérique)
- Gestion des types d'activites et categories de documents
- Configuration des regles CRA (jours fériés, congés, etc.)
- Visualisation des relations entre entités (graph D3)
- Logs d'administration pour le debugging

### 1.2 Vue metier par role
- **ADMIN**: supervision globale, gestion transverse des entites et utilisateurs, acces aux logs d'administration
- **RESPONSIBLE_ESN**: pilotage de son ESN, de ses managers/consultants et du suivi activite
- **MANAGER**: gestion d equipe, validation/rejet des CRA et suivi quotidien
- **CONSULTANT**: saisie CRA, notes de frais, consultation notifications et gestion de ses informations

## 2. Profils utilisateurs
Les profils principaux sont:
- **ADMIN**: Acces global a toutes les fonctionnalités
- **RESPONSIBLE_ESN**: Gestion de son ESN et de ses consultants
- **MANAGER**: Gestion d'equipe et validation des CRA
- **CONSULTANT**: Saisie de ses CRA et notes de frais

Selon le profil, certains ecrans et actions ne sont pas visibles.

## 3. Connexion
Page de connexion: `/#/login`

Fonctions disponibles:
- Saisie identifiant (login)
- Saisie mot de passe
- Affichage/masquage du mot de passe
- Acces inscription
- Mot de passe oublie (envoi lien de reinitialisation)
- Affichage des 5 dernieres connexions

## 4. Inscription d une nouvelle ESN
Page d inscription: `/#/inscription`

Parcours recommande:
1. Le responsable ESN complete le formulaire d inscription.
2. Un email de validation est envoye a l adresse renseignée.
3. Le responsable clique sur le lien de validation (`/#/validateEmail/:code`).
4. Une fois l email valide, le compte est active pour la connexion.
5. A la premiere connexion, le responsable initialise son organisation (managers, consultants, clients, projets).

Regles metier a retenir:
- Le premier mois peut etre traite comme une periode d essai gratuite selon le parametrage metier.
- Apres cette periode, l acces peut etre limite tant que la situation de paiement n est pas regularisee.
- Un mot de passe provisoire peut etre impose selon le workflow d onboarding.

## 5. Navigation principale apres connexion
Apres authentification, l application redirige vers `/#/home` (dashboard).

### 5.1 Menus/ecrans principaux
- **Dashboard**: `/#/home` - Vue d'ensemble et raccourcis
- **Profil**: `/#/my-profile` - Gestion du profil utilisateur
- **Notifications**: `/#/notification` - Centre de notifications
- **Aide**: `/#/help` - Support et contact

### 5.2 Gestion des CRA
- **Liste CRA**: `/#/cra_list` - Liste des comptes rendus d'activité
- **Formulaire CRA**: `/#/cra_form` - Saisie/edition avec calendrier
- **Application CRA**: `/#/cra_app` - Vue détaillée des CRA
- **Configuration CRA**: `/#/cra-configuration` - Paramétrage des règles CRA

### 5.3 Gestion des consultants
- **Liste consultants**: `/#/consultant_list` - Annuaire des consultants
- **Formulaire consultant**: `/#/consultant_form` - Création/edition de consultant
- **Application consultant**: `/#/consultant_app` - Vue détaillée consultant

### 5.4 Gestion des clients
- **Liste clients**: `/#/client_list` - Annuaire des clients
- **Formulaire client**: `/#/client_form` - Création/edition de client
- **Application client**: `/#/client_app` - Vue détaillée client

### 5.5 Gestion des projets
- **Liste projets**: `/#/project_list` - Liste des projets
- **Formulaire projet**: `/#/project_form` - Création/edition de projet
- **Application projet**: `/#/project_app` - Vue détaillée projet

### 5.6 Gestion des activités
- **Liste activités**: `/#/activity_list` - Liste des activités (missions, formations, etc.)
- **Formulaire activité**: `/#/activity_form` - Création/edition d'activité
- **Application activité**: `/#/activity_app` - Vue détaillée activité

### 5.7 Gestion des types d'activités
- **Liste types**: `/#/activityType_list` - Types d'activités (mission, conge, formation, etc.)
- **Formulaire type**: `/#/activityType_form` - Création/edition de type
- **Application type**: `/#/activityType_app` - Vue détaillée type

### 5.8 Gestion des ESN
- **Liste ESN**: `/#/esn_list` - Liste des ESN
- **Formulaire ESN**: `/#/esn_form` - Création/edition ESN
- **Application ESN**: `/#/esn_app` - Vue détaillée ESN

### 5.9 Gestion des notes de frais
- **Liste notes**: `/#/notefrais_list` - Liste des notes de frais
- **Formulaire note**: `/#/notefrais_form` - Création/edition note de frais
- **Application notes**: `/#/notefrais_app` - Vue détaillée notes
- **Dashboard notes**: `/#/notefrais_dashboard` - Synthèse notes de frais
- **Par mois**: `/#/fee_depense_permonth_dash` - Dashboard mensuel
- **Par année**: `/#/fee_depense_peryear_dash` - Dashboard annuel
- **Par consultant**: `/#/fee_depense_perconsultant_dash` - Dashboard consultant
- **Par catégorie**: `/#/fee_depense_percategory_dash` - Dashboard catégorie

### 5.10 Gestion documentaire
- **Liste documents**: `/#/admindoc_list` - Liste des documents administratifs
- **Formulaire document**: `/#/admindoc_form` - Création/edition document
- **Application documents**: `/#/admindoc_app` - Vue détaillée documents
- **Multiple**: `/#/admindoc_multiple` - Gestion multiple de documents
- **Permissions**: `/#/admindoc_permission` - Gestion des permissions documents
- **Catégories documents**: `/#/categoryDoc_list` - Liste des catégories
- **Formulaire catégorie**: `/#/categoryDoc_form` - Création/edition catégorie
- **Application catégorie**: `/#/categoryDoc_app` - Vue détaillée catégorie

### 5.11 Gestion des catégories
- **Liste catégories**: `/#/category_list` - Liste des catégories
- **Formulaire catégorie**: `/#/category_form` - Création/edition catégorie
- **Application catégorie**: `/#/category_app` - Vue détaillée catégorie

### 5.12 Gestion des modes de paiement
- **Liste modes**: `/#/payementmode_list` - Liste des modes de paiement
- **Formulaire mode**: `/#/payementmode_form` - Création/edition mode
- **Application mode**: `/#/payementmode_app` - Vue détaillée mode

### 5.13 Outils d'administration
- **Logs admin**: `/#/admin_logs` - Visualisation des logs d'administration
- **Permissions**: `/#/permission` - Gestion des permissions
- **Visualisation tables**: `/#/showTables` - Visualisation des tables de données
- **Relations D3**: `/#/relations-d3/:table` - Visualisation graphique des relations
- **Connexions**: `/#/connections` - Gestion des connexions

## 6. CRA (Compte Rendu d Activite)
Parcours type:
1. Ouvrir la liste CRA (`/#/cra_list`).
2. Creer ou modifier un CRA via le formulaire calendrier (`/#/cra_form`).
3. Ajouter les activites/jours concernes (mission, conge, formation, inter-contrat).
4. Valider selon le workflow metier (validation consultant puis manager).
5. Suivre les changements de statut via les notifications/liste.

### 6.1 Statuts CRA
- **DRAFT**: Brouillon, en cours de saisie
- **SUBMITTED**: Soumis pour validation
- **VALIDATED**: Validé par le manager
- **REJECTED**: Rejeté par le manager

### 6.2 Configuration CRA
La page `/#/cra-configuration` permet de:
- Configurer les jours fériés par ESN et par mois
- Définir les règles de validation
- Gérer les congés spécifiques

## 7. Activités
Les activités représentent les missions, formations, congés et autres affectations des consultants.

### 7.1 Types d'activités
- **MISSION**: Mission client
- **CONGE**: Congé payé
- **FORMATION**: Formation
- **INTER_CONTRAT**: Inter-contrat
- **MALADIE**: Arrêt maladie
- **AUTRE**: Autre type d'activité

### 7.2 Propriétés d'une activité
- Nom et description
- Dates de début et de fin
- TJM (Taux Journalier Moyen)
- Type d'activité
- Consultant assigné
- Projet et client associés
- Possibilité de travail en week-end (isWorkInWE)
- Heures supplémentaires (overTime)

## 8. Notifications
La page notifications (`/#/notification`) permet:
- Consulter les notifications recues
- Marquer comme lues
- Supprimer des notifications

Le rafraichissement est gere par le front pour eviter les appels en boucle.

### 8.1 Types de notifications
- Validation de CRA
- Rejet de CRA
- Nouvelle note de frais
- Changement de statut
- Messages du manager

## 9. Notes de frais
Parcours type:
1. Ouvrir la liste des notes de frais (`/#/notefrais_list`).
2. Creer une note de frais (`/#/notefrais_form`).
3. Uploader le ticket de facturation (photo ou PDF).
4. L application extrait automatiquement les informations pertinentes et pre-remplit les champs correspondants (date, montant, fournisseur, categorie, etc.).
5. Verifier et corriger si necessaire les donnees extraites.
6. Enregistrer puis suivre l evolution selon le workflow metier.
7. Consulter les ecrans de synthese lorsque disponibles (dashboards notes de frais).

### 9.1 Propriétés d'une note de frais
- Montant TTC et HT
- TVA et taux de TVA
- Date de la note
- Fournisseur (brand_name)
- Numéro de facture
- Description
- Catégorie de dépense
- Mode de paiement
- Activité associée
- Consultant concerné

### 9.2 Dashboards notes de frais
- **Dashboard global**: Vue d'ensemble des dépenses
- **Par mois**: Analyse mensuelle des dépenses
- **Par année**: Analyse annuelle des dépenses
- **Par consultant**: Dépenses par consultant
- **Par catégorie**: Dépenses par catégorie

Bonnes pratiques:
- Fournir un ticket lisible (photo nette, PDF non tronque) pour ameliorer la qualite d extraction.
- Verifier systematiquement le montant TTC/HT et la date avant validation.

## 10. Gestion des consultants
### 10.1 Informations consultant
- **Informations personnelles**: Nom, prénom, email, téléphone, date de naissance, adresse
- **Informations professionnelles**: Niveau, titre du poste, statut professionnel, coefficient de paie
- **Informations administratives**: Numéro de sécurité sociale, matricule, date d'entrée
- **Informations de connexion**: Username, mot de passe, photo de profil
- **Rattachement**: ESN, manager (adminConsultant), liste des consultants managés
- **Activités**: Liste des activités (missions, congés, formations)
- **CRA**: Liste des comptes rendus d'activité
- **Notes de frais**: Liste des notes de frais
- **Documents**: Liste des documents associés

### 10.2 Rôles et permissions
- **ADMIN**: Accès administrateur global
- **RESPONSIBLE_ESN**: Responsable de l'ESN
- **MANAGER**: Manager d'équipe
- **CONSULTANT**: Consultant

## 11. Gestion des clients
### 11.1 Informations client
- Nom de l'entreprise
- Coordonnées (email, téléphone, site web)
- Responsable (nom, email, téléphone)
- Adresse
- Métier/secteur
- ESN associée
- Liste des projets

## 12. Gestion des projets
### 12.1 Informations projet
- Nom et description
- Client associé
- Taille de l'équipe (teamNumber)
- Description de l'équipe (teamDesc)
- Méthodologie (method)
- Environnement (env)
- Dates de début et de fin
- Commentaires
- Liste des activités associées

## 13. Gestion des ESN
### 13.1 Informations ESN
- Nom de l'ESN
- Métier
- Téléphone
- Liste des consultants
- Liste des clients
- Configuration CRA (jours fériés)

## 14. Documents administratifs
### 14.1 Types de documents
- Fiches de paie
- Contrats de travail
- Attestations
- Documents administratifs divers

### 14.2 Gestion par catégorie
- Création de catégories de documents
- Association de documents à des catégories
- Gestion des permissions par catégorie

### 14.3 Permissions
- Définition des permissions d'accès aux documents
- Gestion par rôle et par utilisateur

## 15. Facturation et suivi financier
Le suivi financier est base sur les donnees d activite et de frais.

Usages courants:
- Verifier la coherence activites/CRA avant cloture
- Suivre les indicateurs de depenses par mois, consultant, categorie
- Exploiter ces donnees pour la preparation de la facturation
- Visualiser les dashboards de synthèse

Remarque: selon votre profil, certaines vues de synthese peuvent etre masquees.

## 16. Outils d'administration
### 16.1 Logs d'administration
La page `/#/admin_logs` permet de:
- Visualiser les logs d'administration
- Debugger les problèmes
- Suivre les actions des utilisateurs

### 16.2 Visualisation des données
- **Tables**: `/#/showTables` - Visualisation des tables de données brutes
- **Relations D3**: `/#/relations-d3/:table` - Visualisation graphique des relations entre entités

### 16.3 Gestion des permissions
La page `/#/permission` permet de:
- Définir les permissions par rôle
- Gérer les accès aux fonctionnalités

## 17. Profil utilisateur
La page `/#/my-profile` permet de:
- Consulter et modifier ses informations personnelles
- Changer sa photo de profil
- Mettre à jour ses coordonnées
- Gérer ses préférences

## 18. Aide et support
La page `/#/help` permet de:
- Consulter la documentation
- Envoyer un message au support
- Obtenir de l'aide sur l'utilisation de l'application

## 19. Reinitialisation du mot de passe
Depuis login:
1. Cliquer sur "Mot de passe oublie".
2. Saisir l email.
3. Recevoir un lien de reinitialisation par email.
4. Ouvrir le lien recu (`/#/resetPassword/:code`).
5. Definir le nouveau mot de passe.

## 20. Validation email inscription
Apres inscription, un lien de validation peut etre envoye:
- Route: `/#/validateEmail/:code`

## 21. Deconnexion
La deconnexion revient vers login et nettoie la session courante.

## 22. Bonnes pratiques utilisateur
- Toujours verifier le profil connecte (ADMIN/RESPONSIBLE_ESN/MANAGER/CONSULTANT).
- Rafraichir la page seulement si necessaire.
- En cas d erreur reseau temporaire, reessayer apres quelques secondes.
- Utiliser la page notifications pour suivre les actions metier.
- Verifier les notifications apres chaque action sensible (validation, rejet, changement de statut).
- Fournir des tickets de frais lisibles pour améliorer l'extraction automatique.
- Conserver une trace des actions importantes via les logs d'administration.

## 23. Support
En cas de probleme:
- Noter l heure, l ecran, l action realisee, le message d erreur
- Fournir ces infos a l equipe support
- Utiliser le menu Aide (`/#/help`) pour envoyer un message au support
- Consulter les logs d'administration (`/#/admin_logs`) pour le debugging 


