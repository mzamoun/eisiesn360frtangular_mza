#!/usr/bin/env python3
import os
import re
import glob

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    if 'TestBed.configureTestingModule' not in content:
        return False
    
    # Add MatDialogModule if not already present
    if 'MatDialogModule' not in content:
        import_stmt = "import { MatDialogModule } from '@angular/material/dialog';"
        # Add the import statement after the first import line
        first_import_match = re.search(r'^import\s', content, re.MULTILINE)
        if first_import_match:
            pos = content.index('\n', first_import_match.start()) + 1
            content = content[:pos] + import_stmt + '\n' + content[pos:]
        
        # Add MatDialogModule to the first imports: [...] in TestBed
        content = re.sub(
            r'(imports:\s*\[)',
            r'\1MatDialogModule, ',
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
