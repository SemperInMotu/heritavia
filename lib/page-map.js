import { BEL_ORIGIN, COM_ORIGIN } from './hosts.js';

/**
 * Single source of truth for dual-host language URLs.
 * heritavia.com = EN at / (DFY storefront + DIY-lite /guides/)
 * родословная.бел = BE at /, RU at /ru/ (full DIY KB + soft order)
 *
 * `parallel: true` — hreflang en/ru/be and x-default on .com.
 * Only real twins: home (language door), about, contact, order.
 * DIY-lite guides and the EN offer/proof pages are not translations of the .бел KB.
 *
 * Pages with a null `en` path are not built on heritavia.com.
 * `legacyEn` is where the old .com *.html bookmark should land.
 */
export const PAGES = {
  home: {
    en: '/',
    ru: '/ru/',
    be: '/',
    legacy: null,
    nav: true,
    parallel: true,
  },
  research: {
    en: '/research/',
    ru: '/ru/poisk-predkov/',
    be: '/poshuk-prodkau/',
    legacy: 'research.html',
    nav: true,
    parallel: false,
  },
  report: {
    en: '/report/',
    ru: '/ru/otchet/',
    be: '/spravazdacha/',
    legacy: 'report.html',
    nav: true,
    parallel: false,
  },
  about: {
    en: '/about/',
    ru: '/ru/o-proekte/',
    be: '/pra-praekt/',
    legacy: 'about.html',
    nav: true,
    parallel: true,
  },
  guides: {
    en: '/guides/',
    ru: null,
    be: null,
    legacy: null,
    nav: true,
    parallel: false,
  },
  'guide-hard': {
    en: '/guides/why-belarus-gdl-is-hard/',
    ru: null,
    be: null,
    legacy: null,
    nav: false,
    parallel: false,
  },
  'guide-method': {
    en: '/guides/how-we-research/',
    ru: null,
    be: null,
    legacy: null,
    nav: false,
    parallel: false,
  },
  'guide-diaspora': {
    en: '/guides/getting-started-diaspora/',
    ru: null,
    be: null,
    legacy: null,
    nav: false,
    parallel: false,
  },
  blog: {
    en: null,
    ru: '/ru/blog/',
    be: '/blog/',
    legacy: 'blog.html',
    legacyEn: '/guides/',
    nav: true,
    parallel: false,
  },
  contacts: {
    en: '/contact/',
    ru: '/ru/kontakty/',
    be: '/kantakty/',
    legacy: 'contacts.html',
    nav: true,
    parallel: true,
  },
  start: {
    en: '/contact/start/',
    ru: '/ru/kontakty/start/',
    be: '/kantakty/start/',
    legacy: 'start.html',
    nav: false,
    parallel: true,
  },
  sitemap: {
    en: '/sitemap/',
    ru: '/ru/karta-sajta/',
    be: '/mapa-sajtu/',
    legacy: 'sitemap.html',
    nav: false,
    parallel: false,
  },
  'blog-metrics': {
    en: null,
    ru: '/ru/blog/metrics-missing/',
    be: '/blog/metrics-missing/',
    legacy: 'blog-metrics-missing.html',
    legacyEn: '/guides/why-belarus-gdl-is-hard/',
    nav: false,
    parallel: false,
  },
  'blog-pokh': {
    en: null,
    ru: '/ru/blog/pokhozyaystvennye-knigi/',
    be: '/blog/pakhaaspadarchyja-knigi/',
    legacy: 'blog-pokhozyaystvennye-knigi.html',
    legacyEn: '/guides/',
    nav: false,
    parallel: false,
  },
  'forma-1': {
    en: null,
    ru: '/ru/blog/forma-1/',
    be: '/blog/forma-1/',
    legacy: 'forma-1-pasport-sssr-genealogy.html',
    legacyEn: '/guides/',
    nav: false,
    parallel: false,
  },
  gedmatch: {
    en: null,
    ru: '/ru/blog/gedmatch/',
    be: '/blog/gedmatch/',
    legacy: null,
    legacyEn: '/guides/how-we-research/',
    nav: false,
    parallel: false,
  },
  'gedmatch-file': {
    en: null,
    ru: '/ru/blog/gedmatch/syroy-fayl/',
    be: '/blog/gedmatch/syroy-fajl/',
    legacy: null,
    legacyEn: '/guides/how-we-research/',
    nav: false,
    parallel: false,
  },
  'gedmatch-profile': {
    en: null,
    ru: '/ru/blog/gedmatch/profil/',
    be: '/blog/gedmatch/profil/',
    legacy: null,
    legacyEn: '/guides/how-we-research/',
    nav: false,
    parallel: false,
  },
  'gedmatch-projects': {
    en: null,
    ru: '/ru/blog/gedmatch/ancestor-projects/',
    be: '/blog/gedmatch/ancestor-projects/',
    legacy: null,
    legacyEn: '/guides/how-we-research/',
    nav: false,
    parallel: false,
  },
  'gedmatch-choose': {
    en: null,
    ru: '/ru/blog/gedmatch/vybor-proekta/',
    be: '/blog/gedmatch/vybar-praekta/',
    legacy: null,
    legacyEn: '/guides/how-we-research/',
    nav: false,
    parallel: false,
  },
  'gedmatch-matches': {
    en: null,
    ru: '/ru/blog/gedmatch/sovpadeniya/',
    be: '/blog/gedmatch/supadzenni/',
    legacy: null,
    legacyEn: '/guides/how-we-research/',
    nav: false,
    parallel: false,
  },
  'gedmatch-belarus': {
    en: null,
    ru: '/ru/blog/gedmatch/belarus/',
    be: '/blog/gedmatch/belarus/',
    legacy: null,
    legacyEn: '/guides/how-we-research/',
    nav: false,
    parallel: false,
  },
};

/**
 * Old pretty URLs on heritavia.com. They stay on .com (English), never hop to .бел:
 * an English bookmark must not land on a Belarusian or Russian textbook.
 */
export const COM_EN_REDIRECTS = [
  { from: '/blog/', to: '/guides/' },
  { from: '/blog/metrics-missing/', to: '/guides/why-belarus-gdl-is-hard/' },
  { from: '/blog/household-books/', to: '/guides/' },
  { from: '/blog/forma-1/', to: '/guides/' },
  { from: '/blog/gedmatch/', to: '/guides/how-we-research/' },
  { from: '/blog/gedmatch/raw-dna/', to: '/guides/how-we-research/' },
  { from: '/blog/gedmatch/profile/', to: '/guides/how-we-research/' },
  { from: '/blog/gedmatch/ancestor-projects/', to: '/guides/how-we-research/' },
  { from: '/blog/gedmatch/which-project/', to: '/guides/how-we-research/' },
  { from: '/blog/gedmatch/matches/', to: '/guides/how-we-research/' },
  { from: '/blog/gedmatch/belarus/', to: '/guides/how-we-research/' },
];

/** legacy filename → page id */
export const LEGACY_TO_ID = Object.fromEntries(
  Object.entries(PAGES)
    .filter(([, p]) => p.legacy)
    .map(([id, p]) => [p.legacy, id]),
);

/** Nav on родословная.бел. heritavia.com uses navIdsFor('en'). */
export const NAV_IDS = ['research', 'report', 'about', 'blog', 'contacts'];

export function navIdsFor(locale) {
  if (locale === 'en') return ['research', 'report', 'guides', 'about', 'contacts'];
  return NAV_IDS;
}

export function localesFor(pageId) {
  const page = PAGES[pageId];
  if (!page) return [];
  return ['en', 'ru', 'be'].filter((lang) => page[lang]);
}

export function pathFor(pageId, lang) {
  const page = PAGES[pageId];
  if (!page) return lang === 'ru' ? '/ru/' : '/';
  if (page[lang]) return page[lang];
  if (lang === 'en' && page.legacyEn) return page.legacyEn;
  return lang === 'ru' ? '/ru/' : '/';
}

export function absoluteUrl(pageId, lang) {
  const path = pathFor(pageId, lang);
  if (lang === 'en') return `${COM_ORIGIN}${path === '/' ? '/' : path}`;
  return `${BEL_ORIGIN}${path}`;
}

/**
 * Header language switch.
 * Parallel pages cross to the twin. Anything else goes to that language's front door
 * (.com for EN, .бел for BE/RU) — not to a KB article in the wrong language.
 */
export function languageSwitchHref(pageId, lang) {
  const page = PAGES[pageId];
  if (page?.parallel && page[lang]) return absoluteUrl(pageId, lang);
  return absoluteUrl('home', lang);
}

export function isParallelSwitch(pageId, lang) {
  const page = PAGES[pageId];
  return Boolean(page?.parallel && page[lang]);
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
    else lang = null;
  }

  const candidates = Object.entries(PAGES);
  for (const [id, page] of candidates) {
    for (const L of ['en', 'ru', 'be']) {
      if (page[L] === path) return { id, lang: L };
    }
  }

  const legacyName = raw.split('/').filter(Boolean).pop();
  if (legacyName && LEGACY_TO_ID[`${legacyName}.html`]) {
    return { id: LEGACY_TO_ID[`${legacyName}.html`], lang: lang || 'en' };
  }

  if (path === '/' || path === '/ru/') return { id: 'home', lang: path.startsWith('/ru') ? 'ru' : lang || 'en' };
  return null;
}

export function alternatesFor(pageId) {
  const page = PAGES[pageId];
  if (!page?.parallel) return [];
  const langs = ['en', 'ru', 'be'].filter((lang) => page[lang]);
  const alts = langs.map((lang) => ({ hreflang: lang, href: absoluteUrl(pageId, lang) }));
  alts.push({
    hreflang: 'x-default',
    href: page.en ? absoluteUrl(pageId, 'en') : `${COM_ORIGIN}/`,
  });
  return alts;
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
  const page = PAGES[id];
  if (lang === 'en' && page?.legacyEn) return page.legacyEn;
  return pathFor(id, lang);
}

export { BEL_ORIGIN, COM_ORIGIN };
