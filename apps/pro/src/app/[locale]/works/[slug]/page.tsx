import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isSupportedLocale } from 'portfolio-content-model';

import { ProjectOverviewSection } from '@/features/project-detail/project-overview-section';
import { RelatedProjectsSection } from '@/features/project-detail/related-projects-section';
import { selectRelatedCandidates } from '@/features/project-detail/select-related-candidates';
import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { ContactSection } from '@/shared/components/contact-section';
import { JsonLdScript } from '@/shared/components/json-ld-script';
import { buildPageMetadata } from '@/shared/utils/build-page-metadata';
import { buildProjectKeywords } from '@/shared/utils/project-seo';
import { buildBreadcrumbNode, buildCreativeWorkNode, buildJsonLdGraph } from '@/shared/utils/structured-data';

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) return {};
  setRequestLocale(locale);
  const data = await cmsClient.getPortfolio(locale);
  const project = data?.projects.find((candidate) => candidate.slug === slug);
  if (!data || !project) return {};

  const t = await getTranslations({ locale, namespace: 'pro.metadata' });
  const values = { name: data.name, projectName: project.projectName, expertiseArea: project.expertiseArea };

  return buildPageMetadata({
    locale,
    pathname: `/works/${slug}`,
    title: t('projectTitle', values),
    // O excerpt do CMS se repete entre projetos parecidos (site/blog de clientes diferentes); o nome do projeto
    // diferencia cada description. O campo `company` não serve: vale "Escallo" em todos os projetos.
    description: project.excerpt
      ? t('projectDescriptionWithName', { projectName: project.projectName, excerpt: project.excerpt })
      : t('projectFallbackDescription', values),
    siteName: data.name,
    keywords: buildProjectKeywords(project),
  });
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
  const tNav = await getTranslations({ locale, namespace: 'pro.nav' });
  const jsonLd = buildJsonLdGraph([
    buildBreadcrumbNode(locale, [
      { name: tNav('home'), pathname: '/' },
      { name: tNav('works'), pathname: '/works' },
      { name: project.projectName, pathname: `/works/${slug}` },
    ]),
    buildCreativeWorkNode({
      locale,
      slug,
      name: project.projectName,
      description: project.excerpt,
      startDate: project.startDate,
      keywords: project.stacks,
      imageUrl: project.carrouselImages[0] ?? project.galleryImages[0],
    }),
  ]);

  return (
    <>
      <JsonLdScript document={jsonLd} />
      {/* Mesma estrutura de home/about/works: gap de `--home-section-gap` entre seções e `pb` de
          mesmo tamanho separando a última seção do footer. */}
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
    </>
  );
}
