import { useTranslations } from 'next-intl';

import { WORKS_PROJECTS } from './projects';
import { WorksProjectCard } from './works-project-card';

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
            <WorksProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
