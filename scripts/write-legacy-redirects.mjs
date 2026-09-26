/**
 * Write legacy *.html redirect stubs into public/ for old bookmarks.
 * SITE=com → EN only (no /ru /be on heritavia.com)
 * SITE=bel → BE root + /ru/ stubs for родословная.бел
 */
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LEGACY_TO_ID, pathFor, absoluteUrl } from '../lib/page-map.js';
import { isCom } from '../lib/site-mode.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = resolve(root, 'public');

function stub(target, canonical, lang) {
  const label = lang === 'ru' ? 'Продолжить' : lang === 'be' ? 'Працягнуць' : 'Continue';
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${target}" />
    <link rel="canonical" href="${canonical}" />
    <title>Redirect…</title>
    <script>location.replace('${target}');</script>
  </head>
  <body>
    <p><a href="${target}">${label}</a></p>
  </body>
</html>
`;
}

function write(rel, html) {
  const dest = resolve(pub, rel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html, 'utf8');
}

function wipe(rel) {
  const dest = resolve(pub, rel);
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
}

if (isCom) {
  wipe('ru');
  wipe('be');
  for (const [legacy, id] of Object.entries(LEGACY_TO_ID)) {
    const target = pathFor(id, 'en');
    write(legacy, stub(target, absoluteUrl(id, 'en'), 'en'));
    write(`en/${legacy}`, stub(target, absoluteUrl(id, 'en'), 'en'));
  }
  write('en/index.html', stub('/', absoluteUrl('home', 'en'), 'en'));
  console.log('legacy redirects → public/ (EN only / .com; wiped public/ru + public/be)');
} else {
  for (const [legacy, id] of Object.entries(LEGACY_TO_ID)) {
    write(legacy, stub(pathFor(id, 'be'), absoluteUrl(id, 'be'), 'be'));
    write(`ru/${legacy}`, stub(pathFor(id, 'ru'), absoluteUrl(id, 'ru'), 'ru'));
  }
  console.log('legacy redirects → public/ (BE+RU / .bel)');
}
