import { notFound } from 'next/navigation';
import { SiteShell } from '../../../components/SiteShell';
import { listSlugParams, loadPage } from '../../../lib/content';
import { rootLocale } from '../../../lib/site-mode';

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugParams(rootLocale).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = loadPage(rootLocale, slug);
  if (!page) return {};
  const languages = Object.fromEntries(page.alternates.map((a) => [a.hreflang, a.href]));
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.canonical,
      ...(page.alternates.length ? { languages } : {}),
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = loadPage(rootLocale, slug);
  if (!page) notFound();
  return (
    <SiteShell locale={rootLocale} current={page.current} pageId={page.pageId} html={page.html} />
  );
}
