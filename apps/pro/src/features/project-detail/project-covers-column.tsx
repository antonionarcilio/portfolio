import { useTranslations } from 'next-intl';
import type { ProjectEntry } from 'portfolio-content-model';

import { ProjectCoverCard } from './project-cover-card';

type ProjectCoversColumnProps = {
  project: ProjectEntry;
};

/** Right column of the project page: the stacked cover cards. */
export function ProjectCoversColumn({ project }: ProjectCoversColumnProps) {
  const t = useTranslations('pro.projectDetail');
  const title = project.projectName;

  return (
    <ul className="flex w-[450px] flex-col gap-[32px]" aria-label={t('coversLabel', { title })}>
      {project.galleryImages.map((cover, index) => (
        <li key={index}>
          <ProjectCoverCard cover={cover} alt={t('coverAlt', { title, position: index + 1 })} />
        </li>
      ))}
    </ul>
  );
}
