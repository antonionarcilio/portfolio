import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { isSupportedLocale } from '@/shared/i18n/locales';

import { PortfolioHubContent } from './portfolio-hub-content';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'portfolioHub' });
  return { title: t('title'), description: t('description') };
}

export default async function PortfoliosPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  return <PortfolioHubContent />;
}
