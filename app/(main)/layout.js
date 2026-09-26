import { UI } from '../../lib/i18n';
import { rootLocale } from '../../lib/site-mode';
import { GtagScripts, YandexNoscript } from '../../components/GtagScripts';
import '../../src/styles/main.css';

export const metadata = {
  icons: { icon: '/assets/favicon.svg' },
};

/** EN (heritavia.com) or BE (родословная.бел root) */
export default function MainLayout({ children }) {
  return (
    <html lang={UI[rootLocale].htmlLang}>
      <head>
        <GtagScripts />
      </head>
      <body>
        <YandexNoscript />
        {children}
      </body>
    </html>
  );
}
