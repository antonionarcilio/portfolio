import { useTranslations } from 'next-intl';

import { ProjectCoverCard } from './project-cover-card';
import type { ProjectDetail } from './project-details';

type ProjectCoversColumnProps = {
  project: ProjectDetail;
};

/** Right column of the project page: the stacked cover cards. */
export function ProjectCoversColumn({ project }: ProjectCoversColumnProps) {
  const t = useTranslations('pro.projectDetail');
  const title = t(`projects.${project.messageKey}.title`);

  return (
    <ul className="flex w-[450px] flex-col gap-[32px]" aria-label={t('coversLabel', { title })}>
      {project.covers.map((cover, index) => (
        <li key={index}>
          <ProjectCoverCard cover={cover} alt={t('coverAlt', { title, position: index + 1 })} />
        </li>
      ))}
    </ul>
  );
}
