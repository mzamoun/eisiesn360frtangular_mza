# Installation locale — eisiesn360frtangular

## Prérequis

| Outil | Version recommandée |
|-------|---------------------|
| Node.js | 14.x LTS (voir `install_nodejs_14.bat`) |
| npm | inclus avec Node.js |
| Angular CLI | 12.2.x (`npm install -g @angular/cli@12.2`) |
| Chrome | n'importe quelle version récente (pour les tests) |

> **Windows** : utiliser PowerShell ou Git Bash.

---

## 1. Cloner le dépôt

```bash
git clone <URL_DU_REPO>
cd eisiesn360frtangular
```

---

## 2. Installer les dépendances

```bash
npm install
```

En cas d'erreur de dépendances obsolètes :
```bash
npm install --legacy-peer-deps
```

---

## 3. Configurer l'environnement local

Copier le fichier d'environnement de développement :
```bash
cp "src/environments/environment local.ts" src/environments/environment.ts
```

Puis éditer `src/environments/environment.ts` et renseigner :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',   // URL du backend Spring Boot
};
```

---

## 4. Lancer le serveur de développement

```bash
ng serve
# ou
npm start
```

L'application sera disponible sur : **http://localhost:4200**

---

## 5. Compiler en mode développement

```bash
ng build --configuration development
# ou
./build_front.sh
```

Le résultat se trouve dans `docs/` (pour déploiement statique).

---

## 6. Lancer les tests unitaires

```bash
ng test --watch=false --browsers=ChromeHeadless
```

Résultat attendu : **184 SUCCESS** (tous les tests passent).

---

## 7. Lancer les tests Selenium (E2E)

Prérequis : avoir l'application et le backend qui tournent localement.

```bash
cd e2e/test-selinium/js
node --experimental-vm-modules profils/test01-admin.js
node --experimental-vm-modules profils/test02-respEsn.js
node --experimental-vm-modules profils/test03-manager.js
node --experimental-vm-modules profils/test04-consultant.js
```

---

## 8. Problèmes fréquents

| Problème | Solution |
|----------|----------|
| `node-sass` compilation error | `npm install --legacy-peer-deps` |
| Port 4200 déjà utilisé | `ng serve --port 4201` |
| ChromeDriver introuvable | Installer `chromedriver` correspondant à votre version Chrome |
| Backend CORS error | Configurer `CorsConfiguration` dans Spring Boot pour `http://localhost:4200` |
