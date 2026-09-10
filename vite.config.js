import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

const basePages = [
  'index.html',
  'research.html',
  'report.html',
  'about.html',
  'blog.html',
  'blog-metrics-missing.html',
  'sitemap.html',
  'contacts.html',
  'start.html',
];

const pages = [
  ...basePages,
  '404.html',
  ...['en', 'be', 'ru'].flatMap((lang) => basePages.map((page) => `${lang}/${page}`)),
];

export default defineConfig({
  root,
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.replace(/\.html$/, '').replace(/\//g, '-'), resolve(root, page)]),
      ),
    },
  },
});
