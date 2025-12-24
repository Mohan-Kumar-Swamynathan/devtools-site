import os

TOOLS_DIR = '/Users/mohankumar/personal/devtools-site/src/components/tools'

def cleanup_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    unique_lines = []
    seen_imports = set()
    modified = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith('import '):
            if stripped in seen_imports:
                modified = True
                continue # Skip duplicate
            seen_imports.add(stripped)
            unique_lines.append(line)
        else:
            unique_lines.append(line)

    if modified:
        with open(filepath, 'w') as f:
            f.writelines(unique_lines)
        return True
    return False

if __name__ == "__main__":
    files = [f for f in os.listdir(TOOLS_DIR) if f.endswith('.tsx')]
    count = 0
    for f in files:
        if cleanup_file(os.path.join(TOOLS_DIR, f)):
            print(f"Cleaned {f}")
            count += 1
    print(f"Total cleaned: {count}")
