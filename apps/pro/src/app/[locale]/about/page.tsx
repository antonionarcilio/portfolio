import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { BioSection } from '@/features/about/bio-section';
import { EducationSection } from '@/features/about/education-section';
import { AboutHeroSection } from '@/features/about/hero-section';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { ContactSection } from '@/shared/components/contact-section';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const { name, role, location, bio, linkedinUrl, githubUrl, email, experience } = data;
  const t = await getTranslations({ locale, namespace: 'pro.about' });

  return (
    <main className="flex flex-col gap-[var(--home-section-gap)] pb-[var(--home-section-gap)]">
      <AboutHeroSection />
      <BioSection
        name={name}
        role={role}
        location={location}
        bio={bio?.description ?? ''}
        linkedinUrl={linkedinUrl}
        githubUrl={githubUrl}
        email={email}
        experience={experience}
      />
      <EducationSection />
      <ContactSection
        heading={t('contactHeading')}
        body={t('contactBody')}
        linkedinUrl={linkedinUrl}
        githubUrl={githubUrl}
      />
    </main>
  );
}
