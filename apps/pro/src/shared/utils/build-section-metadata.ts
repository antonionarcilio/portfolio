import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isSupportedLocale } from 'portfolio-content-model';

import { cmsClient } from '@/lib/cms-client';
import { buildPageMetadata } from '@/shared/utils/build-page-metadata';

export type SectionName = 'about' | 'works' | 'contact';

const SECTION_MESSAGE_KEYS = {
  about: { title: 'aboutTitle', description: 'aboutDescription', keywords: 'aboutKeywords' },
  works: { title: 'worksTitle', description: 'worksDescription', keywords: 'keywords' },
  contact: { title: 'contactTitle', description: 'contactDescription', keywords: 'keywords' },
} as const satisfies Record<SectionName, { title: string; description: string; keywords?: string }>;

/**
 * `generateMetadata` compartilhado pelas páginas de seção (`/about`, `/works`, `/contact`).
 * Devolve `{}` quando o locale é inválido ou o CMS não responde — a página em si já chama `notFound()`.
 *
 * @example
 * export async function generateMetadata({ params }: PageProps) {
 *   return buildSectionMetadata((await params).locale, 'about');
 * }
 */
export async function buildSectionMetadata(locale: string, section: SectionName): Promise<Metadata> {
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);
  const portfolio = await cmsClient.getPortfolio(locale);
  if (!portfolio) return {};

  const t = await getTranslations({ locale, namespace: 'pro.metadata' });
  const { name, role } = portfolio;
  const keys = SECTION_MESSAGE_KEYS[section];

  return buildPageMetadata({
    locale,
    pathname: `/${section}`,
    title: t(keys.title, { name, role }),
    description: t(keys.description, { name, role }),
    siteName: name,
    keywords: 'keywords' in keys ? t(keys.keywords).split(', ') : undefined,
  });
}
