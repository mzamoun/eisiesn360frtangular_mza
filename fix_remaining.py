#!/usr/bin/env python3
"""Fix remaining test errors: NgxPaginationModule, CommonModule, MatNativeDateModule, MatDialogRef, NgbActiveModal."""
import glob, re

spec_files = glob.glob('src/app/**/*.spec.ts', recursive=True)

def get_component_dir(spec_file):
    """Get the component name from spec file path."""
    return spec_file.replace('.spec.ts', '.component.ts')

def add_import(content, import_line):
    """Add import if not already present."""
    symbol = re.search(r"import \{([^}]+)\}", import_line)
    if symbol and symbol.group(1).strip() in content:
        return content
    # Add after last import
    lines = content.split('\n')
    last_import_idx = 0
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i
    if last_import_idx > 0:
        lines.insert(last_import_idx + 1, import_line)
        return '\n'.join(lines)
    return content

def add_to_imports_array(content, module):
    """Add module to TestBed imports array."""
    if module in content:
        return content
    # Add to imports: [...] array
    content = re.sub(
        r'(imports:\s*\[)(\s*)([^\]]*?)(\s*\])',
        lambda m: m.group(1) + m.group(2) + m.group(3) + (', ' if m.group(3).strip() else '') + module + m.group(4),
        content, count=1
    )
    return content

def add_to_providers_array(content, provider):
    """Add provider to TestBed providers array."""
    if provider.split(',')[0].strip() in content and 'provide:' in provider:
        # Check if the specific token is already provided
        token = re.search(r'provide:\s*(\w+)', provider)
        if token and re.search(r'provide:\s*' + token.group(1), content):
            return content
    content = re.sub(
        r'(providers:\s*\[)(\s*)([^\]]*?)(\s*\])',
        lambda m: m.group(1) + m.group(2) + m.group(3) + (', ' if m.group(3).strip() else '') + provider + m.group(4),
        content, count=1
    )
    return content

# Components that use paginate pipe (based on their templates)
paginate_components = [
    'activity-list', 'activityType-list', 'activitytype-list',
    'doc-category-list', 'category-list', 'client-list',
    'connection', 'consultant-list', 'cra-list', 'esn-list',
    'notefrais-list', 'notification', 'payementmode-list',
    'permission', 'project-list'
]

fixed_files = 0

for f in sorted(set(spec_files)):
    with open(f, 'r') as fh:
        content = fh.read()
    original = content
    
    # Add NgxPaginationModule for components that use paginate pipe
    needs_paginate = any(comp in f.replace('\\', '/') for comp in paginate_components)
    # Also check if NO_ERRORS_SCHEMA is NOT present (if it is, pipe errors won't occur)
    has_no_errors_schema = 'NO_ERRORS_SCHEMA' in content
    
    if needs_paginate and not has_no_errors_schema and 'NgxPaginationModule' not in content:
        content = add_import(content, "import { NgxPaginationModule } from 'ngx-pagination';")
        content = add_to_imports_array(content, 'NgxPaginationModule')
    
    # Add CommonModule (for DatePipe) if needed - check if file uses DatePipe
    if 'DatePipe' in content and not has_no_errors_schema:
        if 'CommonModule' not in content:
            content = add_import(content, "import { CommonModule } from '@angular/common';")
            content = add_to_imports_array(content, 'CommonModule')
        elif 'providers: [DatePipe' not in content and 'provide: DatePipe' not in content:
            # Already has CommonModule import, just add to imports array
            content = add_to_imports_array(content, 'CommonModule')
    
    # Add MatNativeDateModule for DateAdapter
    if 'MzDatePicker' in f or 'date-picker' in f:
        if 'MatNativeDateModule' not in content:
            content = add_import(content, "import { MatNativeDateModule } from '@angular/material/core';")
            content = add_to_imports_array(content, 'MatNativeDateModule')
    
    # Add MatDialogRef stub if it uses MatDialogRef
    if 'MatDialogRef' in content and 'provide: MatDialogRef' not in content and 'useValue' not in content.split('MatDialogRef')[1][:50]:
        if 'import { MatDialogRef' not in content:
            content = add_import(content, "import { MatDialogRef } from '@angular/material/dialog';")
        content = add_to_providers_array(content, "{ provide: MatDialogRef, useValue: { close: () => {}, afterClosed: () => ({ subscribe: (_: any) => {} }) } }")
    
    # Add NgbActiveModal stub
    if 'NgbActiveModal' in content and 'provide: NgbActiveModal' not in content:
        if 'import { NgbActiveModal' not in content:
            content = add_import(content, "import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';")
        content = add_to_providers_array(content, "{ provide: NgbActiveModal, useValue: { close: () => {}, dismiss: () => {} } }")
    
    if content != original:
        with open(f, 'w') as fh:
            fh.write(content)
        print('Fixed: ' + f)
        fixed_files += 1

print('Total: ' + str(fixed_files) + ' files fixed')
