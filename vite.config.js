import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

const basePages = ['index.html', 'research.html', 'report.html', 'about.html', 'contacts.html', 'start.html'];

const pages = [
  ...basePages,
  ...['ru', 'be'].flatMap((lang) => basePages.map((page) => `${lang}/${page}`)),
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
