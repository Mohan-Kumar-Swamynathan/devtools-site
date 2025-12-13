#!/usr/bin/env node

/**
 * Script to generate all tool pages from tools.ts
 * Run: node scripts/generate-tool-pages.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read tools.ts to extract tool data
const toolsPath = join(rootDir, 'src/lib/tools.ts');
const toolsContent = readFileSync(toolsPath, 'utf-8');

// Extract tools array (simplified regex extraction)
const toolsMatch = toolsContent.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
if (!toolsMatch) {
  console.error('Could not find tools array in tools.ts');
  process.exit(1);
}

// Parse tools (simplified - in production, use a proper TypeScript parser)
const tools = [];
const toolRegex = /{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = toolRegex.exec(toolsContent)) !== null) {
  tools.push({
    id: match[1],
    slug: match[2],
    name: match[3]
  });
}

// Template for tool page
const toolPageTemplate = (tool) => `---
import ToolLayout from '@/layouts/ToolLayout.astro';
import ToolCard from '@/components/common/ToolCard.astro';
import { getToolBySlug, getToolsByCategory } from '@/lib/tools';

const tool = getToolBySlug('${tool.slug}')!;
const relatedTools = getToolsByCategory(tool.category.id).filter(t => t.id !== tool.id).slice(0, 4);
---

<ToolLayout tool={tool}>
  <!-- TODO: Import and add tool component here -->
  <!-- Example: <JsonFormatter client:load /> -->
  
  <div class="p-6 text-center" style="color: var(--text-muted);">
    <p>Tool component coming soon...</p>
  </div>

  <Fragment slot="seo-content">
    <h2>About ${tool.name}</h2>
    <p>
      ${tool.description || 'A useful developer tool.'}
    </p>
  </Fragment>

  <Fragment slot="related-tools">
    <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
      {relatedTools.map(t => <ToolCard {...t} />)}
    </div>
  </Fragment>
</ToolLayout>
`;

// Generate pages
const pagesDir = join(rootDir, 'src/pages');
let generated = 0;
let skipped = 0;

tools.forEach(tool => {
  const pagePath = join(pagesDir, `${tool.slug}.astro`);
  
  // Skip if page already exists
  if (existsSync(pagePath)) {
    console.log(`⏭️  Skipping ${tool.slug}.astro (already exists)`);
    skipped++;
    return;
  }
  
  // Generate page
  const content = toolPageTemplate(tool);
  writeFileSync(pagePath, content, 'utf-8');
  console.log(`✅ Generated ${tool.slug}.astro`);
  generated++;
});

console.log(`\n✨ Done! Generated ${generated} pages, skipped ${skipped} existing pages.`);
console.log(`\n⚠️  Note: You'll need to create the tool components and import them in each page.`);


