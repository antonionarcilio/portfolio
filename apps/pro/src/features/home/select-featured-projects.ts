import type { ProjectEntry } from 'portfolio-content-model';

import {
  sortProjectsByOrder,
  toProjectCardSummary,
  type ProjectCardSummary,
} from '@/shared/utils/project-card-summary';

export const FEATURED_PROJECTS_COUNT = 3;

/**
 * Os projetos mais importantes segundo o campo `order` do CMS (menor = mais importante).
 * @example selectFeaturedProjects(portfolio.projects) // os 3 primeiros por `order`
 */
export function selectFeaturedProjects(projects: ProjectEntry[]): ProjectCardSummary[] {
  return sortProjectsByOrder(projects).slice(0, FEATURED_PROJECTS_COUNT).map(toProjectCardSummary);
}

/** Quantos projetos ficam fora dos cards da home — vira o "+N" do botão; `undefined` quando não sobra nenhum. */
export function formatRemainingProjectsHint(totalProjects: number): string | undefined {
  const remaining = totalProjects - FEATURED_PROJECTS_COUNT;
  return remaining > 0 ? `+${remaining}` : undefined;
}
