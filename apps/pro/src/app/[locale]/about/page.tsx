import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { BioSection } from '@/features/about/bio-section';
import { EducationSection } from '@/features/about/education-section';
import { AboutHeroSection } from '@/features/about/hero-section';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { ContactSection } from '@/shared/components/contact-section';
import { JsonLdScript } from '@/shared/components/json-ld-script';
import { buildSectionMetadata } from '@/shared/utils/build-section-metadata';
import { buildJsonLdGraph, buildPersonNode, buildProfilePageNode } from '@/shared/utils/structured-data';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildSectionMetadata(locale, 'about');
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const { name, role, location, bio, avatarUrl, linkedinUrl, githubUrl, email, experience, education } = data;
  const t = await getTranslations({ locale, namespace: 'pro.about' });
  const tMetadata = await getTranslations({ locale, namespace: 'pro.metadata' });
  const jsonLd = buildJsonLdGraph([
    buildProfilePageNode(locale, tMetadata('aboutTitle', { name, role })),
    buildPersonNode(locale, { name, role, email, location, profileUrls: [githubUrl, linkedinUrl] }),
  ]);

  return (
    <>
      <JsonLdScript document={jsonLd} />
      <main className="flex flex-col gap-[var(--home-section-gap)] pb-[var(--home-section-gap)]">
        <AboutHeroSection />
        <BioSection
          name={name}
          role={role}
          location={location}
          bio={bio?.description ?? ''}
          avatarUrl={avatarUrl}
          linkedinUrl={linkedinUrl}
          githubUrl={githubUrl}
          email={email}
          experience={experience}
        />
        <EducationSection education={education} />
        <ContactSection
          heading={t('contactHeading')}
          body={t('contactBody')}
          linkedinUrl={linkedinUrl}
          githubUrl={githubUrl}
        />
      </main>
    </>
  );
}
