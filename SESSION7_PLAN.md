# PLAN DE CONTINUATION SESSION 7 - Test Suite Stabilization

## Situation Actuelle
- **Résultat Session 6:** 77 FAILED, 83 SUCCESS (48% taux d'échec)
- **Améliorations Session 6:** 8 tests fixes (+10%), syntaxe corrigée, RouterTestingModule ajouté
- **Démarrage Session 6:** 85 FAILED, 75 SUCCESS (53% taux d'échec)

---

## 73 Fichiers Specs Identifiés sans HttpClientTestingModule

### SERVICE SPECS À CORRIGER PRIORITAIREMENT (20 fichiers)
Ces services INJECTENT HttpClient et DOIVENT avoir HttpClientTestingModule:

1. src/app/service/client.service.spec.ts
2. src/app/service/cra.service.spec.ts
3. src/app/service/cra-forms.service.spec.ts
4. src/app/service/document.service.spec.ts
5. src/app/service/msg.service.spec.ts
6. src/app/service/msgHisto.service.spec.ts
7. src/app/service/activity.service.spec.ts
8. src/app/service/project.service.spec.ts
9. src/app/service/note-frais.service.spec.ts
10. src/app/service/category.service.spec.ts
11. src/app/service/base.service.spec.ts
12. src/app/service/utils.service.spec.ts
13. src/app/service/trad.service.spec.ts
14. src/app/service/note-frais-dashboard.service.spec.ts (special: non providedIn: root)

**ACTION:** Pour chacun:
```typescript
// Ajouter à l'entête:
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Ajouter à beforeEach:
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]  // ← AJOUTER CETTE LIGNE
  });
});
```

### COMPONENT SPECS À CORRIGER (53 fichiers)
Ces composants utilisent des services qui injectent HttpClient/Router/etc:

**Groupe 1 - App/Layout/Core (simples, peu de dépendances):**
- src/app/app.component.spec.ts
- src/app/home/home.component.spec.ts
- src/app/layout/footer/footer.component.spec.ts
- src/app/compo/notification/notification.component.spec.ts
- src/app/compo/dashboard/dashboard.component.spec.ts
- src/app/compo/permission/permission.component.spec.ts
- src/app/compo/profile/profile.component.spec.ts
- src/app/compo/spinner/spinner.component.spec.ts

**Groupe 2 - Forms et List (nombreuses dépendances, tous Services):**
- src/app/compo/activity/activity-form/activity-form.component.spec.ts
- src/app/compo/activityType/activityType-form/activityType-form.component.spec.ts
- src/app/compo/activityType/activityType-list/activityType-list.component.spec.ts
- src/app/compo/client/client-list/client-list.component.spec.ts
- src/app/compo/cra/cra-form/cra-form-cal.component.spec.ts
- src/app/compo/cra/cra-list/cra-list.component.spec.ts
- src/app/compo/msg/msg-form/msg-form.component.spec.ts
- src/app/compo/msg/msg-list/msg-list.component.spec.ts
- src/app/compo/msgHisto/msgHisto-form/msgHisto-form.component.spec.ts
- src/app/compo/msgHisto/msgHisto-list/msgHisto-list.component.spec.ts
- src/app/compo/project/project-list/project-list.component.spec.ts

**Groupe 3 - Complexes (Dashboard, Dépenses):**
- src/app/compo/noteFrais/notefrais-dashboard/notefrais-dashboard.component.spec.ts
- src/app/compo/noteFrais/fee-depense-permonth-dash/fee-depense-permonth-dash.component.spec.ts
- src/app/compo/noteFrais/fee-depense-perconsultant-dash/fee-depense-perconsultant-dash.component.spec.ts
- src/app/compo/noteFrais/fee-depense-peryear-dash/fee-depense-peryear-dash.component.spec.ts
- src/app/compo/noteFrais/fee-depense-info-dash/fee-depense-info-dash.component.spec.ts
- src/app/compo/noteFrais/fee-depense-percategory-dash/fee-depense-percategory-dash.component.spec.ts

**Groupe 4 - App Shells (parent components avec child components):**
- src/app/compo/activity/add-multiple-activity/add-multiple-activity.component.spec.ts
- src/app/compo/activityType/activityType-app/activityType-app.component.spec.ts
- src/app/compo/category/category-app/category-app.component.spec.ts
- src/app/compo/client/client-app/client-app.component.spec.ts
- src/app/compo/consultant/consultant-app/consultant-app.component.spec.ts
- src/app/compo/cra/cra-app/cra-app.component.spec.ts
- src/app/compo/esn/esn-app/esn-app.component.spec.ts
- src/app/compo/esn/esn-form/esn-form.component.spec.ts
- src/app/compo/esn/esn-list/esn-list.component.spec.ts
- src/app/compo/msg/msg-app/msg-app.component.spec.ts
- src/app/compo/msgHisto/msgHisto-app/msgHisto-app.component.spec.ts
- src/app/compo/noteFrais/notefrais-app/notefrais-app.component.spec.ts
- src/app/compo/payementMode/payementmode-app/payementmode-app.component.spec.ts
- src/app/compo/project/project-app/project-app.component.spec.ts
- src/app/compo/administratifDocumentation/admin-doc-app/admin-doc-app.component.spec.ts
- src/app/compo/administratifDocumentation/admin-doc-multiple/admin-doc-multiple.component.spec.ts
- src/app/compo/administratifDocumentation/admin-doc-permission/admin-doc-permission.component.spec.ts
- src/app/compo/administratifDocumentation/docCategory/doc-category-app/doc-category-app.component.spec.ts

**Groupe 5 - Spécialisés (Date, Dialog, Calendar):**
- src/app/compo/my-calendar/my-calendar.component.spec.ts
- src/app/compo/mz-date-picker/mz-date-picker.component.spec.ts
- src/app/compo/mz-date-picker-deb-fin/mz-date-picker-deb-fin.component.spec.ts
- src/app/compo/user-connected/user-connected.component.spec.ts
- src/app/compo/valid-email/valid-email.component.spec.ts
- src/app/compo/_dialogs/signup-dialog/signup-dialog.component.spec.ts
- src/app/compo/_reuse/select-consultant/select-consultant.component.spec.ts
- src/app/compo/_reuse/select-consultant/select/select.component.spec.ts
- src/app/compo/_utils/relations-viewer/relations-d3.component.spec.ts
- src/app/compo/configuration/cra-configuration/cra-configuration.component.spec.ts
- src/app/compo/msg-histo/msg-histo.component.spec.ts
- src/app/compo/msg-notifications/msg-notifications.component.spec.ts
- src/app/compo/loading-page/loading-page.component.spec.ts
- src/app/compo/test2/test2.component.spec.ts
- src/app/compo/connection/connection.component.spec.ts
- src/app/compo/administratifDocumentation/docCategory/doc-category-list/doc-category-list.component.spec.ts
- src/app/compo/administratifDocumentation/docCategory/doc-category-form/doc-category-form.component.spec.ts

---

## Commandes Batch à Exécuter

### STRATEGY: Créer une fonction "patch" réutilisable

Pour chaque groupe de fichiers similaires, utiliser le pattern:

```bash
# Pour service specs avec imports HttpClientTestingModule manquants
grep -l "beforeEach(() =>" src/app/service/*.service.spec.ts | \
  while read f; do
    if ! grep -q "HttpClientTestingModule" "$f"; then
      echo "Patching $f"
      # Ajouter import et TestBed config
    fi
  done

# Pour component specs sans NO_ERRORS_SCHEMA
grep -l "declarations: \[" src/app/compo/**/*.component.spec.ts | \
  while read f; do
    if ! grep -q "NO_ERRORS_SCHEMA" "$f"; then
      echo "Adding NO_ERRORS_SCHEMA to $f"
      # Ajouter schema
    fi
  done
```

---

## Priorité par Impact

### PHASE 1: Service Specs (14 fichiers - HIGH IMPACT)
These are core services used by multiple components. Fix all 14 service specs with HttpClientTestingModule.
**Expected reduction:** 14-20 test failures → 57-63 FAILED remaining

### PHASE 2: Component Specs with Child Dependencies (20 files - HIGH IMPACT)
App shells and complex components need NO_ERRORS_SCHEMA + imports.
**Expected reduction:** 20-30 test failures → 27-43 FAILED remaining

### PHASE 3: Form & List Components (25 files - MEDIUM IMPACT)
These should mostly need HttpClientTestingModule already added via service fixes.
**Expected reduction:** 5-10 test failures → 17-38 FAILED remaining

### PHASE 4: Special Components (8 files - MEDIUM IMPACT)
Date pickers, dialogs, modals need specific Material/ng-bootstrap imports.
**Expected reduction:** 8-15 test failures → ~20 FAILED remaining

### PHASE 5: Final Polish (Edge Cases)
- Add FormsModule to specs with ngModel binding (~3-5 files)
- Add Material imports (MatDialogModule, BrowserAnimationsModule, MatNativeDateModule) (~5-8 files)
- Fix NoteFraisDashboardService providedIn: 'root' issue (~4 specs)

---

## Commandes to Execute Next Session

```bash
# 1. Find all service specs missing HttpClientTestingModule and get their exact format
grep -A2 "beforeEach" src/app/service/*.service.spec.ts | grep -v "HttpClientTestingModule" | head -20

# 2. Add imports to client.service.spec.ts (check exact format first):
# READ c:\Users\mza\Documents\home\github\eisiesn360frtangular\src\app\service\client.service.spec.ts lines 1-15

# 3. Add NO_ERRORS_SCHEMA to component specs:
# For each file in Groupe 4, add: schemas: [NO_ERRORS_SCHEMA] to TestBed config

# 4. Re-run tests to verify progress:
# ng test --watch=false --browsers=ChromeHeadless 2>&1 | grep "TOTAL:"

# EXPECTED: 57-63 FAILED after Phase 1 & 2 (down from 77)
# EXPECTED: ~20-30 FAILED after all phases
# TARGET: 160/160 PASSING by end of Session 7
```

---

## Key Files to Check/Modify First

1. **c:\Users\mza\Documents\home\github\eisiesn360frtangular\src\app\service\client.service.spec.ts**
   - Read exact format of beforeEach/TestBed
   - Check if HttpClientTestingModule import exists
   - Add if missing

2. **c:\Users\mza\Documents\home\github\eisiesn360frtangular\src\app\testing\test-helpers.ts**
   - ENHANCEMENT: Add CommonHttpAndRouterConfig export with all standard imports
   - Export: `{ imports: [HttpClientTestingModule, RouterTestingModule, FormsModule], schemas: [NO_ERRORS_SCHEMA] }`

3. **c:\Users\mza\Documents\home\github\eisiesn360frtangular\src\app\compo/noteFrais/notefrais-dashboard/notefrais-dashboard.component.ts**
   - Check NoteFraisDashboardService decorator
   - Add `providedIn: 'root'` if missing to service definition

---

## Session 7 Expected Outcome

**Target:** 160/160 tests PASSING (100% success rate)
**Minimum:** 120/160 PASSING (75% success, all critical paths working)
**Realistic:** 140-155/160 PASSING (87-97% success rate, edge cases remaining)
