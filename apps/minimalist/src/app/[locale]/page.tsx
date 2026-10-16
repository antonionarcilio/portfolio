import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale, parseLocation, type PortfolioData } from 'portfolio-content-model';

import { env } from '@/env';
import { ACTIVE_SECTION_STORAGE_KEY, MINIMALIST_SECTION_IDS } from '@/features/minimalist/utils/preferences';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { serializeJsonLd } from '@/shared/utils/json-ld';
import { PORTFOLIO_OG_IMAGE } from '@/shared/utils/portfolio-og-image';

import { MinimalistPageContent } from './minimalist-page-content';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);
  const portfolio = await cmsClient.getPortfolio(locale);
  if (!portfolio) return {};
  const t = await getTranslations({ locale, namespace: 'minimalist.metadata' });
  const { name, role, skills, bio, highlightText } = portfolio;
  const title = t('title', { name, role });
  const description = bio?.excerpt ?? highlightText ?? t('description', { name, role });
  const keywords = t('keywords', { name, role, keywords: skills.map((skill) => skill.name).join(', ') });

  const href = { pathname: '/' } as const;

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

function MinimalistPreHydrationScript() {
  const sectionIds = MINIMALIST_SECTION_IDS.map((id) => `'${id}'`).join(',');
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  var stored = null;
  try {
    stored = window.sessionStorage.getItem('${ACTIVE_SECTION_STORAGE_KEY}');
  } catch (error) {}
  if (!stored) return;
  var sections = [${sectionIds}];
    var index = sections.indexOf(stored);
  if (index > 0) {
    var root = document.documentElement;
    root.classList.add('minimalist-pre-hydration');
    root.style.setProperty('--minimalist-active-section-offset', String(index * -25) + '%');
  }
})();
`,
      }}
    />
  );
}

function buildJsonLd(locale: string, data: PortfolioData) {
  const { name, role, githubUrl, linkedinUrl } = data;
  const parsedAddress = parseLocation(data.location);

  return {
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
}

export default async function MinimalistPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);
  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: 'minimalist.layout' });

  return (
    <div className="minimalist-layout">
      <MinimalistPreHydrationScript />
      <a
        className="absolute top-[-100px] left-4 z-2 bg-minimalist-foreground px-3 py-2 text-minimalist-background focus:top-4"
        href="#main-content"
      >
        {t('skipToContent')}
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd(locale, data)) }}
      />
      <MinimalistPageContent data={data} locale={locale as 'en' | 'pt-BR'} />
    </div>
  );
}
