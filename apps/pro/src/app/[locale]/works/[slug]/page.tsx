import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { findProjectDetail, PROJECT_DETAILS } from '@/features/project-detail/project-details';
import { ProjectOverviewSection } from '@/features/project-detail/project-overview-section';
import { RelatedProjectsSection } from '@/features/project-detail/related-projects-section';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { ContactSection } from '@/shared/components/contact-section';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => PROJECT_DETAILS.map((project) => ({ locale, slug: project.slug })));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const project = findProjectDetail(slug);
  if (!project) notFound();

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: 'pro.projectDetail' });

  return (
    // Mesma estrutura de home/about/works: gap de `--home-section-gap` entre seções e `pb` de
    // mesmo tamanho separando a última seção do footer.
    <main className="flex flex-col gap-[var(--home-section-gap)] pb-[var(--home-section-gap)]">
      <ProjectOverviewSection project={project} />
      <RelatedProjectsSection currentSlug={project.slug} />
      <ContactSection
        heading={t('contactHeading')}
        body={t('contactBody')}
        linkedinUrl={data.linkedinUrl}
        githubUrl={data.githubUrl}
      />
    </main>
  );
}
