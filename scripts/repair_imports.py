import os

TOOLS_DIR = '/Users/mohankumar/personal/devtools-site/src/components/tools'

def repair_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    has_shell_import = False
    has_toast_import = False
    
    # scan for existing TOP LEVEL imports
    # heuristic: imports usually happen in the first 50 lines?
    # No, let's just clean up first.
    
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        # Remove the bad lines wherever they are
        if stripped == "import ToolShell from './ToolShell';":
            continue
        if stripped == "import { useToast } from '@/hooks/useToast';":
            continue
        cleaned_lines.append(line)

    # Now re-add them at the top
    # Find the last valid import
    last_import_index = 0
    for i, line in enumerate(cleaned_lines):
        if line.strip().startswith('import ') and not line.strip().startswith('import type'):
             last_import_index = i
    
    # Insert safely
    cleaned_lines.insert(last_import_index + 1, "import ToolShell from './ToolShell';\n")
    cleaned_lines.insert(last_import_index + 2, "import { useToast } from '@/hooks/useToast';\n")
    
    # Write back
    with open(filepath, 'w') as f:
        f.writelines(cleaned_lines)
    return True

if __name__ == "__main__":
    files = [f for f in os.listdir(TOOLS_DIR) if f.endswith('.tsx')]
    count = 0
    for f in files:
        if repair_file(os.path.join(TOOLS_DIR, f)):
             count += 1
    print(f"Repaired {count} files")
