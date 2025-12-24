import os

ALIASES = {
    'base64-image-converter': 'ImageToBase64',
    'code-formatter': 'JsFormatter', 
    'color-shades-generator': 'ColorPaletteGenerator',
    'css-clip-path-generator': 'ClipPathGenerator',
    'http-request-builder': 'ApiTester',
    'json-compare': 'JsonDiff',
    'json-to-graphql': 'JsonToTypescript',
    'markdown-editor': 'MarkdownPreview',
    'regex-replacer': 'TextReplacer',
    'sql-query-formatter': 'SqlFormatter',
    'webhook-builder': 'ApiMockBuilder'
}

def create_pages():
    for slug, component in ALIASES.items():
        filename = f"src/pages/{slug}.astro"
        
        # Using f-strings is much cleaner for this than .format() on a big blob
        content = f"""---
import BaseLayout from '@/layouts/BaseLayout.astro';
import ToolLayout from '@/layouts/ToolLayout.astro';
import {component} from '@/components/tools/{component}'; 

import {{ tools }} from '@/lib/tools';

const toolData = tools.find(t => t.slug === '{slug}') || tools.find(t => t.id === '{slug}');
---

<BaseLayout
  title={{toolData?.name || '{slug}'}}
  description={{toolData?.description || ''}}
  toolData={{toolData}}
>
  <ToolLayout tool={{toolData}}>
    <{component} client:load />
  </ToolLayout>
</BaseLayout>
"""
        with open(filename, 'w') as f:
            f.write(content)
        print(f"Created {filename}")

if __name__ == "__main__":
    create_pages()
