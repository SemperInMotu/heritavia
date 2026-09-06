const UI = {
  en: {
    menu: 'Menu',
    research: 'Packages',
    report: 'The report',
    about: 'About',
    contacts: 'Contacts',
    start: 'Start',
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
    contacts: 'Контакты',
    start: 'Начать',
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
    contacts: 'Кантакты',
    start: 'Пачаць',
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
const LANG_PATH = { en: '/', ru: '/ru/', be: '/be/' };
const HINT = {
  ru: ['Сайт доступен на русском', 'Перейти'],
  be: ['Сайт даступны па-беларуску', 'Перайсьці'],
};

export function detectLang() {
  const m = window.location.pathname.match(/^\/(en|ru|be)(?=\/|$)/);
  return m ? m[1] : 'en';
}

function localePrefix(lang) {
  return lang === 'en' ? '' : `/${lang}`;
}

function pathsFor(lang) {
  const p = localePrefix(lang);
  return {
    home: `${p}/`,
    research: `${p}/research.html`,
    report: `${p}/report.html`,
    about: `${p}/about.html`,
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
  if (targetLang === 'en') return rest.endsWith('/') || rest.endsWith('.html') ? rest : `${rest}/`;
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
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
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
  if (forced && LANG_PATH[forced]) remember(forced);

  let stored = null;
  try {
    stored = window.localStorage.getItem(LANG_KEY);
  } catch {
    stored = null;
  }

  const tags = (
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || '']
  ).map((tag) => tag.toLowerCase());

  const byLanguage = tags.find((tag) => tag.startsWith('be') || tag.startsWith('ru'));
  const byRegion = tags.find((tag) => /-(by|ru|kz)\b/.test(tag));
  const detected = byLanguage ? (byLanguage.startsWith('be') ? 'be' : 'ru') : byRegion ? 'ru' : null;
  if (!detected) return;

  if (!stored) {
    remember(detected);
    window.location.replace(LANG_PATH[detected] + window.location.hash);
    return;
  }

  if (stored !== 'en') return;

  const hint = document.querySelector('[data-lang-hint]');
  if (!hint || !HINT[detected]) return;
  const [text, action] = HINT[detected];
  const textEl = hint.querySelector('[data-lang-hint-text]');
  const go = hint.querySelector('[data-lang-hint-go]');
  if (textEl) textEl.textContent = text;
  if (go) {
    go.textContent = action;
    go.href = LANG_PATH[detected];
    go.addEventListener('click', () => remember(detected));
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
  const t = UI[lang] || UI.en;
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
              <li>${page('contacts', t.contacts)}</li>
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
    iconAnchor: [0, 4],
  });
}

export async function mountNestMaps() {
  const nodes = [...document.querySelectorAll('[data-nest-map]')];
  if (!nodes.length) return;
  let L;
  try {
    L = await loadLeaflet();
  } catch {
    return;
  }

  nodes.forEach((el) => {
    if (el.dataset.nestReady) return;
    let nests = [];
    try {
      nests = JSON.parse(el.getAttribute('data-nests') || '[]');
    } catch {
      nests = [];
    }
    if (!nests.length) return;

    const map = L.map(el, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: !window.matchMedia('(pointer: coarse)').matches,
    });

    // Pale OSM basemap — CSS desaturates tiles so nest markers stay dominant
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const bounds = [];
    nests.forEach((n) => {
      const marker = L.marker([n.lat, n.lng], {
        icon: nestIcon(L, n.name, !!n.hyp),
        keyboard: false,
      }).addTo(map);
      bounds.push(marker.getLatLng());
    });

    if (bounds.length) {
      map.fitBounds(L.latLngBounds(bounds).pad(0.28), { maxZoom: 8 });
    } else {
      map.setView([53.7, 27.5], 6);
    }

    // Leaflet often needs a invalidate after layout / tiles
    requestAnimationFrame(() => map.invalidateSize());
    setTimeout(() => map.invalidateSize(), 250);
    el.dataset.nestReady = '1';
  });
}
