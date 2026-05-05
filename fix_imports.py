#!/usr/bin/env python3
import glob, re

spec_files = glob.glob('src/app/**/*.spec.ts', recursive=True)
fixed = 0

for f in sorted(set(spec_files)):
    with open(f, 'r') as fh:
        content = fh.read()
    original = content
    
    # Check which services are used in provide: but not imported
    uses_ds = bool(re.search(r'provide.*DataSharingService', content))
    uses_cs = bool(re.search(r'provide.*ConsultantService', content))
    
    has_ds_import = bool(re.search(r"import.*DataSharingService.*from", content))
    has_cs_import = bool(re.search(r"import.*ConsultantService.*from", content))
    
    lines_to_add = []
    if uses_ds and not has_ds_import:
        lines_to_add.append("import { DataSharingService } from 'src/app/service/data-sharing.service';")
    if uses_cs and not has_cs_import:
        lines_to_add.append("import { ConsultantService } from 'src/app/service/consultant.service';")
    
    if lines_to_add:
        first_import_match = re.search(r'^import\s', content, re.MULTILINE)
        if first_import_match:
            pos = content.index('\n', first_import_match.start()) + 1
            content = content[:pos] + '\n'.join(lines_to_add) + '\n' + content[pos:]
        else:
            content = '\n'.join(lines_to_add) + '\n' + content
    
    if content != original:
        with open(f, 'w') as fh:
            fh.write(content)
        print('Fixed: ' + f)
        fixed += 1

print('Total: ' + str(fixed))
