import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { LEGACY_TO_ID, PAGES, absoluteUrl, COM_ORIGIN, COM_EN_REDIRECTS } from '../lib/page-map.js';

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

  function stub(target, lang, canonical = target) {
    const label = lang === 'ru' ? 'Продолжить' : lang === 'en' ? 'Continue' : 'Працягнуць';
    return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
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
    const dest = resolve(out, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, html, 'utf8');
  }

  function localeFile(prefix, localePath) {
    let rest = localePath;
    if (prefix === 'ru') rest = localePath.replace(/^\/ru\/?/, '');
    else rest = localePath.replace(/^\//, '');
    rest = rest.replace(/\/$/, '');
    if (!rest) return `${prefix}/index.html`;
    return `${prefix}/${rest}/index.html`;
  }

  for (const [id, page] of Object.entries(PAGES)) {
    if (page.ru) write(localeFile('ru', page.ru), stub(absoluteUrl(id, 'ru'), 'ru'));
    if (page.be) write(localeFile('be', page.be), stub(absoluteUrl(id, 'be'), 'be'));
  }
  for (const [legacy, id] of Object.entries(LEGACY_TO_ID)) {
    write(`ru/${legacy}`, stub(absoluteUrl(id, 'ru'), 'ru'));
    write(`be/${legacy}`, stub(absoluteUrl(id, 'be'), 'be'));
  }
  for (const { from, to } of COM_EN_REDIRECTS) {
    const rel = `${from.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
    write(rel, stub(to, 'en', `${COM_ORIGIN}${to}`));
  }
  console.log('com out/: /ru/* and /be/* → родословная.бел; old EN notes → /guides/');
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
