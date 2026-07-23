export interface XpLevel {
  label: string;
  fill: number;
  sub: string;
}

/**
 * Calcula os dados de nível/XP da barra de progresso a partir de meses de experiência.
 * 1 ano = 1 nível; cada nível vale `workingDaysPerYear` dias de XP.
 *
 * Portado de volta do Strapi (`derive.ts`), que por sua vez portou do frontend
 * (`calc-level.ts`/`career-years.ts`) — a lógica é pura, sem I/O.
 */
export function calcXpLevel(months: number, workingDaysPerYear = 261): XpLevel {
  const currentLevel = Math.floor(months / 12);
  const nextLevelXp = (currentLevel + 1) * workingDaysPerYear;
  const currentXp = Math.round((months / 12) * workingDaysPerYear);
  const fill = Math.round(((months % 12) / 12) * 100);

  return {
    label: `Level ${currentLevel} — Experience`,
    fill,
    sub: `${currentXp} / ${nextLevelXp}`,
  };
}
