import type { ExperienceEntry } from 'portfolio-content-model';

/**
 * Experiências da mais atual para a mais antiga: a que está em andamento (sem `endDate`) vem
 * primeiro; depois, pelo término mais recente, desempatando pelo início mais recente.
 * @example sortExperienceByRecency(portfolio.experience)[0] // a experiência atual
 */
export function sortExperienceByRecency(experience: ExperienceEntry[]): ExperienceEntry[] {
  return [...experience].sort((a, b) => {
    const endComparison = (b.endDate ?? '9999-12-31').localeCompare(a.endDate ?? '9999-12-31');
    return endComparison !== 0 ? endComparison : b.startDate.localeCompare(a.startDate);
  });
}
