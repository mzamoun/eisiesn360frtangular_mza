#!/usr/bin/env python3
"""
Fix all remaining failing spec files by:
1. Expanding the DataSharingService stub with full Observable stubs and addInfo/delInfo/etc.
2. Adding FormsModule to imports
3. Adding special provider stubs where needed (MatDialogRef, NgbActiveModal, etc.)
4. Adding ConsultantService method stubs where needed
"""
import re
import os

BASE = "src/app"

# The FULL DataSharingService stub value to inject
FULL_DS_STUB = """{
          userConnected: { esn: { id: 1 }, role: 'ADMIN' },
          userConnected$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          infos$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          errors$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          esnCurrentReady$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          idEsnCurrent$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          listNotifications$: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          isUserLoggedInFct: { subscribe: (_: any) => ({ unsubscribe: () => {} }) },
          logger: { debug: () => {}, error: () => {}, info: () => {} },
          clearErrors: () => {},
          clearInfosErrors: () => {},
          addError: () => {},
          addErrorTxt: () => {},
          addInfo: () => {},
          delInfo: () => {},
          setAdminConsultant: () => {},
          isLoggedIn: () => true,
          isPublicRoute: () => false,
          getLastUserName: () => 'test',
          majManagerOfUserCurent: () => {},
          gotoLogin: () => {},
          gotoMyHome: () => {},
          router: { url: '/test', navigate: () => {} },
          idEsnCurrent: 1
        }"""

# Old DS stub pattern to replace (matches what fix_ds_stub.py produced)
OLD_DS_STUB_PATTERN = re.compile(
    r'\{ provide: DataSharingService, useValue: \{[^}]*?majManagerOfUserCurent: \(\) => \{\}[^}]*?\} \}',
    re.DOTALL
)

NEW_DS_PROVIDE = f'{{ provide: DataSharingService, useValue: {FULL_DS_STUB} }}'


def add_import_if_missing(content, import_line):
    """Add an import line if it's not already in the file."""
    # Extract what's being imported
    m = re.search(r"import \{ ([^}]+) \} from '([^']+)'", import_line)
    if not m:
        return content
    symbols = [s.strip() for s in m.group(1).split(',')]
    module_path = m.group(2)
    
    # Check if already imported
    for sym in symbols:
        if sym in content:
            return content  # Already imported (or at least present)
    
    # Add after last import line
    last_import_pos = 0
    for match in re.finditer(r'^import .+;$', content, re.MULTILINE):
        last_import_pos = match.end()
    
    if last_import_pos > 0:
        content = content[:last_import_pos] + '\n' + import_line + content[last_import_pos:]
    return content


def add_to_imports_array(content, module_name):
    """Add a module to the imports: [] array if not already there."""
    if module_name in content:
        return content
    # Find imports: [...] and add to it
    pattern = re.compile(r'(imports:\s*\[)([^\]]*?)(\])', re.DOTALL)
    def replacer(m):
        inner = m.group(2).rstrip()
        if inner.endswith(','):
            return m.group(1) + inner + ' ' + module_name + ',' + m.group(3)
        elif inner.strip():
            return m.group(1) + inner + ', ' + module_name + m.group(3)
        else:
            return m.group(1) + module_name + m.group(3)
    return pattern.sub(replacer, content, count=1)


def add_to_providers_array(content, provider_entry):
    """Add a provider entry to the providers: [] array if not already there."""
    # Check if a key part already exists
    check_key = provider_entry.split(',')[0].strip()  # e.g. "{ provide: MatDialogRef"
    if check_key in content:
        return content
    pattern = re.compile(r'(providers:\s*\[)([^\]]*?)(\])', re.DOTALL)
    def replacer(m):
        inner = m.group(2).rstrip()
        if inner.endswith(','):
            return m.group(1) + inner + '\n        ' + provider_entry + '\n      ' + m.group(3)
        elif inner.strip():
            return m.group(1) + inner + ',\n        ' + provider_entry + '\n      ' + m.group(3)
        else:
            return m.group(1) + '\n        ' + provider_entry + '\n      ' + m.group(3)
    return pattern.sub(replacer, content, count=1)


def fix_ds_stub(content):
    """Replace old DS stub with full DS stub."""
    m = OLD_DS_STUB_PATTERN.search(content)
    if m:
        return content[:m.start()] + NEW_DS_PROVIDE + content[m.end():]
    return content


def fix_spec(filepath, extra_imports=None, extra_providers=None, extra_module_imports=None,
             fix_consultant_service=False, fix_matdialogref=False, fix_ngbactivemodal=False,
             fix_httpclient=False, fix_cra_service=False):
    """Apply all fixes to a spec file."""
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Fix DS stub
    content = fix_ds_stub(content)

    # 2. Add extra TypeScript imports
    if extra_imports:
        for imp in extra_imports:
            content = add_import_if_missing(content, imp)

    # 3. Add FormsModule to imports array
    if extra_module_imports:
        for mod in extra_module_imports:
            content = add_to_imports_array(content, mod)

    # 4. Add extra providers
    if extra_providers:
        for prov in extra_providers:
            content = add_to_providers_array(content, prov)

    # 5. Fix ConsultantService stub (add findAll)
    if fix_consultant_service:
        content = content.replace(
            "{ provide: ConsultantService, useValue: {} }",
            "{ provide: ConsultantService, useValue: { findAll: () => ({ subscribe: (fn: any) => fn({ body: { result: [] } }) }), findAllByEsn: () => ({ subscribe: (fn: any) => fn({ body: { result: [] } }) }) } }"
        )

    # 6. Fix MatDialogRef
    if fix_matdialogref:
        content = add_import_if_missing(content, "import { MatDialogRef } from '@angular/material/dialog';")
        content = add_to_providers_array(content, "{ provide: MatDialogRef, useValue: { close: () => {} } }")

    # 7. Fix NgbActiveModal
    if fix_ngbactivemodal:
        content = add_import_if_missing(content, "import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';")
        content = add_to_providers_array(content, "{ provide: NgbActiveModal, useValue: { close: () => {}, dismiss: () => {} } }")

    # 8. Fix HttpClient (add HttpClientTestingModule if missing)
    if fix_httpclient:
        content = add_import_if_missing(content, "import { HttpClientTestingModule } from '@angular/common/http/testing';")
        content = add_to_imports_array(content, "HttpClientTestingModule")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED: {filepath}")
    else:
        print(f"  UNCHANGED: {filepath}")


# ============================================================
# APPLY FIXES TO ALL FAILING SPECS
# ============================================================

FORMS_IMPORT = "import { FormsModule } from '@angular/forms';"
DATE_PIPE_IMPORT = "import { DatePipe } from '@angular/common';"

# Most failing specs just need: full DS stub + FormsModule
standard_fixes = [
    "src/app/compo/activity/activity-list/activity-list.component.spec.ts",
    "src/app/compo/activity/activity-form/activity-form.component.spec.ts",
    "src/app/compo/activity/add-multiple-activity/add-multiple-activity.component.spec.ts",
    "src/app/compo/activityType/activityType-form/activityType-form.component.spec.ts",
    "src/app/compo/administratifDocumentation/admin-doc-form/admin-doc-form.component.spec.ts",
    "src/app/compo/administratifDocumentation/admin-doc-multiple/admin-doc-multiple.component.spec.ts",
    "src/app/compo/administratifDocumentation/docCategory/doc-category-form/doc-category-form.component.spec.ts",
    "src/app/compo/administratifDocumentation/docCategory/doc-category-list/doc-category-list.component.spec.ts",
    "src/app/compo/category/category-form/category-form.component.spec.ts",
    "src/app/compo/category/category-list/category-list.component.spec.ts",
    "src/app/compo/msgHisto/msgHisto-form/msgHisto-form.component.spec.ts",
    "src/app/compo/msg-notifications/msg-notifications.component.spec.ts",
    "src/app/compo/noteFrais/notefrais-form/notefrais-form.component.spec.ts",
    "src/app/compo/noteFrais/notefrais-list/notefrais-list.component.spec.ts",
    "src/app/compo/payementMode/payementmode-form/payementmode-form.component.spec.ts",
    "src/app/compo/payementMode/payementmode-list/payementmode-list.component.spec.ts",
    "src/app/compo/my-routing-spec/my-routing-spec.component.spec.ts",
    "src/app/compo/_reuse/select-consultant/select-consultant.component.spec.ts",
]

print("=== Fixing standard specs (DS stub + FormsModule) ===")
for spec in standard_fixes:
    fix_spec(
        spec,
        extra_imports=[FORMS_IMPORT],
        extra_module_imports=["FormsModule"]
    )

# Login needs gotoMyHome in DS stub (already included in FULL_DS_STUB)
print("\n=== Fixing LoginComponent spec ===")
fix_spec(
    "src/app/auth/components/login/login.component.spec.ts",
    extra_imports=[FORMS_IMPORT],
    extra_module_imports=["FormsModule"]
)

# UserConnected needs MatDialogRef + full DS stub + FormsModule
print("\n=== Fixing UserConnectedComponent spec ===")
fix_spec(
    "src/app/compo/user-connected/user-connected.component.spec.ts",
    extra_imports=[FORMS_IMPORT],
    extra_module_imports=["FormsModule"],
    fix_matdialogref=True
)

# ConsultantArbo needs full DS stub + FormsModule + ConsultantService.findAll
# Also needs consultant input set before detectChanges - handle via stub
print("\n=== Fixing ConsultantArboComponent spec ===")
fix_spec(
    "src/app/compo/consultant/consultant-arbo/consultant-arbo.component.spec.ts",
    extra_imports=[FORMS_IMPORT],
    extra_module_imports=["FormsModule"],
    fix_consultant_service=True
)

# ConsultantForm needs full DS stub + FormsModule
print("\n=== Fixing ConsultantFormComponent spec ===")
fix_spec(
    "src/app/compo/consultant/consultant-form/consultant-form.component.spec.ts",
    extra_imports=[FORMS_IMPORT],
    extra_module_imports=["FormsModule"]
)

# FeeDepense needs full DS stub + ConsultantService.findAll + FormsModule
print("\n=== Fixing FeeDepensePerconsultantDashComponent spec ===")
fix_spec(
    "src/app/compo/noteFrais/fee-depense-perconsultant-dash/fee-depense-perconsultant-dash.component.spec.ts",
    extra_imports=[FORMS_IMPORT],
    extra_module_imports=["FormsModule"],
    fix_consultant_service=True
)

# MyCalendar needs NgbActiveModal
print("\n=== Fixing MyCalendarComponent spec ===")
fix_spec(
    "src/app/compo/my-calendar/my-calendar.component.spec.ts",
    extra_imports=[FORMS_IMPORT],
    extra_module_imports=["FormsModule"],
    fix_ngbactivemodal=True
)

# ActivityService spec needs HttpClient
print("\n=== Fixing ActivityService spec ===")
fix_spec(
    "src/app/service/activity.service.spec.ts",
    fix_httpclient=True
)

# CraService spec needs DataSharingService stub to break circular dependency
print("\n=== Fixing CraService spec ===")
cra_service_spec = "src/app/service/cra.service.spec.ts"
with open(cra_service_spec, 'r', encoding='utf-8') as f:
    content = f.read()

# CraService spec doesn't have a DS stub yet - add it
if 'DataSharingService' not in content:
    # Add import and provider
    ds_import = "import { DataSharingService } from 'src/app/service/data-sharing.service';\n"
    consultant_import = "import { ConsultantService } from 'src/app/service/consultant.service';\n"
    
    # Insert after last import
    last_import = list(re.finditer(r'^import .+;$', content, re.MULTILINE))[-1]
    insert_pos = last_import.end()
    content = content[:insert_pos] + '\n' + ds_import + consultant_import + content[insert_pos:]
    
    # Replace simple configureTestingModule with one that has providers
    content = content.replace(
        'beforeEach(() => TestBed.configureTestingModule({ imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule] }));',
        f'''beforeEach(() => TestBed.configureTestingModule({{
    imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule],
    providers: [
      {{ provide: DataSharingService, useValue: {FULL_DS_STUB} }},
      {{ provide: ConsultantService, useValue: {{ findAll: () => ({{ subscribe: (fn: any) => fn({{ body: {{ result: [] }} }}) }}) }} }}
    ]
  }}));'''
    )
    with open(cra_service_spec, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  FIXED (special): {cra_service_spec}")
else:
    print(f"  DS already present: {cra_service_spec}")

print("\n=== All fixes applied ===")
