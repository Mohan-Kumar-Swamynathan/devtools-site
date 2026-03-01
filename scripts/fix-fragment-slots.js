#!/usr/bin/env node
/**
 * Replace <Fragment slot="..."> with <div slot="..."> in all tool pages
 * to fix Astro parser panic "originalIM was set twice"
 */
import { readFileSync, writeFileSync } from 'fs';
import { readdirSync } from 'fs';
import { join } from 'path';

const pagesDir = join(process.cwd(), 'src', 'pages');
const files = readdirSync(pagesDir).filter((f) => f.endsWith('.astro'));

let total = 0;
for (const file of files) {
  const path = join(pagesDir, file);
  let content = readFileSync(path, 'utf8');
  if (!content.includes('Fragment slot=')) continue;

  // 1. Collapse related-tools: Fragment + inner div -> single div
  content = content.replace(
    /<Fragment slot="related-tools">\s*\n\s*<div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">/g,
    '<div slot="related-tools" class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">'
  );
  // Remove inner </div> and </Fragment> for related-tools (single occurrence per file)
  content = content.replace(/\n\s*<\/div>\s*\n\s*<\/Fragment>/g, '\n  </div>');

  // 2. Replace opening Fragment tags
  content = content.replace(/<Fragment slot="seo-content">/g, '<div slot="seo-content">');
  content = content.replace(/<Fragment slot="faq">/g, '<div slot="faq">');

  // 3. Replace any remaining </Fragment> with </div>
  content = content.replace(/<\/Fragment>/g, '</div>');

  writeFileSync(path, content);
  total++;
}

console.log(`Updated ${total} files.`);
