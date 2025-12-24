import re
import os

# Paths
TOOLS_TS = '/Users/mohankumar/personal/devtools-site/src/lib/tools.ts'
PAGES_DIR = '/Users/mohankumar/personal/devtools-site/src/pages'

def get_registered_slugs():
    with open(TOOLS_TS, 'r') as f:
        content = f.read()
    
    # Simple regex to find slugs in the tools array
    # Looking for: slug: 'some-slug'
    matches = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", content)
    return set(matches)

def get_existing_pages():
    files = os.listdir(PAGES_DIR)
    pages = set()
    for f in files:
        if f.endswith('.astro'):
            slug = f.replace('.astro', '')
            pages.add(slug)
    return pages

def audit():
    registered = get_registered_slugs()
    existing = get_existing_pages()
    
    missing_pages = registered - existing
    orphan_pages = existing - registered
    
    print(f"Total Registered Tools: {len(registered)}")
    print(f"Total Existing Pages: {len(existing)}")
    
    if missing_pages:
        print("\n[MISSING PAGES] The following tools are registered but have no page:")
        for page in sorted(missing_pages):
            print(f"- {page}")
    else:
        print("\n[OK] All registered tools have pages.")
        
    if orphan_pages:
        print("\n[ORPHANS] The following pages exist but are not registered in tools.ts:")
        for page in sorted(orphan_pages):
            # Ignore standard pages
            if page in ['index', '404', 'about', 'privacy', 'terms']:
                continue
            print(f"- {page}")

if __name__ == "__main__":
    audit()
