#!/usr/bin/env python3
import os
import re
import glob

MODULES_TO_ADD = [
    # (import_statement, module_name_in_imports)
    ("import { MatDialogModule } from '@angular/material/dialog';", 'MatDialogModule'),
]

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Add MatDialogModule to every spec that has TestBed.configureTestingModule
    # and doesn't already have it
    if 'TestBed.configureTestingModule' not in content:
        return False
    
    for import_stmt, module_name in MODULES_TO_ADD:
        has_import = import_stmt in content or ("import.*" + module_name) in content
        # Check more precisely
        has_import = bool(re.search(r'import.*' + module_name + r'.*from', content))
        has_in_imports = module_name in content
        
        if has_in_imports:
            continue  # already has it
        
        # Add the import statement after the first import line
        first_import_match = re.search(r'^import\s', content, re.MULTILINE)
        if first_import_match:
            pos = content.index('\n', first_import_match.start()) + 1
            content = content[:pos] + import_stmt + '\n' + content[pos:]
        
        # Add module_name to imports: [...] in TestBed
        # Replace first occurrence of: imports: [
        content = re.sub(
            r'(imports:\s*\[)',
            r'\1' + module_name + ', ',
            content,
            count=1
        )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


spec_files = glob.glob('src/app/**/*.spec.ts', recursive=True)

fixed = 0
for f in sorted(set(spec_files)):
    try:
        if fix_file(f):
            print('Fixed: ' + f)
            fixed += 1
    except Exception as e:
        print('ERROR ' + f + ': ' + str(e))

print('\nTotal fixed: ' + str(fixed))

    needs_http = 'HttpClientTestingModule' in content
    needs_router = 'RouterTestingModule' in content
    
    has_http_import = bool(re.search(r"import.*HttpClientTestingModule.*from.*'@angular/common/http/testing'", content))
    has_router_import = bool(re.search(r"import.*RouterTestingModule.*from.*'@angular/router/testing'", content))
    
    lines_to_add = []
    if needs_http and not has_http_import:
        lines_to_add.append("import { HttpClientTestingModule } from '@angular/common/http/testing';")
    if needs_router and not has_router_import:
        lines_to_add.append("import { RouterTestingModule } from '@angular/router/testing';")
    
    if lines_to_add:
        first_import_match = re.search(r'^import\s', content, re.MULTILINE)
        if first_import_match:
            pos = content.index('\n', first_import_match.start()) + 1
            content = content[:pos] + '\n'.join(lines_to_add) + '\n' + content[pos:]
        else:
            content = '\n'.join(lines_to_add) + '\n' + content
    
    return content


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Fix missing imports
    content = fix_missing_imports(content)
    
    # 2. Fix duplicate schemas in multiline TestBed blocks
    # Pattern: schemas: [...]\n...schemas: [...]
    content = re.sub(
        r'(schemas:\s*\[NO_ERRORS_SCHEMA\])\s*,\s*\n(\s*schemas:\s*\[NO_ERRORS_SCHEMA\])',
        r'\1',
        content
    )
    content = re.sub(
        r'(schemas:\s*\[NO_ERRORS_SCHEMA\]),?\s*\n\s*schemas:\s*\[NO_ERRORS_SCHEMA\]',
        r'\1',
        content
    )
    
    # 3. Fix duplicate imports in multiline TestBed blocks
    # The script added: imports: [HttpClientTestingModule, RouterTestingModule],
    # Then on next lines there was already: imports: [something]
    # Find pattern: imports: [new stuff],\n...imports: [old stuff]
    # We want to merge: remove the second imports: line and merge its content into first
    
    def fix_duplicate_imports(m):
        block = m.group(0)
        imports_matches = list(re.finditer(r'imports:\s*\[([^\]]*)\]', block))
        if len(imports_matches) < 2:
            return block
        
        # Merge all import arrays
        all_items = []
        for im in imports_matches:
            arr = im.group(1)
            items = [i.strip().rstrip(',') for i in re.split(r',\s*', arr.strip()) if i.strip()]
            for item in items:
                if item and item not in all_items:
                    all_items.append(item)
        
        merged = ', '.join(all_items)
        
        # Remove all imports: [...] entries from block
        block = re.sub(r',?\s*\n?\s*imports:\s*\[[^\]]*\]', '', block)
        
        # Add back once, after declarations if present
        if 'declarations:' in block:
            block = re.sub(r'(declarations:\s*\[[^\]]*\])', r'\1,\n      imports: [' + merged + ']', block, count=1)
        elif 'providers:' in block:
            block = re.sub(r'(\{)', r'\1\n      imports: [' + merged + '],', block, count=1)
        else:
            # Find the opening brace
            block = re.sub(r'(\{)', r'\1\n      imports: [' + merged + '],', block, count=1)
        
        return block
    
    # Apply to TestBed blocks (with possible nested objects)
    content = re.sub(
        r'TestBed\.configureTestingModule\(\s*\{[^{}]*\}\s*\)',
        fix_duplicate_imports,
        content,
        flags=re.DOTALL
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


spec_files = glob.glob('src/app/**/*.spec.ts', recursive=True)

fixed = 0
for f in sorted(set(spec_files)):
    try:
        if fix_file(f):
            print('Fixed: ' + f)
            fixed += 1
    except Exception as e:
        print('ERROR ' + f + ': ' + str(e))

print('\nTotal fixed: ' + str(fixed))
