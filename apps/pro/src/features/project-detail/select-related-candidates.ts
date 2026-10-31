import type { ProjectEntry } from 'portfolio-content-model';

import {
  sortProjectsByOrder,
  toProjectCardSummary,
  type ProjectCardSummary,
} from '@/shared/utils/project-card-summary';

/**
 * Os projetos que podem aparecer em "Veja também": todos os que têm capa, em `order`, sem o aberto.
 * @example selectRelatedCandidates(portfolio.projects, 'portal') // nunca inclui o `portal`
 */
export function selectRelatedCandidates(projects: ProjectEntry[], currentSlug: string): ProjectCardSummary[] {
  return sortProjectsByOrder(projects)
    .filter((project) => project.slug !== currentSlug)
    .map(toProjectCardSummary);
}
