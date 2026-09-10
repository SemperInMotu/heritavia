import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'https://heritavia.vitalykhoruzhko.com';

const pages = ['', 'research.html', 'report.html', 'about.html', 'blog.html', 'blog-metrics-missing.html', 'contacts.html', 'start.html'];
const locales = ['ru', 'en', 'be'];

const url = (lang, page) => {
  const path = page ? `/${page}` : '/';
  if (lang === 'ru') return `${HOST}${path === '/' ? '/' : path}`;
  return `${HOST}/${lang}${path === '/' ? '/' : path}`;
};

const entries = locales.flatMap((lang) =>
  pages.map((page) => {
    const alternates = [
      ...locales.map((alt) => `      <xhtml:link rel="alternate" hreflang="${alt}" href="${url(alt, page)}" />`),
      `      <xhtml:link rel="alternate" hreflang="x-default" href="${url('ru', page)}" />`,
    ].join('\n');
    return [
      '  <url>',
      `    <loc>${url(lang, page)}</loc>`,
      alternates,
      `    <changefreq>monthly</changefreq>`,
      `    <priority>${page === '' ? '1.0' : '0.7'}</priority>`,
      '  </url>',
    ].join('\n');
  }),
);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  '</urlset>',
  '',
].join('\n');

writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml — ${entries.length} urls`);
