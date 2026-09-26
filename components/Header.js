'use client';

import { useState } from 'react';

export function Header({ t, links, startHref, current, home, langs = [], locale }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <a className="brand" href={home}>
          Heritavia
        </a>
        <nav className={open ? 'nav is-open' : 'nav'} id="site-nav">
          {links.map((item) => (
            <a key={item.key} href={item.href} aria-current={current === item.key ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href={startHref} aria-current={current === 'start' ? 'page' : undefined}>
            {t.start}
          </a>
        </nav>
        <div className="header-tools">
          <nav className="lang-switch" aria-label="Language">
            {langs.map((item) =>
              item.code === locale ? (
                <span key={item.code} className="lang-current" aria-current="page">
                  {item.short}
                </span>
              ) : (
                <a key={item.code} href={item.href} hrefLang={item.code} title={item.label}>
                  {item.short}
                </a>
              ),
            )}
          </nav>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {t.menu}
          </button>
        </div>
      </div>
    </header>
  );
}
