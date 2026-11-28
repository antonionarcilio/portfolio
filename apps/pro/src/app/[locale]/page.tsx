import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { CriteriaSection } from '@/features/home/criteria-section';
import { HeroSection } from '@/features/home/hero-section';
import { ProjectsSection } from '@/features/home/projects-section';
import { QualitySection } from '@/features/home/quality-section';
import { formatRemainingProjectsHint, selectFeaturedProjects } from '@/features/home/select-featured-projects';
import { SkillsSection } from '@/features/home/skills-section';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { ContactSection } from '@/shared/components/contact-section';
import { JsonLdScript } from '@/shared/components/json-ld-script';
import { buildPageMetadata } from '@/shared/utils/build-page-metadata';
import { buildJsonLdGraph, buildPersonNode, buildWebsiteNode } from '@/shared/utils/structured-data';

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
  // A description reaproveita o H1 da home para os dois textos nunca divergirem.
  const tHome = await getTranslations({ locale, namespace: 'pro.home' });
  const heading = tHome('heroHeading');

  return {
    ...buildPageMetadata({
      locale,
      pathname: '/',
      title: t('title', { name, role }),
      description: t('description', { heading }),
      siteName: name,
      keywords: t('keywords').split(', '),
    }),
    authors: [{ name, url: portfolio.githubUrl }],
    creator: name,
  };
}

export default async function ProPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);
  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const { name, role, email, location, githubUrl, linkedinUrl } = data;
  const t = await getTranslations({ locale, namespace: 'pro.home' });

  const jsonLd = buildJsonLdGraph([
    buildWebsiteNode(locale, name),
    buildPersonNode(locale, { name, role, email, location, profileUrls: [githubUrl, linkedinUrl] }),
  ]);

  return (
    <>
      <JsonLdScript document={jsonLd} />
      {/* Main: gap de `--spacing-section` entre todas as seções; skills sticky no rodapé
          da viewport; `pb` de mesmo tamanho separa a última seção do footer.
          `compact-mobile-section-gap` reduz o gap no mobile (ver features/home/styles.css). */}
      <main className="flex flex-col gap-section pb-section max-tablet:gap-section-compact max-tablet:pb-section-compact">
        <HeroSection />
        {/* Skills bar: sticky at viewport bottom (visible from scroll=0) from 1020px up; in the normal flow below that */}
        <div className="z-20 desktop:sticky desktop:bottom-0">
          <SkillsSection />
        </div>
        <QualitySection
          careerYears={data.careerYears}
          projectsCount={data.projects.length}
          skillsCount={data.skills.length}
        />
        <ProjectsSection
          projects={selectFeaturedProjects(data.projects)}
          remainingHint={formatRemainingProjectsHint(data.projects.length)}
        />
        <CriteriaSection />
        {/* Wrapper só na home: ContactSection é compartilhada com about/works, que não recebem o mt no mobile */}
        <div className="max-tablet:mt-[40px]">
          <ContactSection
            heading={t('contactHeading')}
            body={t('contactBody')}
            linkedinUrl={linkedinUrl}
            githubUrl={githubUrl}
          />
        </div>
      </main>
    </>
  );
}
