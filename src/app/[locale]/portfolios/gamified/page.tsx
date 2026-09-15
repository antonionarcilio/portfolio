import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { env } from '@/env';
import PortfolioClient from '@/features/gamified/components/portfolio-client';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getPortfolio } from '@/shared/data/get-portfolio';
import { isSupportedLocale } from '@/shared/i18n/locales';
import { serializeJsonLd } from '@/shared/utils/json-ld';
import { parseLocation } from '@/shared/utils/location';
import { PORTFOLIO_OG_IMAGE } from '@/shared/utils/portfolio-og-image';

type PageProps = { params: Promise<{ locale: string }> };

// Note: no `dynamic = 'force-static'` here — the root layout already static-generates this route
// via `generateStaticParams`/`dynamicParams = false`. `setRequestLocale` below (in both
// `generateMetadata` and the page) is what actually keeps this static: without it, next-intl falls
// back to reading `headers()` to resolve the locale, and that Dynamic API silently opts the whole
// route into per-request rendering.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);

  const portfolioData = await getPortfolio(locale);
  if (!portfolioData) return {};

  const t = await getTranslations({ locale, namespace: 'gamified.metadata' });
  const { name, role, skills, careerYears, location } = portfolioData;
  const title = t('title', { name, role });
  const description = t('description', { name, role, years: careerYears, location });
  const keywords = t('keywords', { name, role, keywords: skills.map((skill) => skill.name).join(', ') });

  const href = { pathname: '/portfolios/gamified' } as const;

  return {
    title,
    description,
    keywords,
    authors: [{ name, url: portfolioData.githubUrl }],
    creator: name,
    icons: {
      icon: '/portfolios/gamified/favicon-gamified.svg',
      shortcut: '/portfolios/gamified/favicon-gamified.svg',
      apple: '/portfolios/gamified/favicon-gamified.svg',
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

export default async function GamifiedPage({ params }: PageProps) {
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
    url: `${env.MY_DOMAIN}${getPathname({ locale, href: { pathname: '/portfolios/gamified' } })}`,
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
      <PortfolioClient data={data} />
    </>
  );
}
