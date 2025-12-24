import os
import re

TOOLS_DIR = '/Users/mohankumar/personal/devtools-site/src/components/tools'

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Regex to find the controls block. 
    # It starts with "const controls = (" and ends with ");"
    # We need to capture the inner content roughly.
    # Since it might contain nested parenthesis, standard regex is hard.
    # But we know it ends with `  );\n\n  return (` or similar based on my previous script?
    # No, my previous script injected: `\n  const controls = (\n ... \n  );\n\n  `
    
    # Let's find the start
    start_marker = "  const controls = ("
    start_idx = content.find(start_marker)
    
    if start_idx == -1:
        return False
        
    # Find the end of this block. 
    # It effectively ends with `  );\n`?
    # Let's count parens to be safe, or just look for the semicolon line indent.
    # The indentation is 2 spaces usually.
    # So `  );`
    
    end_marker = "  );\n"
    end_idx = content.find(end_marker, start_idx)
    
    if end_idx == -1:
        # Try with different spacing
        end_marker = ");\n"
        end_idx = content.find(end_marker, start_idx)
    
    if end_idx == -1:
        print(f"Skipping {filepath}: Could not find end of controls block")
        return False
        
    # Extract the block
    block_end = end_idx + len(end_marker)
    controls_block = content[start_idx:block_end]
    
    # Now remove it from original location
    # We need to be careful not to leave weird artifacts.
    # content_without_block = content[:start_idx] + content[block_end:]
    
    # But wait, we only want to move it IF it's in the wrong place.
    # What defines the "Right Place"?
    # Immediately before `return (<ToolShell` or `return <ToolShell`.
    
    # Let's find the main return
    # HEURISTIC: The return that returns ToolShell.
    tool_shell_return = content.find("return (\n    <ToolShell") # Standard formatting
    if tool_shell_return == -1:
        tool_shell_return = content.find("return (\n    <ToolShell") # Maybe spaces are different
    
    # Try Regex for main return
    # return (
    #   <ToolShell
    main_return_match = re.search(r'return \(\s*<ToolShell', content)
    
    if not main_return_match:
        # Maybe it's `return <ToolShell`
        main_return_match = re.search(r'return <ToolShell', content)
        
    if not main_return_match:
        print(f"Skipping {filepath}: Could not find main ToolShell return")
        return False
        
    return_pos = main_return_match.start()
    
    # Check if controls block is already immediately before return_pos
    # Allow some whitespace
    between_content = content[block_end:return_pos]
    if not between_content.strip():
        # It's already in the right place
        return False
        
    # It is NOT in the right place (there is code between them).
    # So we move it.
    
    # 1. Remove from old spot
    content_step1 = content[:start_idx] + content[block_end:]
    
    # 2. Re-calculate return pos in new string
    main_return_match2 = re.search(r'return \(\s*<ToolShell', content_step1)
    if not main_return_match2:
         main_return_match2 = re.search(r'return <ToolShell', content_step1)
    
    if not main_return_match2:
        # Should not happen
        return False
        
    insert_pos = main_return_match2.start()
    
    # 3. Insert
    final_content = content_step1[:insert_pos] + controls_block + "\n  " + content_step1[insert_pos:]
    
    with open(filepath, 'w') as f:
        f.write(final_content)
        
    return True

if __name__ == "__main__":
    files = [f for f in os.listdir(TOOLS_DIR) if f.endswith('.tsx')]
    count = 0
    for f in files:
        if fix_file(os.path.join(TOOLS_DIR, f)):
             print(f"Fixed {f}")
             count += 1
    print(f"Total fixed: {count}")
