import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { LEGACY_TO_ID, absoluteUrl } from '../lib/page-map.js';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2] === 'com' ? 'com' : 'bel';
const env = { ...process.env, SITE: target, NEXT_PUBLIC_SITE: target };
const node = process.execPath;
const nextBin = resolve(site, 'node_modules/next/dist/bin/next');

function run(args) {
  const r = spawnSync(node, args, { cwd: site, env, stdio: 'inherit' });
  if (r.status) process.exit(r.status ?? 1);
}

/** Cross-host handoff: old /ru /be bookmarks on heritavia.com → родословная.бел */
function writeComCrossHostRedirects() {
  const out = resolve(site, 'out');
  for (const dir of ['ru', 'be']) {
    const p = resolve(out, dir);
    if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }

  function stub(target, lang) {
    const label = lang === 'ru' ? 'Продолжить' : 'Працягнуць';
    return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${target}" />
    <link rel="canonical" href="${target}" />
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
    const dest = resolve(out, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, html, 'utf8');
  }

  write('ru/index.html', stub(absoluteUrl('home', 'ru'), 'ru'));
  write('be/index.html', stub(absoluteUrl('home', 'be'), 'be'));
  for (const [legacy, id] of Object.entries(LEGACY_TO_ID)) {
    write(`ru/${legacy}`, stub(absoluteUrl(id, 'ru'), 'ru'));
    write(`be/${legacy}`, stub(absoluteUrl(id, 'be'), 'be'));
  }
  console.log('com out/: /ru/* and /be/* → родословная.бел (no local copies)');
}

run([resolve(site, 'scripts/gen-sitemap.mjs')]);
run([resolve(site, 'scripts/write-legacy-redirects.mjs')]);
run([nextBin, 'build']);

if (target === 'bel') {
  run([resolve(site, 'scripts/fix-bel-out.mjs')]);
} else {
  writeComCrossHostRedirects();
}

console.log(`build done: SITE=${target}`);
