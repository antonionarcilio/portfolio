import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { ProjectOverviewSection } from '@/features/project-detail/project-overview-section';
import { RelatedProjectsSection } from '@/features/project-detail/related-projects-section';
import { selectRelatedCandidates } from '@/features/project-detail/select-related-candidates';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { ContactSection } from '@/shared/components/contact-section';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const paramsPerLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const data = await cmsClient.getPortfolio(locale);
      return (data?.projects ?? []).map((project) => ({ locale, slug: project.slug }));
    }),
  );
  return paramsPerLocale.flat();
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) notFound();
  setRequestLocale(locale);

  const data = await cmsClient.getPortfolio(locale);
  if (!data) notFound();

  const project = data.projects.find((candidate) => candidate.slug === slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: 'pro.projectDetail' });

  return (
    // Mesma estrutura de home/about/works: gap de `--home-section-gap` entre seções e `pb` de
    // mesmo tamanho separando a última seção do footer.
    <main className="flex flex-col gap-[var(--home-section-gap)] pb-[var(--home-section-gap)]">
      <ProjectOverviewSection project={project} />
      <RelatedProjectsSection candidates={selectRelatedCandidates(data.projects, project.slug)} />
      <ContactSection
        heading={t('contactHeading')}
        body={t('contactBody')}
        linkedinUrl={data.linkedinUrl}
        githubUrl={data.githubUrl}
      />
    </main>
  );
}
