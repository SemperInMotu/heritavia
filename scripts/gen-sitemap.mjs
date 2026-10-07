import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, absoluteUrl, alternatesFor } from '../lib/page-map.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function urlEntry(loc, pageId, priority) {
  const alts = alternatesFor(pageId)
    .map((a) => `      <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join('\n');
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    alts,
    `    <changefreq>monthly</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

function wrap(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}

function priorityFor(id) {
  if (id === 'home') return '1.0';
  if (id === 'research' || id === 'guides' || id === 'start') return '0.8';
  return '0.6';
}

const enEntries = Object.keys(PAGES)
  .filter((id) => PAGES[id].en)
  .map((id) => urlEntry(absoluteUrl(id, 'en'), id, priorityFor(id)));
writeFileSync(resolve(root, 'public/sitemap.xml'), wrap(enEntries), 'utf8');
console.log(`public/sitemap.xml — ${enEntries.length} EN urls`);

const belEntries = [];
for (const id of Object.keys(PAGES)) {
  if (PAGES[id].be) belEntries.push(urlEntry(absoluteUrl(id, 'be'), id, id === 'home' ? '1.0' : '0.7'));
  if (PAGES[id].ru) belEntries.push(urlEntry(absoluteUrl(id, 'ru'), id, id === 'home' ? '1.0' : '0.7'));
}
mkdirSync(resolve(root, 'public'), { recursive: true });
writeFileSync(resolve(root, 'public/sitemap-bel.xml'), wrap(belEntries), 'utf8');
console.log(`public/sitemap-bel.xml — ${belEntries.length} RU+BE urls`);
