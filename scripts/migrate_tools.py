import re
import os

TOOLS_DIR = '/Users/mohankumar/personal/devtools-site/src/components/tools'

# Template parts
IMPORT_SHELL = "import ToolShell from './ToolShell';\n"
IMPORT_TOAST = "import { useToast } from '@/hooks/useToast';\n"

def migrate_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if 'ToolShell' in content:
        return False

    # 1. Add Imports
    if "import ToolShell" not in content:
        last_import = content.rfind("import ")
        end_of_line = content.find("\n", last_import)
        content = content[:end_of_line+1] + IMPORT_SHELL + IMPORT_TOAST + content[end_of_line+1:]

    # 2. Add hook
    if "useToast" not in content:
        func_match = re.search(r'export default function \w+\(\) \{', content)
        if func_match:
            end = func_match.end()
            content = content[:end] + "\n  const { showToast } = useToast();" + content[end:]

    # 3. Identify and Extract Controls
    # We look for the standard "Actions" div: <div className="flex flex-wrap items-center gap-3">
    # We will replace it with {null} in the main body and add it to a controls variable
    
    controls_start_marker = '<div className="flex flex-wrap items-center gap-3">'
    controls_start = content.find(controls_start_marker)
    
    controls_jsx = "  const controls = null;"
    
    if controls_start != -1:
        # Simple extraction: Find the closing div. This is risky without a real parser.
        # However, these files are very regular.
        # We'll count braces/divs? No, let's just assume it spans until the matching </div> at the same indent? 
        # Most of them are 1-level deep in the action block.
        
        # Heuristic: Read line by line from start until we find likely closing div
        lines = content.split('\n')
        start_line_idx = -1
        for i, line in enumerate(lines):
            if controls_start_marker in line:
                start_line_idx = i
                break
        
        if start_line_idx != -1:
            # Find closing div. It's usually indented.
            # <div ...>
            #   <button>...</button>
            # </div>
            
            # Let's count open/close divs
            block_lines = []
            open_divs = 0
            found_end = False
            end_line_idx = -1
            
            for i in range(start_line_idx, len(lines)):
                line = lines[i]
                open_divs += line.count('<div')
                open_divs -= line.count('</div>')
                block_lines.append(line)
                
                if open_divs == 0:
                    end_line_idx = i
                    found_end = True
                    break
            
            if found_end:
                # Extracted block
                full_block = '\n'.join(block_lines)
                
                # Transform block for Header:
                # Remove "flex-wrap", change gap-3 to gap-2 maybe?
                # Actually ToolShell handles the container. We just need the inner buttons?
                # No, ToolShell accepts a `controls` node.
                # We should strip the wrapper div and just keep children?
                # Or keep the wrapper but style it 'flex items-center gap-3' without wrap for the header.
                
                inner_content = full_block.replace(controls_start_marker, '<div className="flex items-center gap-3">')
                
                controls_jsx = f"""
  const controls = (
    {inner_content}
  );"""
                
                # Remove from lines
                 # Replace the range with nothing or null
                lines[start_line_idx] = "{/* Controls moved to header */}"
                for k in range(start_line_idx + 1, end_line_idx + 1):
                    lines[k] = ""
                
                content = '\n'.join(lines)
                
                # Inject controls variable before return
                return_idx = content.find('return (')
                content = content[:return_idx] + controls_jsx + "\n\n  " + content[return_idx:]

    # 4. Wrap Return in ToolShell
    # Replace <div className="space-y-6"> with <ToolShell controls={controls}>
    # And closing </div> with </ToolShell>
    
    # We find the FIRST space-y-6 div in the return
    root_div_marker = '<div className="space-y-6">'
    root_start = content.find(root_div_marker)
    
    if root_start != -1:
        content = content.replace(root_div_marker, f'<ToolShell className="space-y-6" controls={{controls}}>', 1)
        # Find the LAST closing div? 
        # Usually the last line before '  );' is '    </div>'
        last_div_idx = content.rfind('</div>')
        # This is risky.
        # Let's target the exact string pattern '    </div>\n  );'
        end_pattern = re.compile(r'</div>\s*\);\s*}$')
        # content = re.sub(r'</div>\s*\);\s*}$', '</ToolShell>\n  );\n}', content) 
        # Actually, let's just do a string replacement of the matching closing tag if we can pair it.
        # Given the file structure is:
        # return (
        #   <div class="space-y-6">
        #      ...
        #   </div>
        # );
        # We can find the last </div> before );
        
        matches = list(re.finditer(r'</div>\s*\)', content))
        if matches:
            last_match = matches[-1]
            content = content[:last_match.start()] + '</ToolShell>\n  )' + content[last_match.end():]

    with open(filepath, 'w') as f:
        f.write(content)
        
    return True

if __name__ == "__main__":
    files = [f for f in os.listdir(TOOLS_DIR) if f.endswith('.tsx')]
    count = 0
    for f in files:
        if migrate_file(os.path.join(TOOLS_DIR, f)):
            print(f"Migrated {f}")
            count += 1
    print(f"Total migrated: {count}")
