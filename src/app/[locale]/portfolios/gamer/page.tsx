import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { env } from '@/env';
import PortfolioClient from '@/features/gamer/components/portfolio-client';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getPortfolio } from '@/shared/data/get-portfolio';
import { isSupportedLocale } from '@/shared/i18n/locales';
import { serializeJsonLd } from '@/shared/utils/json-ld';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};

  const portfolioData = await getPortfolio(locale);
  if (!portfolioData) return {};

  const t = await getTranslations({ locale, namespace: 'gamefolio.metadata' });
  const { name, role, skills, careerYears } = portfolioData;
  const title = t('title', { name, role });
  const description = t('description', { name, role, years: careerYears });
  const keywords = t('keywords', { name, role, keywords: skills.map((skill) => skill.name).join(', ') });

  const href = { pathname: '/portfolios/gamer' } as const;

  return {
    title,
    description,
    keywords,
    authors: [{ name, url: portfolioData.githubUrl }],
    creator: name,
    icons: {
      icon: '/favicon.webp',
      shortcut: '/favicon.webp',
      apple: '/favicon.webp',
    },
    alternates: {
      canonical: getPathname({ locale, href }),
      languages: Object.fromEntries(routing.locales.map((loc) => [loc, getPathname({ locale: loc, href })])),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      title,
      description,
      siteName: `Portfolio — ${name}`,
      images: [{ url: '/portfolios/gamer/og-gamer.webp', width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/portfolios/gamer/og-gamer.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function GamerPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) notFound();

  const data = await getPortfolio(locale);
  if (!data) notFound();

  const { name, role, githubUrl, linkedinUrl } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    email: data.email,
    url: `${env.MY_DOMAIN}${getPathname({ locale, href: { pathname: '/portfolios/gamer' } })}`,
    sameAs: [githubUrl, linkedinUrl],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Luís',
      addressRegion: 'MA',
      addressCountry: 'BR',
    },
    knowsAbout: data.skills.map((s) => s.name),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PortfolioClient data={data} />
    </>
  );
}
