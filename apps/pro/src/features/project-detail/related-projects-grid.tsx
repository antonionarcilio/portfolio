'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { CmsProjectCard } from '@/features/works/cms-project-card';
import { relatedProjectsFadeVariants } from '@/shared/animations';
import { pickRandomItems } from '@/shared/utils/pick-random-items';
import type { ProjectCardSummary } from '@/shared/utils/project-card-summary';

export const RELATED_PROJECTS_COUNT = 2;

type RelatedProjectsGridProps = {
  /** Every project except the current one, in CMS `order`. */
  candidates: ProjectCardSummary[];
};

/**
 * Two random "see also" cards, drawn again on every visit. The server renders the first candidates
 * (so the HTML has real links and matches hydration); the draw runs after mount and the grid fades in.
 * @example <RelatedProjectsGrid candidates={selectRelatedCandidates(projects, 'portal')} />
 */
export function RelatedProjectsGrid({ candidates }: RelatedProjectsGridProps) {
  const t = useTranslations('pro.projectDetail');
  const [projects, setProjects] = useState(() => candidates.slice(0, RELATED_PROJECTS_COUNT));
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    setProjects(pickRandomItems(candidates, RELATED_PROJECTS_COUNT));
    setHasDrawn(true);
  }, [candidates]);

  return (
    <motion.ul
      aria-label={t('relatedLabel')}
      variants={relatedProjectsFadeVariants}
      initial="hidden"
      animate={hasDrawn ? 'visible' : 'hidden'}
      className="grid w-full grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[32px] gap-y-[32px]"
    >
      {projects.map((project) => (
        <li key={project.slug}>
          <CmsProjectCard project={project} />
        </li>
      ))}
    </motion.ul>
  );
}
