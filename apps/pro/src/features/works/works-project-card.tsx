import { useTranslations } from 'next-intl';

import { ProjectListCard } from './project-list-card';
import type { WorksProject } from './projects';

type WorksProjectCardProps = {
  project: WorksProject;
};

/**
 * Translates a static works project and renders its list card; shared by the works grid and the
 * "see also" section of the project page so both always show the same card.
 * @example <WorksProjectCard project={WORKS_PROJECTS[0]} />
 */
export function WorksProjectCard({ project }: WorksProjectCardProps) {
  const t = useTranslations('pro.works');

  return (
    <ProjectListCard
      slug={project.id}
      cover={project.cover}
      title={t(`projectTitles.${project.titleKey}`)}
      role={t(`projectRoles.${project.roleKey}`)}
      year={project.year}
      techStack={project.techStack}
    />
  );
}
