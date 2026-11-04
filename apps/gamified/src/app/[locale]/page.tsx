import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Chakra_Petch } from 'next/font/google';
import { notFound } from 'next/navigation';
import { isSupportedLocale, parseLocation } from 'portfolio-content-model';

import { env } from '@/env';
import PortfolioClient from '@/features/gamified/components/portfolio-client';
import { A11yProvider } from '@/features/gamified/contexts/a11y-context';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { serializeJsonLd } from '@/shared/utils/json-ld';
import { PORTFOLIO_OG_IMAGE } from '@/shared/utils/portfolio-og-image';

const chakraPetch = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-chakra-petch',
  display: 'swap',
});

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);

  const portfolioData = await cmsClient.getPortfolio(locale);
  if (!portfolioData) return {};

  const t = await getTranslations({ locale, namespace: 'gamified.metadata' });
  const { name, role, skills, careerYears, location } = portfolioData;
  const title = t('title', { name, role });
  const description = t('description', { name, role, years: careerYears, location });
  const keywords = t('keywords', { name, role, keywords: skills.map((skill) => skill.name).join(', ') });

  const href = { pathname: '/' } as const;

  return {
    title,
    description,
    keywords,
    authors: [{ name, url: portfolioData.githubUrl }],
    creator: name,
    icons: {
      icon: '/favicon-gamified.svg',
      shortcut: '/favicon-gamified.svg',
      apple: '/favicon-gamified.svg',
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

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: 'gamified.layout' });

  const { name, role, githubUrl, linkedinUrl } = data;
  const parsedAddress = parseLocation(data.location);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    email: data.email,
    url: `${env.MY_DOMAIN}${getPathname({ locale, href: { pathname: '/' } })}`,
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
    <div className={chakraPetch.variable}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999] focus:bg-cv-panel focus:text-cv-cyan focus:border focus:border-cv-cyan focus:px-4 focus:py-2 focus:font-cv-mono focus:text-[13px] focus:no-underline"
      >
        {t('skipToContent')}
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <A11yProvider>
        <PortfolioClient data={data} />
      </A11yProvider>
      {/* Portal root for modals — inside the font-variable scope so CSS vars cascade */}
      <div id="gamified-portal-root" className="font-cv-mono" />
    </div>
  );
}
