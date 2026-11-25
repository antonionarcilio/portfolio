import { useTranslations } from 'next-intl';

import type { ProjectCardSummary } from '@/shared/utils/project-card-summary';

import { CmsProjectCard } from './cms-project-card';

type WorksProjectsSectionProps = {
  projects: ProjectCardSummary[];
};

export function WorksProjectsSection({ projects }: WorksProjectsSectionProps) {
  const t = useTranslations('pro.works');

  return (
    <section>
      <ul
        aria-label={t('projectsLabel')}
        className="grid w-full grid-cols-1 gap-x-3xl gap-y-3xl cards-two-columns:grid-cols-[repeat(2,minmax(0,1fr))]"
      >
        {projects.map((project) => (
          <li key={project.slug}>
            <CmsProjectCard project={project} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </section>
  );
}
