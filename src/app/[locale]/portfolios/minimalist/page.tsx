import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { MinimalistRecruiter } from '@/features/minimalist/components/recruiter';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getPortfolio } from '@/shared/data/get-portfolio';
import { isSupportedLocale } from '@/shared/i18n/locales';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const portfolio = await getPortfolio(locale);
  if (!portfolio) return {};
  const t = await getTranslations({ locale, namespace: 'minimalist.metadata' });
  const href = { pathname: '/portfolios/minimalist' } as const;
  return {
    title: t('title', { name: portfolio.name, role: portfolio.role }),
    description: t('description', { name: portfolio.name, role: portfolio.role }),
    authors: [{ name: portfolio.name, url: portfolio.githubUrl }],
    creator: portfolio.name,
    icons: {
      icon: '/favicon-light.svg',
      shortcut: '/favicon-light.svg',
    },
    alternates: {
      canonical: getPathname({ locale, href }),
      languages: Object.fromEntries(
        routing.locales.map((currentLocale) => [currentLocale, getPathname({ locale: currentLocale, href })]),
      ),
    },
  };
}

export default async function MinimalistPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const data = await getPortfolio(locale);
  if (!data) notFound();
  return <MinimalistRecruiter data={data} locale={locale} />;
}
