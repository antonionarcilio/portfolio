import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { isSupportedLocale } from '@/shared/i18n/locales';
import { PORTFOLIO_OG_IMAGE } from '@/shared/utils/portfolio-og-image';

import { PortfolioHubContent } from './portfolio-hub-content';

type PageProps = { params: Promise<{ locale: string }> };

// Note: no `dynamic = 'force-static'` here — see portfolios/gamified/page.tsx for why.

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'portfolioHub' });
  const title = t('title');
  const description = t('description');
  const href = { pathname: '/portfolios' } as const;

  return {
    title,
    description,
    alternates: {
      canonical: getPathname({ locale, href }),
      languages: Object.fromEntries(routing.locales.map((loc) => [loc, getPathname({ locale: loc, href })])),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      title,
      description,
      images: [{ ...PORTFOLIO_OG_IMAGE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ ...PORTFOLIO_OG_IMAGE, alt: title }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function PortfoliosPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);
  return <PortfolioHubContent />;
}
