# DOC_USER - Guide d utilisation ESN360

## 1. Objectif de l application
ESN360 permet d'inscrire une esn, gerer les activites (missions, formations, congés, ...), CRA, notes de frais, facturations, documents (fiches de paye, contrats, attestations, ...), vacances spécifiques, notifications, profils utilisateurs et elements administratifs d'une ESN.

### 1.1 Perimetre fonctionnel detaille
Le perimetre couvre les besoins suivants:
- Pilotage des activites consultants (mission, conge, formation, inter-contrat, etc.)
- Saisie et suivi des CRA, avec validation selon le role
- Gestion des notes de frais (saisie, suivi, visualisation)
- Suivi de la facturation et des elements de pilotage associes
- Gestion documentaire RH et administrative (fiches de paye, contrats, attestations, autres documents)
- Gestion des vacances specifiques et regles associees
- Diffusion d informations via notifications metier
- Administration des utilisateurs, profils, clients, projets et parametres

### 1.2 Vue metier par role
- ADMIN: supervision globale, gestion transverse des entites et utilisateurs
- RESPONSIBLE_ESN: pilotage de son ESN, de ses managers/consultants et du suivi activite
- MANAGER: gestion d equipe, validation/rejet des CRA et suivi quotidien
- CONSULTANT: saisie CRA, notes de frais, consultation notifications et gestion de ses informations

## 2. Profils utilisateurs
Les profils principaux sont:
- ADMIN
- RESPONSIBLE_ESN
- MANAGER
- CONSULTANT

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
2. Un email de validation est envoye a l adresse renseignee.
3. Le responsable clique sur le lien de validation (`/#/validateEmail/:code`).
4. Une fois l email valide, le compte est active pour la connexion.
5. A la premiere connexion, le responsable initialise son organisation (managers, consultants, clients, projets).

Regles metier a retenir:
- Le premier mois peut etre traite comme une periode d essai gratuite selon le parametrage metier.
- Apres cette periode, l acces peut etre limite tant que la situation de paiement n est pas regularisee.
- Un mot de passe provisoire peut etre impose selon le workflow d onboarding.

## 5. Navigation principale apres connexion
Apres authentification, l application redirige vers `/#/home` (dashboard).

Menus/ecrans frequents:
- Profil: `/#/my-profile`
- Notifications: `/#/notification`
- CRA liste: `/#/cra_list`
- CRA formulaire: `/#/cra_form`
- Notes de frais liste: `/#/notefrais_list`
- Notes de frais formulaire: `/#/notefrais_form`
- Consultants: `/#/consultant_list`
- Clients: `/#/client_list`
- Projets: `/#/project_list`
- Types d activites: `/#/activityType_list`
- Documents administratifs: `/#/admindoc_list`

## 6. CRA (Compte Rendu d Activite)
Parcours type:
1. Ouvrir la liste CRA.
2. Creer ou modifier un CRA via le formulaire calendrier.
3. Ajouter les activites/jours concernes.
4. Valider selon le workflow metier.
5. Suivre les changements de statut via les notifications/liste.

## 7. Notifications
La page notifications permet:
- Consulter les notifications recues
- Marquer comme lues
- Supprimer des notifications

Le rafraichissement est gere par le front pour eviter les appels en boucle.

## 8. Notes de frais
Parcours type:
1. Ouvrir la liste des notes de frais (`/#/notefrais_list`).
2. Creer une note de frais (`/#/notefrais_form`).
3. Uploader le ticket de facturation (photo ou PDF).
4. L application extrait automatiquement les informations pertinentes et pre-remplit les champs correspondants (date, montant, fournisseur, categorie, etc.).
5. Verifier et corriger si necessaire les donnees extraites.
6. Enregistrer puis suivre l evolution selon le workflow metier.
7. Consulter les ecrans de synthese lorsque disponibles (dashboards notes de frais).

Bonnes pratiques:
- Fournir un ticket lisible (photo nette, PDF non tronque) pour ameliorer la qualite d extraction.
- Verifier systematiquement le montant TTC/HT et la date avant validation.

## 9. Facturation et suivi financier
Le suivi financier est base sur les donnees d activite et de frais.

Usages courants:
- Verifier la coherence activites/CRA avant cloture
- Suivre les indicateurs de depenses par mois, consultant, categorie
- Exploiter ces donnees pour la preparation de la facturation

Remarque: selon votre profil, certaines vues de synthese peuvent etre masquees.

## 10. Documents administratifs et vacances specifiques
Documents:
- Depot et consultation des documents administratifs autorises
- Gestion par categorie (ex: fiche de paye, contrat, attestation)

Vacances specifiques:
- Saisie et suivi des absences selon les regles metier
- Prise en compte dans les activites et le CRA

Bon reflexe: verifier les notifications apres chaque action sensible (validation, rejet, changement de statut).

## 11. Reinitialisation du mot de passe
Depuis login:
1. Cliquer sur "Mot de passe oublie".
2. Saisir l email.
3. Recevoir un lien de reinitialisation par email.
4. Ouvrir le lien recu (`/#/resetPassword/:code`).
5. Definir le nouveau mot de passe.

## 12. Validation email inscription
Apres inscription, un lien de validation peut etre envoye:
- Route: `/#/validateEmail/:code`

## 13. Deconnexion
La deconnexion revient vers login et nettoie la session courante.

## 14. Bonnes pratiques utilisateur
- Toujours verifier le profil connecte (ADMIN/RESPONSIBLE_ESN/MANAGER/CONSULTANT).
- Rafraichir la page seulement si necessaire.
- En cas d erreur reseau temporaire, reessayer apres quelques secondes.
- Utiliser la page notifications pour suivre les actions metier.

## 15. Support
En cas de probleme:
- Noter l heure, l ecran, l action realisee, le message d erreur
- Fournir ces infos a l equipe support
- Menu Aide qui permet d'envoyer un message au support 


