import os
import re

TOOLS_DIR = '/Users/mohankumar/personal/devtools-site/src/components/tools'

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove all existing "const controls = null;"
    # We use a loop to catch multiples
    new_content = re.sub(r'\s*const controls = null;\s*', '\n\n  ', content)
    
    # 2. Check if we have a real "const controls =" definition
    # Regex for `const controls = (` or `const controls = <` or `const controls = someVar`
    # We want to avoid matching if we just removed the null ones.
    # If `const controls` still exists, it's a real one, so we are done.
    if re.search(r'const controls\s*=', new_content):
        # We might have removed the null ones, so we should save if changed.
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            return True, "Cleaned duplicates, real controls exist"
        return False, "Has real controls"

    # 3. Inject "const controls = null;" at the right place
    # We look for `return (<ToolShell` or `return <ToolShell`
    # This ensures we are in the component returning the shell.
    
    pattern = r'(return\s*\(\s*<ToolShell|return\s*<ToolShell)'
    match = re.search(pattern, new_content)
    
    if not match:
        return False, "No ToolShell return found"
        
    insert_pos = match.start()
    
    # Inject
    final_content = new_content[:insert_pos] + "const controls = null;\n\n  " + new_content[insert_pos:]
    
    with open(filepath, 'w') as f:
        f.write(final_content)
        
    return True, "Injected controls = null"

if __name__ == "__main__":
    files = [f for f in os.listdir(TOOLS_DIR) if f.endswith('.tsx')]
    count = 0
    clean_count = 0
    for f in files:
        if f == "ToolShell.tsx": continue
        changed, msg = fix_file(os.path.join(TOOLS_DIR, f))
        if changed:
             print(f"Fixed {f}: {msg}")
             count += 1
    print(f"Total processed: {count}")
