#!/usr/bin/env python3
"""
Fix ALL spec files that have DataSharingService stub but not addInfo.
Uses a line-by-line approach to find and replace the DS stub block.
"""
import os
import glob

FULL_DS_STUB_LINES = '''          userConnected: { esn: { id: 1 }, role: 'ADMIN' },
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
'''

def fix_ds_stub_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find the line with "provide: DataSharingService, useValue: {"
    start_idx = None
    for i, line in enumerate(lines):
        if 'provide: DataSharingService' in line and 'useValue:' in line:
            start_idx = i
            break
    
    if start_idx is None:
        return False  # No DS stub found
    
    # Already has addInfo? Skip
    content = ''.join(lines)
    if 'addInfo: () =>' in content:
        return False
    
    # Find the end of the DS stub block - look for the closing "} }," or "} }"
    # The stub block starts at start_idx and ends when we find a line that matches "        } },"
    end_idx = None
    for i in range(start_idx + 1, min(start_idx + 30, len(lines))):
        stripped = lines[i].strip()
        if stripped in ('} },', '} }', '} })'): 
            end_idx = i
            break
    
    if end_idx is None:
        print(f"  WARN: Could not find end of DS stub in {filepath}")
        return False
    
    # Build the new DS provide block
    # Use the indentation from start_idx line
    indent = len(lines[start_idx]) - len(lines[start_idx].lstrip())
    base_indent = ' ' * indent
    
    new_lines = lines[:start_idx]
    new_lines.append(base_indent + '{ provide: DataSharingService, useValue: {\n')
    new_lines.append(FULL_DS_STUB_LINES)
    new_lines.append(base_indent + '} },\n')
    new_lines.extend(lines[end_idx + 1:])
    
    new_content = ''.join(new_lines)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

# Process all spec files
spec_files = glob.glob('src/**/*.spec.ts', recursive=True)
fixed = 0
for f in sorted(spec_files):
    if fix_ds_stub_in_file(f):
        print(f"  FIXED: {f}")
        fixed += 1

print(f"\nTotal fixed: {fixed}")
