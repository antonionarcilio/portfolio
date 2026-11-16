import type { ProjectEntry } from 'portfolio-content-model';

const KEYWORD_STACK_COUNT = 6;

/** Nome, área e as primeiras tecnologias do projeto, sem repetições (comparação sem caixa). */
export function buildProjectKeywords(project: ProjectEntry): string[] {
  const candidates = [project.projectName, project.expertiseArea, ...project.stacks.slice(0, KEYWORD_STACK_COUNT)];
  const seen = new Set<string>();
  return candidates.filter((keyword) => {
    const key = keyword.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
