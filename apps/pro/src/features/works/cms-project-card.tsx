import type { ProjectCardSummary } from '@/shared/utils/project-card-summary';

import { ProjectListCard } from './project-list-card';

type CmsProjectCardProps = {
  project: ProjectCardSummary;
};

/**
 * List card for a project read from the CMS: cover from `gallery`, with the black 5% card backdrop.
 * @example <CmsProjectCard project={toProjectCardSummary(entry)} />
 */
export function CmsProjectCard({ project }: CmsProjectCardProps) {
  const { slug, imageSrc, title, role, year, techStack } = project;
  return <ProjectListCard slug={slug} cover={imageSrc} title={title} role={role} year={year} techStack={techStack} />;
}
