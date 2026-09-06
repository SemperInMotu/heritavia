# Heritavia — site

Статический сайт продукта (`heritavia.vitalykhoruzhko.com`).
Раньше жил как раздел `/heritage/` на semperinmotu.com; вынесен на свой субдомен,
чтобы B2C-генеалогия не мешалась с B2B-витриной Ops-агентства.

## Run

```bash
cd 01_Projects/Heritavia/site
npm install
npm run dev
```

```bash
npm run build    # → dist/
npm run preview  # превью production-сборки
```

## Pages

| URL | Страница |
|-----|----------|
| `/` | Обзор + пакеты |
| `/research.html` | Пакеты подробно, что входит / не входит |
| `/report.html` | Живой отчёт |
| `/start.html` | Форма заказа стратегии €300 |

Локали: EN в корне, RU в `/ru/`, BE в `/be/`.
BE — тарашкевіца, как на vitalykhoruzhko.com: в `<html lang>` стоит `be-tarask`,
а в `hreflang` — обычное `be` (Google разбирает только `язык[-РЕГИОН]`).

## Статика

`public/` копируется в `dist/` как есть: `robots.txt`, `sitemap.xml`,
`assets/favicon.svg`, `assets/og-default.jpg`. Файлы вне `public/` в сборку не попадают.

- Sitemap: `node scripts/gen-sitemap.mjs`
- OG-картинка: `python ../../_shared/gen_og_images.py`

## Формы

POST на `formsubmit.co/info@vitalykhoruzhko.com`, редирект на `?sent=1`.
Подтверждение отправки рисует `wireFormStatus()` в `src/site.js`.

Нужна одноразовая активация адреса на стороне FormSubmit, иначе письма не дойдут.

## Переезд

Старые URL `semperinmotu.com/[ru|be/]heritage/*` отдают 301 через
`SemperInMotu/site/public/_redirects` (и meta-refresh заглушки как фолбэк).
Когда старые адреса выпадут из индекса, заглушки можно удалить.
