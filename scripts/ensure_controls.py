import os

TOOLS_DIR = '/Users/mohankumar/personal/devtools-site/src/components/tools'

def ensure_controls(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    if '<ToolShell' not in content:
        return False
        
    if 'const controls =' in content:
        return False # Already exists
        
    # It does NOT have controls defined, but uses ToolShell.
    # We should inject it before the return.
    
    # Simple heuristic: Find `return (`
    return_idx = content.find('return (')
    if return_idx == -1:
         return_idx = content.find('return <ToolShell')
         
    if return_idx == -1:
        print(f"Skipping {filepath}: No return found")
        return False
        
    # Inject
    content = content[:return_idx] + "  const controls = null;\n\n  " + content[return_idx:]
    
    with open(filepath, 'w') as f:
        f.write(content)
    return True

if __name__ == "__main__":
    files = [f for f in os.listdir(TOOLS_DIR) if f.endswith('.tsx')]
    count = 0
    for f in files:
        if ensure_controls(os.path.join(TOOLS_DIR, f)):
             print(f"Fixed {f}")
             count += 1
    print(f"Total fixed: {count}")
