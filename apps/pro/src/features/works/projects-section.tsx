import { useTranslations } from 'next-intl';

import { ProjectListCard } from './project-list-card';
import { WORKS_PROJECTS } from './projects';

export function WorksProjectsSection() {
  const t = useTranslations('pro.works');

  return (
    <section>
      <ul
        aria-label={t('projectsLabel')}
        className="grid w-full grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[32px] gap-y-[32px]"
      >
        {WORKS_PROJECTS.map((project) => (
          <li key={project.id}>
            <ProjectListCard
              slug={project.id}
              cover={project.cover}
              title={t(`projectTitles.${project.titleKey}`)}
              role={t(`projectRoles.${project.roleKey}`)}
              year={project.year}
              techStack={project.techStack}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
