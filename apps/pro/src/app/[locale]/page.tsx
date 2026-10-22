import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { env } from '@/env';
import { ContactSection } from '@/features/home/contact-section';
import { CriteriaSection } from '@/features/home/criteria-section';
import { HeroSection } from '@/features/home/hero-section';
import { ProjectsSection } from '@/features/home/projects-section';
import { QualitySection } from '@/features/home/quality-section';
import { SkillsSection } from '@/features/home/skills-section';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { serializeJsonLd } from '@/shared/utils/json-ld';
import { PORTFOLIO_OG_IMAGE } from '@/shared/utils/portfolio-og-image';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);
  const portfolio = await cmsClient.getPortfolio(locale);
  if (!portfolio) return {};

  const t = await getTranslations({ locale, namespace: 'pro.metadata' });
  const { name, role } = portfolio;
  const title = t('title', { name, role });
  const description = t('description', { name, role });
  const href = { pathname: '/' } as const;

  return {
    metadataBase: new URL(env.MY_DOMAIN),
    title,
    description,
    authors: [{ name, url: portfolio.githubUrl }],
    creator: name,
    icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg' },
    alternates: {
      canonical: getPathname({ locale, href }),
      languages: Object.fromEntries(routing.locales.map((loc) => [loc, getPathname({ locale: loc, href })])),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      title,
      description,
      siteName: name,
      images: [{ ...PORTFOLIO_OG_IMAGE, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ ...PORTFOLIO_OG_IMAGE, alt: name }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function ProPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);
  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const { name, role, email, githubUrl, linkedinUrl } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    email,
    url: `${env.MY_DOMAIN}${getPathname({ locale, href: { pathname: '/' } })}`,
    sameAs: [githubUrl, linkedinUrl],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      {/* Main: gap de `--home-section-gap` entre todas as seções; skills sticky no rodapé
          da viewport; `pb` de mesmo tamanho separa a última seção do footer */}
      <main className="flex flex-col gap-[var(--home-section-gap)] pb-[var(--home-section-gap)]">
        <HeroSection />
        {/* Skills bar: sticky at viewport bottom, visible from scroll=0 */}
        <div className="sticky bottom-0 z-20">
          <SkillsSection />
        </div>
        <QualitySection />
        <ProjectsSection />
        <CriteriaSection />
        <ContactSection linkedinUrl={linkedinUrl} githubUrl={githubUrl} />
      </main>
    </>
  );
}
