import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { env } from '@/env';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getPortfolio } from '@/shared/data/get-portfolio';
import { isSupportedLocale } from '@/shared/i18n/locales';
import { serializeJsonLd } from '@/shared/utils/json-ld';
import { parseLocation } from '@/shared/utils/location';
import { PORTFOLIO_OG_IMAGE } from '@/shared/utils/portfolio-og-image';

import { MinimalistPageContent } from './minimalist-page-content';

type PageProps = { params: Promise<{ locale: string }> };

// Note: no `dynamic = 'force-static'` here — see gamified/page.tsx for why (and for why
// `setRequestLocale` below is required for this route to stay static).

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);
  const portfolio = await getPortfolio(locale);
  if (!portfolio) return {};
  const t = await getTranslations({ locale, namespace: 'minimalist.metadata' });
  const { name, role, skills, bio, highlightText } = portfolio;
  const title = t('title', { name, role });
  const description = bio?.excerpt ?? highlightText ?? t('description', { name, role });
  const keywords = t('keywords', { name, role, keywords: skills.map((skill) => skill.name).join(', ') });

  const href = { pathname: '/portfolios/minimalist' } as const;

  return {
    title,
    description,
    keywords,
    authors: [{ name, url: portfolio.githubUrl }],
    creator: name,
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
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      title,
      description,
      siteName: `Portfolio — ${name}`,
      images: [{ ...PORTFOLIO_OG_IMAGE, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ ...PORTFOLIO_OG_IMAGE, alt: name }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function MinimalistPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);
  const data = await getPortfolio(locale);
  if (!data) notFound();

  const { name, role, githubUrl, linkedinUrl } = data;
  const parsedAddress = parseLocation(data.location);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    email: data.email,
    url: `${env.MY_DOMAIN}${getPathname({ locale, href: { pathname: '/portfolios/minimalist' } })}`,
    sameAs: [githubUrl, linkedinUrl],
    ...(parsedAddress.isComplete
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: parsedAddress.addressLocality,
            addressRegion: parsedAddress.addressRegion,
            addressCountry: parsedAddress.addressCountry,
          },
        }
      : {}),
    knowsAbout: data.skills.map((s) => s.name),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <MinimalistPageContent data={data} locale={locale} />
    </>
  );
}
