#!/usr/bin/env python3
import glob, re

DS_STUB = "{ provide: DataSharingService, useValue: { userConnected: {}, logger: { debug: () => {} } } }"
CS_STUB = "{ provide: ConsultantService, useValue: {} }"

spec_files = glob.glob('src/app/**/*.spec.ts', recursive=True)
fixed = 0

for f in sorted(set(spec_files)):
    with open(f, 'r') as fh:
        content = fh.read()
    
    if 'TestBed.configureTestingModule' not in content:
        continue
    
    original = content
    ds_already_stubbed = bool(re.search(r'provide.*DataSharingService.*useValue', content))
    cs_already_stubbed = bool(re.search(r'provide.*ConsultantService.*useValue', content))
    
    stubs_to_add = []
    if not ds_already_stubbed:
        stubs_to_add.append(DS_STUB)
    if not cs_already_stubbed:
        stubs_to_add.append(CS_STUB)
    
    if not stubs_to_add:
        continue
    
    stubs_str = ',\n        '.join(stubs_to_add)
    providers_match = re.search(r'providers:\s*\[', content)
    
    if providers_match:
        content = content[:providers_match.end()] + '\n        ' + stubs_str + ',' + content[providers_match.end():]
    else:
        schemas_match = re.search(r'(schemas:\s*\[[^\]]*\])', content)
        if schemas_match:
            content = content[:schemas_match.end()] + ',\n      providers: [\n        ' + stubs_str + '\n      ]' + content[schemas_match.end():]
    
    if content != original:
        with open(f, 'w') as fh:
            fh.write(content)
        print('Fixed: ' + f)
        fixed += 1

print('Total: ' + str(fixed))
