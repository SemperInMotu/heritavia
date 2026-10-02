import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { BEL_ORIGIN, COM_ORIGIN } from './hosts.js';
import { PAGES, pathFor, sourceRelPath, absoluteUrl, alternatesFor } from './page-map.js';

const ROOT = process.cwd();

const CURRENT = {
  home: 'home',
  research: 'research',
  report: 'report',
  about: 'about',
  blog: 'blog',
  'blog-metrics': 'blog',
  'blog-pokh': 'blog',
  'forma-1': 'blog',
  gedmatch: 'blog',
  'gedmatch-file': 'blog',
  'gedmatch-profile': 'blog',
  'gedmatch-projects': 'blog',
  'gedmatch-choose': 'blog',
  'gedmatch-matches': 'blog',
  'gedmatch-belarus': 'blog',
  sitemap: 'sitemap',
  contacts: 'contacts',
  start: 'start',
};

function localeRoot(locale) {
  if (locale === 'be') return resolve(ROOT, 'be');
  if (locale === 'en') return ROOT;
  return resolve(ROOT, 'ru');
}

function slugFromPath(pageId, locale) {
  let path = pathFor(pageId, locale);
  if (locale === 'ru') path = path.replace(/^\/ru\/?/, '') || '';
  else path = path.replace(/^\//, '') || '';
  path = path.replace(/\/$/, '');
  return path ? path.split('/') : [];
}

export function listSlugParams(locale) {
  return Object.keys(PAGES).map((id) => ({
    id,
    slug: slugFromPath(id, locale),
  }));
}

/** @deprecated flat file list — prefer listSlugParams */
export function listPages(locale) {
  return listSlugParams(locale).map(({ id, slug }) => ({
    id,
    file: slug.length ? `${slug.join('/')}/index.html` : 'index.html',
    slug,
  }));
}

export function pageIdFromSlug(locale, slug) {
  const parts = Array.isArray(slug) ? slug : [];
  for (const id of Object.keys(PAGES)) {
    const expected = slugFromPath(id, locale);
    if (expected.length === parts.length && expected.every((p, i) => p === parts[i])) {
      return id;
    }
  }
  return null;
}

function sourcePath(locale, pageId) {
  if (locale === 'en') {
    const rel = sourceRelPath(pageId, 'en');
    return resolve(ROOT, rel);
  }
  if (locale === 'be') return resolve(ROOT, 'be', sourceRelPath(pageId, 'be'));
  return resolve(ROOT, 'ru', sourceRelPath(pageId, 'ru'));
}

function rewrite(html, locale) {
  /* Content already uses locale paths from page-map; only fix cross-host leftovers. */
  if (locale === 'be') {
    return html
      .replaceAll('href="/be/', 'href="/')
      .replaceAll('href="/en/', `href="${COM_ORIGIN}/`)
      .replaceAll(`href="${COM_ORIGIN}/en/`, `href="${COM_ORIGIN}/`);
  }
  if (locale === 'ru') {
    return html
      .replaceAll('href="/be/', 'href="/')
      .replaceAll('href="/en/', `href="${COM_ORIGIN}/`)
      .replaceAll(`href="${COM_ORIGIN}/en/`, `href="${COM_ORIGIN}/`);
  }
  return html
    .replaceAll('href="/en/', 'href="/')
    .replaceAll('href="/be/', `href="${BEL_ORIGIN}/`);
}

export function loadPage(locale, slug) {
  const pageId = pageIdFromSlug(locale, slug);
  if (!pageId) return null;
  const path = sourcePath(locale, pageId);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, 'utf8');
  if (raw.includes('http-equiv="refresh"') && raw.length < 800) return null;
  const title = raw.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Heritavia';
  const description = raw.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const main = raw.match(/<main>([\s\S]*?)<\/main>/)?.[1];
  if (!main) return null;
  return {
    title,
    description,
    html: rewrite(main, locale),
    current: CURRENT[pageId] || '',
    pageId,
    file: sourceRelPath(pageId, locale),
    canonical: absoluteUrl(pageId, locale),
    alternates: alternatesFor(pageId),
  };
}

export function walkHtmlFiles(dir, base = dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name.startsWith('_') || name === 'node_modules') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkHtmlFiles(full, base));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}
