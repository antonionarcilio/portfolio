import type { ProjectEntry } from 'portfolio-content-model';

const VISIBLE_STACK_COUNT = 2;

/** Dados de um card de projeto (home e /works) derivados de um `ProjectEntry` do CMS. */
export type ProjectCardSummary = {
  slug: string;
  imageSrc: string;
  title: string;
  year: string;
  role: string;
  techStack: string;
};

/** "React, JavaScript +3": as primeiras tecnologias e a contagem das que ficaram de fora. */
function formatTechStack(stacks: string[]): string {
  const visible = stacks.slice(0, VISIBLE_STACK_COUNT).join(', ');
  const hiddenCount = stacks.length - VISIBLE_STACK_COUNT;
  return hiddenCount > 0 ? `${visible} +${hiddenCount}` : visible;
}

/** Projeto sem `order` no CMS vai para o fim da fila de importância. */
function orderOrLast(project: ProjectEntry): number {
  return project.order ?? Number.POSITIVE_INFINITY;
}

/**
 * Projetos com ao menos uma imagem em `gallery`, ordenados pelo campo `order` do CMS (menor primeiro).
 * O sort é estável: empates e projetos sem `order` mantêm a ordem do CMS.
 * @example sortProjectsByOrder(portfolio.projects)
 */
export function sortProjectsByOrder(projects: ProjectEntry[]): ProjectEntry[] {
  return projects.filter((project) => project.galleryImages.length > 0).sort((a, b) => orderOrLast(a) - orderOrLast(b));
}

/** A capa é a primeira imagem de `gallery`; só chame com projetos vindos de `sortProjectsByOrder`. */
export function toProjectCardSummary(project: ProjectEntry): ProjectCardSummary {
  return {
    slug: project.slug,
    imageSrc: project.galleryImages[0],
    title: project.projectName,
    year: project.startDate.slice(0, 4),
    role: project.expertiseArea,
    techStack: formatTechStack(project.stacks),
  };
}
