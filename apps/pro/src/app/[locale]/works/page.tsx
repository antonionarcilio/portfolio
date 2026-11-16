import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { WorksHeroSection } from '@/features/works/hero-section';
import { WorksProjectsSection } from '@/features/works/projects-section';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { ContactSection } from '@/shared/components/contact-section';
import { JsonLdScript } from '@/shared/components/json-ld-script';
import { buildSectionMetadata } from '@/shared/utils/build-section-metadata';
import { sortProjectsByOrder, toProjectCardSummary } from '@/shared/utils/project-card-summary';
import { buildCollectionPageNode, buildJsonLdGraph } from '@/shared/utils/structured-data';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildSectionMetadata(locale, 'works');
}

export default async function WorksPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: 'pro.works' });
  const tMetadata = await getTranslations({ locale, namespace: 'pro.metadata' });
  const projects = sortProjectsByOrder(data.projects).map(toProjectCardSummary);
  const jsonLd = buildJsonLdGraph([
    buildCollectionPageNode(
      locale,
      tMetadata('worksTitle', { name: data.name, role: data.role }),
      projects.map((project) => ({ slug: project.slug, name: project.title })),
    ),
  ]);

  return (
    <>
      <JsonLdScript document={jsonLd} />
      {/* Mesma estrutura de home/about: gap de `--home-section-gap` entre seções e `pb`
          de mesmo tamanho separando a última seção do footer. */}
      <main className="flex flex-col gap-[var(--home-section-gap)] pb-[var(--home-section-gap)]">
        {/* Seções 1 e 2 pertencem ao mesmo container do Figma ("Frame 2", 986px): gap de 32px entre
          elas, e não o `--home-section-gap` que separa o container da seção de contato. */}
        <div className="mx-auto flex w-full max-w-[986px] flex-col gap-[32px]">
          <WorksHeroSection />
          <WorksProjectsSection projects={projects} />
        </div>
        <ContactSection
          heading={t('contactHeading')}
          body={t('contactBody')}
          linkedinUrl={data.linkedinUrl}
          githubUrl={data.githubUrl}
        />
      </main>
    </>
  );
}
