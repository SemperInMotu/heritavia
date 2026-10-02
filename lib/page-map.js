import { BEL_ORIGIN, COM_ORIGIN } from './hosts.js';

/**
 * Single source of truth for dual-host language URLs.
 * heritavia.com = EN at /
 * родословная.бел = BE at /, RU at /ru/
 */
export const PAGES = {
  home: {
    en: '/',
    ru: '/ru/',
    be: '/',
    legacy: null,
    nav: true,
  },
  research: {
    en: '/research/',
    ru: '/ru/poisk-predkov/',
    be: '/poshuk-prodkau/',
    legacy: 'research.html',
    nav: true,
  },
  report: {
    en: '/report/',
    ru: '/ru/otchet/',
    be: '/spravazdacha/',
    legacy: 'report.html',
    nav: true,
  },
  about: {
    en: '/about/',
    ru: '/ru/o-proekte/',
    be: '/pra-praekt/',
    legacy: 'about.html',
    nav: true,
  },
  blog: {
    en: '/blog/',
    ru: '/ru/blog/',
    be: '/blog/',
    legacy: 'blog.html',
    nav: true,
  },
  contacts: {
    en: '/contact/',
    ru: '/ru/kontakty/',
    be: '/kantakty/',
    legacy: 'contacts.html',
    nav: true,
  },
  start: {
    en: '/contact/start/',
    ru: '/ru/kontakty/start/',
    be: '/kantakty/start/',
    legacy: 'start.html',
    nav: false,
  },
  sitemap: {
    en: '/sitemap/',
    ru: '/ru/karta-sajta/',
    be: '/mapa-sajtu/',
    legacy: 'sitemap.html',
    nav: false,
  },
  'blog-metrics': {
    en: '/blog/metrics-missing/',
    ru: '/ru/blog/metrics-missing/',
    be: '/blog/metrics-missing/',
    legacy: 'blog-metrics-missing.html',
    nav: false,
  },
  'blog-pokh': {
    en: '/blog/household-books/',
    ru: '/ru/blog/pokhozyaystvennye-knigi/',
    be: '/blog/pakhaaspadarchyja-knigi/',
    legacy: 'blog-pokhozyaystvennye-knigi.html',
    nav: false,
  },
  'forma-1': {
    en: '/blog/forma-1/',
    ru: '/ru/blog/forma-1/',
    be: '/blog/forma-1/',
    legacy: 'forma-1-pasport-sssr-genealogy.html',
    nav: false,
  },
  gedmatch: {
    en: '/blog/gedmatch/',
    ru: '/ru/blog/gedmatch/',
    be: '/blog/gedmatch/',
    legacy: null,
    nav: false,
  },
  'gedmatch-file': {
    en: '/blog/gedmatch/raw-dna/',
    ru: '/ru/blog/gedmatch/syroy-fayl/',
    be: '/blog/gedmatch/syroy-fajl/',
    legacy: null,
    nav: false,
  },
  'gedmatch-profile': {
    en: '/blog/gedmatch/profile/',
    ru: '/ru/blog/gedmatch/profil/',
    be: '/blog/gedmatch/profil/',
    legacy: null,
    nav: false,
  },
  'gedmatch-projects': {
    en: '/blog/gedmatch/ancestor-projects/',
    ru: '/ru/blog/gedmatch/ancestor-projects/',
    be: '/blog/gedmatch/ancestor-projects/',
    legacy: null,
    nav: false,
  },
  'gedmatch-choose': {
    en: '/blog/gedmatch/which-project/',
    ru: '/ru/blog/gedmatch/vybor-proekta/',
    be: '/blog/gedmatch/vybar-praekta/',
    legacy: null,
    nav: false,
  },
  'gedmatch-matches': {
    en: '/blog/gedmatch/matches/',
    ru: '/ru/blog/gedmatch/sovpadeniya/',
    be: '/blog/gedmatch/supadzenni/',
    legacy: null,
    nav: false,
  },
  'gedmatch-belarus': {
    en: '/blog/gedmatch/belarus/',
    ru: '/ru/blog/gedmatch/belarus/',
    be: '/blog/gedmatch/belarus/',
    legacy: null,
    nav: false,
  },
};

/** legacy filename → page id */
export const LEGACY_TO_ID = Object.fromEntries(
  Object.entries(PAGES)
    .filter(([, p]) => p.legacy)
    .map(([id, p]) => [p.legacy, id]),
);

/** nav key used by chrome (research, report, …) */
export const NAV_IDS = ['research', 'report', 'about', 'blog', 'contacts'];

export function pathFor(pageId, lang) {
  const page = PAGES[pageId];
  if (!page) return lang === 'en' ? '/' : lang === 'ru' ? '/ru/' : '/';
  return page[lang] || page.en;
}

export function absoluteUrl(pageId, lang) {
  const path = pathFor(pageId, lang);
  if (lang === 'en') return `${COM_ORIGIN}${path === '/' ? '/' : path}`;
  return `${BEL_ORIGIN}${path}`;
}

/**
 * Resolve page id from a pathname (with or without host locale prefix).
 * On .bel, /ru/... → ru; otherwise be. On .com → en.
 */
export function pageIdFromPath(pathname, langHint = null) {
  const raw = (pathname || '/').replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  let path = raw.endsWith('/') || raw === '' ? raw || '/' : `${raw}/`;
  if (!path.startsWith('/')) path = `/${path}`;

  let lang = langHint;
  if (!lang) {
    if (path === '/ru' || path.startsWith('/ru/')) lang = 'ru';
    else lang = null; // caller decides en vs be by host
  }

  const candidates = Object.entries(PAGES);
  for (const [id, page] of candidates) {
    for (const L of ['en', 'ru', 'be']) {
      if (page[L] === path) return { id, lang: L };
    }
  }

  /* try without trailing slash variants already normalized */
  const legacyName = raw.split('/').filter(Boolean).pop();
  if (legacyName && LEGACY_TO_ID[`${legacyName}.html`]) {
    return { id: LEGACY_TO_ID[`${legacyName}.html`], lang: lang || 'en' };
  }

  if (path === '/' || path === '/ru/') return { id: 'home', lang: path.startsWith('/ru') ? 'ru' : lang || 'en' };
  return null;
}

export function alternatesFor(pageId) {
  const page = PAGES[pageId];
  if (!page) return [];
  const en = absoluteUrl(pageId, 'en');
  const ru = absoluteUrl(pageId, 'ru');
  const be = absoluteUrl(pageId, 'be');
  return [
    { hreflang: 'en', href: en },
    { hreflang: 'ru', href: ru },
    { hreflang: 'be', href: be },
    { hreflang: 'x-default', href: en },
  ];
}

export function alternateLinkTags(pageId) {
  return alternatesFor(pageId)
    .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join('\n    ');
}

/** Relative path of index.html under locale source tree (no leading slash). */
export function sourceRelPath(pageId, lang) {
  const path = pathFor(pageId, lang);
  if (lang === 'ru') {
    const rest = path.replace(/^\/ru\/?/, '');
    if (!rest) return 'index.html';
    return `${rest.replace(/\/$/, '')}/index.html`;
  }
  if (path === '/') return 'index.html';
  return `${path.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
}

/** Vite/Next input path for EN content at site root */
export function enRelPath(pageId) {
  return sourceRelPath(pageId, 'en');
}

export function legacyRedirectTarget(legacyFile, lang) {
  const id = LEGACY_TO_ID[legacyFile];
  if (!id) return null;
  return pathFor(id, lang);
}

export { BEL_ORIGIN, COM_ORIGIN };
