import { notFound } from 'next/navigation';

import { env } from '@/env';
import PortfolioClient from '@/features/gamer/components/portfolio-client';
import { getPortfolio } from '@/shared/data/get-portfolio';
import { getXpStats } from '@/shared/data/get-xp-stats';
import { SUPPORTED_LOCALES, isSupportedLocale } from '@/shared/i18n/locales';
import { serializeJsonLd } from '@/shared/utils/json-ld';
import type { Metadata } from 'next';

/** Impede geração dinâmica de rotas fora dos locales suportados (retorna 404). */
export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};

  const portfolioData = await getPortfolio(locale);
  if (!portfolioData) return {};

  const { name, role, skills, careerYears } = portfolioData;
  const years = careerYears;
  const title = `${name} — ${role}`;
  const description = `Portfolio de ${name}, ${role} com ${years}+ anos de experiência em React, Next.js e TypeScript. São Luís, MA — Brasil.`;
  const keywords = [role, ...skills.map((skill) => skill.name), 'Portfolio', name, 'Desenvolvedor Frontend'];

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
      canonical: `/portfolios/gamer/${locale}`,
      languages: {
        'pt-BR': '/portfolios/gamer/pt-BR',
        en: '/portfolios/gamer/en',
      },
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

  const [portfolioData, xpStats] = await Promise.all([getPortfolio(locale), getXpStats(locale)]);
  if (!portfolioData) notFound();

  const data = xpStats ? { ...portfolioData, level: xpStats } : portfolioData;

  const { name, role, githubUrl, linkedinUrl } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    email: portfolioData.email,
    url: `${env.MY_DOMAIN}/portfolios/gamer/${locale}`,
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
