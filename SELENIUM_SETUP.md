# Guide de configuration des tests Selenium

## Prérequis

1. **Node.js** (version 14.x à 16.x) - déjà installé
2. **Chrome** - dernière version stable
3. **ChromeDriver** - compatible avec votre version Chrome
4. **Backend Spring Boot** - démarré sur http://localhost:8080

## Étape 1 : Vérifier la version Chrome

Ouvrez Chrome et allez dans :
- Menu (⋮) > Aide > À propos de Google Chrome
- Notez la version (ex: 131.0.6778.86)
Version 150.0.7871.125 (Build officiel) (64 bits)

## Étape 2 : Installer ChromeDriver compatible

### Option A : Via npm (recommandé)

```bash
npm install chromedriver@latest
```

Si cela échoue, essayez avec une version spécifique :

```bash
npm install chromedriver@<version_chrome_sans_patch>
# Exemple pour Chrome 131: npm install chromedriver@131.0.0
```

### Option B : Manuel

1. Télécharger ChromeDriver depuis : https://chromedriver.chromium.org/downloads
2. Extraire le fichier `chromedriver.exe`
3. Le placer dans un dossier du PATH (ex: `C:\Windows\System32` ou ajouter au PATH)

## Étape 3 : Vérifier l'installation

```bash
chromedriver --version
```

Vous devriez voir la version de ChromeDriver.

## Étape 4 : Démarrer les applications

### 4.1 Démarrer Angular (frontend)

```bash
npm start
```

L'application sera accessible sur : http://localhost:4200

### 4.2 Démarrer Spring Boot (backend)

Nécessaire pour les tests Selenium complets (connexion, CRUD, etc.)

```bash
# Selon votre configuration backend
cd <dossier_backend>
mvn spring-boot:run
# ou
java -jar <votre_jar>.jar
```

Le backend sera accessible sur : http://localhost:8080

## Étape 5 : Tester l'infrastructure Selenium

### Test simple (sans backend)

```bash
cd e2e/test-selinium/js
node --experimental-vm-modules profils/test-simple-login.js
```

Ce test vérifie uniquement que :
- ChromeDriver fonctionne
- L'application Angular est accessible
- Le formulaire de login est présent

### Test complet (avec backend)

```bash
cd e2e/test-selinium/js
node --experimental-vm-modules profils/test-conge.js
```

Ce test nécessite le backend démarré.

## Étape 6 : Exécuter les tests par profil

Une fois l'infrastructure validée :

```bash
cd e2e/test-selinium/js

# Test admin
node --experimental-vm-modules profils/test01-admin.js

# Test responsable ESN
node --experimental-vm-modules profils/test02-respEsn.js

# Test manager
node --experimental-vm-modules profils/test03-manager.js

# Test consultant
node --experimental-vm-modules profils/test04-consultant.js
```

## Dépannage

### Erreur : "ChromeDriver not found"

**Solution :**
```bash
npm install chromedriver@latest
# ou vérifier que chromedriver.exe est dans le PATH
```

### Erreur : "Session not created: This version of ChromeDriver only supports Chrome version X"

**Solution :**
Installer la version compatible de ChromeDriver :
```bash
npm install chromedriver@<version_compatible>
```

### Erreur : "Connection refused" sur localhost:8080

**Solution :**
Démarrer le backend Spring Boot sur le port 8080

### Erreur : "No output yet (still running)"

**Solution :**
L'application Angular n'est pas démarrée. Lancez `npm start` dans un autre terminal.

### Erreur : "Cannot find module 'selenium-webdriver'"

**Solution :**
```bash
npm install selenium-webdriver
```

## Structure des tests

```
e2e/test-selinium/js/
├── lib/
│   ├── _ctes.js              # Constantes (URL, password)
│   ├── _utils.js             # Utilitaires
│   ├── lib-test-login.js     # Fonctions de login
│   ├── lib-test-cra.js       # Fonctions CRUD CRA/Congé
│   ├── lib-test-activity.js  # Fonctions CRUD Activité
│   ├── lib-test-consultant.js # Fonctions CRUD Consultant
│   ├── lib-test-client.js    # Fonctions CRUD Client
│   ├── lib-test-project.js   # Fonctions CRUD Projet
│   ├── lib-test-esn.js       # Fonctions CRUD ESN
│   ├── lib-test-document.js  # Fonctions CRUD Document
│   ├── lib-test-vacance.js   # Fonctions CRUD Vacance
│   └── lib-test-mode-paiment.js # Fonctions CRUD Mode paiement
└── profils/
    ├── test01-admin.js       # Tests profil ADMIN
    ├── test02-respEsn.js     # Tests profil RESPONSIBLE_ESN
    ├── test03-manager.js     # Tests profil MANAGER
    ├── test04-consultant.js # Tests profil CONSULTANT
    ├── test-conge.js         # Test création congé (nouveau)
    └── test-simple-login.js # Test infrastructure (nouveau)
```

## Prochaines étapes

Une fois l'infrastructure validée :

1. Corriger les IDs des boutons dans `lib-test-cra.js` selon l'interface réelle
2. Tester `createConge` avec `test-conge.js`
3. Compléter les tests négatifs
4. Intégrer les tests de documents
5. Ajouter les workflows complets

## Notes importantes

- Les tests Selenium nécessitent les applications frontend ET backend démarrées
- ChromeDriver doit être compatible avec votre version Chrome
- Les IDs des éléments HTML sont actuellement hardcoded - ils devront peut-être être adaptés
- Les credentials sont dans `_ctes.js` - à adapter selon votre environnement