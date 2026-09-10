const UI = {
  en: {
    menu: 'Menu',
    research: 'Packages',
    report: 'The report',
    about: 'About',
    blog: 'Blog',
    sitemap: 'Site map',
    contacts: 'Contacts',
    start: 'Start',
    notFound: 'Page not found',
    notFoundLead: 'This address does not exist. Redirecting to the site map…',
    goSitemap: 'Open site map',
    tagline: 'Documentary family history from Eastern Europe — research and a living report.',
    navCol: 'Heritavia',
    contactCol: 'Contact',
    formLink: 'Order a strategy',
    author: 'A project by Vitaly Khoruzhko',
    location: 'Minsk, Belarus',
    unp: 'UNP 102176582',
    sent: 'Enquiry sent. We will reply to the address you provided.',
  },
  ru: {
    menu: 'Меню',
    research: 'Пакеты',
    report: 'Отчёт',
    about: 'О нас',
    blog: 'Блог',
    sitemap: 'Карта сайта',
    contacts: 'Контакты',
    start: 'Начать',
    notFound: 'Страница не найдена',
    notFoundLead: 'Такого адреса нет. Переходим на карту сайта…',
    goSitemap: 'Открыть карту сайта',
    tagline: 'Документальная семейная история Восточной Европы — исследование и живой отчёт.',
    navCol: 'Heritavia',
    contactCol: 'Контакты',
    formLink: 'Заказать стратегию',
    author: 'Проект Виталия Хоружко',
    location: 'Минск, Беларусь',
    unp: 'УНП 102176582',
    sent: 'Заявка отправлена. Ответим на указанный адрес.',
  },
  be: {
    menu: 'Мэню',
    research: 'Пакеты',
    report: 'Справаздача',
    about: 'Пра нас',
    blog: 'Блог',
    sitemap: 'Мапа сайту',
    contacts: 'Кантакты',
    start: 'Пачаць',
    notFound: 'Старонка не знойдзеная',
    notFoundLead: 'Такой адрас не існуе. Пераходзім на мапу сайту…',
    goSitemap: 'Адкрыць мапу сайту',
    tagline: 'Дакумэнтальная сямейная гісторыя Ўсходняй Эўропы — досьлед і жывая справаздача.',
    navCol: 'Heritavia',
    contactCol: 'Кантакты',
    formLink: 'Замовіць стратэгію',
    author: 'Праект Віталя Харужкі',
    location: 'Менск, Беларусь',
    unp: 'УНП 102176582',
    sent: 'Заяўка адпраўленая. Адкажам на пазначаны email.',
  },
};

const LANG_KEY = 'heritavia-lang';
/* Russian is the default locale at `/`. English lives under `/en/`. */
const LANG_PATH = { ru: '/', en: '/en/', be: '/be/' };
const HINT = {
  en: ['This site is also available in English', 'Switch'],
  be: ['Сайт даступны па-беларуску', 'Перайсьці'],
};

export function detectLang() {
  const m = window.location.pathname.match(/^\/(en|be|ru)(?=\/|$)/);
  if (!m) return 'ru';
  return m[1] === 'ru' ? 'ru' : m[1];
}

function localePrefix(lang) {
  if (lang === 'ru') return '';
  return `/${lang}`;
}

function pathsFor(lang) {
  const p = localePrefix(lang);
  return {
    home: `${p}/`,
    research: `${p}/research.html`,
    report: `${p}/report.html`,
    about: `${p}/about.html`,
    blog: `${p}/blog.html`,
    sitemap: `${p}/sitemap.html`,
    contacts: `${p}/contacts.html`,
    start: `${p}/start.html`,
  };
}

function href(key, lang) {
  return pathsFor(lang)[key];
}

function personalUrl(lang) {
  if (lang === 'ru') return 'https://vitalykhoruzhko.com/ru';
  if (lang === 'be') return 'https://vitalykhoruzhko.com/be';
  return 'https://vitalykhoruzhko.com';
}

/* Belarusian copy follows тарашкевіца, matching vitalykhoruzhko.com. The variant
   subtag is valid BCP-47 for the lang attribute, but hreflang stays plain "be" —
   Google only parses language[-REGION] there. */
function htmlLang(lang) {
  return lang === 'be' ? 'be-tarask' : lang;
}

function stripLocale(pathname) {
  return pathname.replace(/^\/(en|ru|be)(?=\/|$)/, '') || '/';
}

function siblingLangUrl(targetLang) {
  const rest = stripLocale(window.location.pathname);
  if (targetLang === 'ru') {
    return rest.endsWith('/') || rest.endsWith('.html') ? rest : `${rest}/`;
  }
  return `/${targetLang}${rest}`;
}

function remember(lang) {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* private mode */
  }
}

function langSwitcher(lang) {
  const items = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'be', label: 'BE' },
  ];
  return `
    <nav class="lang-switch" aria-label="Language" data-lang-switch>
      ${items
        .map((item) =>
          item.code === lang
            ? `<span class="lang-current" aria-current="page">${item.label}</span>`
            : `<a href="${siblingLangUrl(item.code)}" hreflang="${item.code}">${item.label}</a>`,
        )
        .join('')}
    </nav>
  `;
}

function wireLangMemory() {
  document.querySelectorAll('[data-lang-switch] a[hreflang]').forEach((link) => {
    link.addEventListener('click', () => remember(link.getAttribute('hreflang')));
  });
}

function maybeRedirectByLocale() {
  if (!document.documentElement.hasAttribute('data-lang-root')) return;

  const params = new URLSearchParams(window.location.search);
  const forced = params.get('lang');
  if (forced && LANG_PATH[forced]) {
    remember(forced);
    if (forced !== 'ru') {
      window.location.replace(LANG_PATH[forced] + window.location.hash);
      return;
    }
  }

  let stored = null;
  try {
    stored = window.localStorage.getItem(LANG_KEY);
  } catch {
    stored = null;
  }

  if (stored && stored !== 'ru' && LANG_PATH[stored]) {
    window.location.replace(LANG_PATH[stored] + window.location.hash);
    return;
  }

  const tags = (
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || '']
  ).map((tag) => tag.toLowerCase());

  const prefersEn = tags.some((tag) => tag.startsWith('en')) && !tags.some((tag) => tag.startsWith('ru') || tag.startsWith('be'));
  if (stored || !prefersEn) return;

  const hint = document.querySelector('[data-lang-hint]');
  if (!hint || !HINT.en) return;
  const [text, action] = HINT.en;
  const textEl = hint.querySelector('[data-lang-hint-text]');
  const go = hint.querySelector('[data-lang-hint-go]');
  if (textEl) textEl.textContent = text;
  if (go) {
    go.textContent = action;
    go.href = LANG_PATH.en;
    go.addEventListener('click', () => remember('en'));
  }
  hint.querySelector('[data-lang-hint-close]')?.addEventListener('click', () => {
    hint.hidden = true;
  });
  hint.hidden = false;
}

function wireFormStatus(t) {
  if (new URLSearchParams(window.location.search).get('sent') !== '1') return;
  const form = document.querySelector('form[action*="formsubmit"]');
  if (!form) return;

  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  status.tabIndex = -1;
  status.textContent = t.sent;
  form.before(status);
  status.focus();
}

export function mountChrome({ current = '' } = {}) {
  const lang = detectLang();
  const t = UI[lang] || UI.ru;
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');

  document.documentElement.lang = htmlLang(lang);

  const page = (key, label) =>
    `<a href="${href(key, lang)}" ${current === key ? 'aria-current="page"' : ''}>${label}</a>`;

  if (header) {
    header.innerHTML = `
      <div class="wrap site-header__inner">
        <a class="brand" href="${href('home', lang)}">Heritavia</a>
        <div class="header-tools">
          ${langSwitcher(lang)}
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${t.menu}</button>
        </div>
        <nav class="nav" id="site-nav">
          ${page('research', t.research)}
          ${page('report', t.report)}
          ${page('about', t.about)}
          ${page('blog', t.blog)}
          ${page('contacts', t.contacts)}
          <a class="nav-cta" href="${href('start', lang)}" ${current === 'start' ? 'aria-current="page"' : ''}>${t.start}</a>
        </nav>
      </div>
    `;

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.nav');
    toggle?.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  if (footer) {
    footer.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">Heritavia</div>
            <p class="fine footer-tagline">${t.tagline}</p>
            <p class="fine">${t.location}</p>
          </div>
          <div class="footer-col">
            <h4>${t.navCol}</h4>
            <ul>
              <li>${page('research', t.research)}</li>
              <li>${page('report', t.report)}</li>
              <li>${page('about', t.about)}</li>
              <li>${page('blog', t.blog)}</li>
              <li>${page('contacts', t.contacts)}</li>
              <li>${page('sitemap', t.sitemap)}</li>
              <li>${page('start', t.start)}</li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>${t.contactCol}</h4>
            <ul>
              <li><a href="mailto:info@vitalykhoruzhko.com">info@vitalykhoruzhko.com</a></li>
              <li><a href="https://wa.me/375296757858" rel="noopener">WhatsApp</a></li>
              <li><a href="https://t.me/N_FT210993" rel="noopener">Telegram</a></li>
              <li>${page('start', t.formLink)}</li>
              <li><a href="${personalUrl(lang)}">${t.author}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Heritavia</span>
          <span>${t.unp}</span>
        </div>
      </div>
    `;
  }

  wireLangMemory();
  maybeRedirectByLocale();
  wireFormStatus(t);
  mountNestMaps();
}

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  return new Promise((resolve, reject) => {
    const cssId = 'leaflet-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Leaflet failed to load'));
    document.head.appendChild(script);
  });
}

function nestIcon(L, name, hyp) {
  const safe = String(name)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return L.divIcon({
    className: `nest-pin${hyp ? ' nest-pin--hyp' : ''}`,
    html: `<div class="nest-pin__inner"><i class="nest-pin__dot"></i><span class="nest-pin__label">${safe}</span></div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
}

function mountNestMaps() {
  const nodes = [...document.querySelectorAll('[data-nest-map]')];
  if (!nodes.length) return;

  loadLeaflet()
    .then((L) => {
      nodes.forEach((el) => {
        if (el.dataset.mounted) return;
        let nests = [];
        try {
          nests = JSON.parse(el.getAttribute('data-nests') || '[]');
        } catch {
          nests = [];
        }
        if (!nests.length) return;

        const map = L.map(el, {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false,
          dragging: !L.Browser.mobile,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          className: 'nest-tiles',
          maxZoom: 18,
        }).addTo(map);

        const bounds = [];
        nests.forEach((n) => {
          const m = L.marker([n.lat, n.lng], { icon: nestIcon(L, n.name, n.hyp) }).addTo(map);
          bounds.push(m.getLatLng());
        });
        if (bounds.length === 1) map.setView(bounds[0], 8);
        else map.fitBounds(L.latLngBounds(bounds).pad(0.35));
        el.dataset.mounted = '1';
      });
    })
    .catch(() => {
      /* map is optional enhancement */
    });
}
