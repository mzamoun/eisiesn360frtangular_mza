#!/usr/bin/env python3
"""Update DataSharingService and ConsultantService stubs to have more complete method mocks."""
import glob, re

# Old DS stub pattern
OLD_DS_STUB = "{ provide: DataSharingService, useValue: { userConnected: {}, logger: { debug: () => {} } } }"

# New comprehensive DS stub
NEW_DS_STUB = """{ provide: DataSharingService, useValue: {
          userConnected: { esn: {}, role: 'ADMIN' },
          userConnected$: { subscribe: (_: any) => {} },
          logger: { debug: () => {}, error: () => {}, info: () => {} },
          clearErrors: () => {},
          addError: () => {},
          addErrorTxt: () => {},
          isLoggedIn: () => true,
          getLastUserName: () => 'test',
          majManagerOfUserCurent: () => {}
        } }"""

spec_files = glob.glob('src/app/**/*.spec.ts', recursive=True)
fixed = 0

for f in sorted(set(spec_files)):
    with open(f, 'r') as fh:
        content = fh.read()
    original = content
    
    if OLD_DS_STUB in content:
        content = content.replace(OLD_DS_STUB, NEW_DS_STUB)
    
    if content != original:
        with open(f, 'w') as fh:
            fh.write(content)
        print('Fixed: ' + f)
        fixed += 1

print('Total: ' + str(fixed))
