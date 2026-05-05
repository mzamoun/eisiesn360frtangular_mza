# Déploiement Azure — eisiesn360frtangular

## Architecture cible

```
[Angular Frontend] ─→ Azure Static Web Apps (ou Azure App Service)
[Spring Boot API]  ─→ Azure App Service (Java)
[Database]         ─→ Azure Database for MySQL / PostgreSQL
```

---

## Option A : Azure Static Web Apps (recommandé pour le frontend)

### Prérequis

- Un compte Azure actif
- Azure CLI installé : `az --version`
- GitHub Actions (optionnel, pour CI/CD automatique)

### Étapes

#### 1. Compiler en mode production

```bash
ng build --configuration production
```
Le résultat est dans `docs/`.

#### 2. Créer la ressource Azure Static Web Apps

Via le portail Azure ou en ligne de commande :
```bash
az staticwebapp create \
  --name eisiesn360fr \
  --resource-group <mon-resource-group> \
  --source https://github.com/<user>/<repo> \
  --location "West Europe" \
  --branch main \
  --app-location "/" \
  --output-location "docs"
```

#### 3. Variables d'environnement

Dans le portail Azure → Static Web Apps → Configuration :

| Clé | Valeur |
|-----|--------|
| `API_URL` | URL de votre backend (ex: `https://eisiesn360api.azurewebsites.net`) |

#### 4. Règles de réécriture (SPA)

Le fichier `staticwebapp.config.json` à la racine doit contenir :
```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/api/*"]
  }
}
```

---

## Option B : Azure App Service (Docker ou JAR)

### Prérequis

- Docker installé (optionnel, pour conteneur)
- Azure CLI

### Étapes

#### 1. Créer un App Service Plan

```bash
az appservice plan create \
  --name eisiesn360plan \
  --resource-group <mon-resource-group> \
  --sku B1 \
  --is-linux
```

#### 2. Créer le Web App

```bash
az webapp create \
  --name eisiesn360fr \
  --resource-group <mon-resource-group> \
  --plan eisiesn360plan \
  --runtime "NODE:14-lts"
```

#### 3. Déployer

```bash
# Compiler
ng build --configuration production

# Déployer le dossier docs/
az webapp deployment source config-zip \
  --resource-group <mon-resource-group> \
  --name eisiesn360fr \
  --src docs.zip
```

---

## CI/CD avec GitHub Actions

Exemple de workflow `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '14'
      - run: npm install --legacy-peer-deps
      - run: ng build --configuration production
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "docs"
```

---

## Notes de sécurité

- Ne pas commiter les secrets Azure dans le code source.
- Utiliser Azure Key Vault pour les variables sensibles.
- Activer HTTPS uniquement (forcer la redirection HTTP → HTTPS).
- Configurer les CORS côté backend pour pointer vers l'URL de production.
