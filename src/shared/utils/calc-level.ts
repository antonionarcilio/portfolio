/**
 * Computes the XP level data for the progress bar based on months of experience.
 *
 * Progression system:
 * - 1 year of experience = 1 level.
 * - Each level requires 261 working days of XP.
 * - Total experience is stored in months.
 * - The UI displays the level in years and a progress bar toward the next level.
 *
 * Calculation rules:
 * 1. Current level:          level = Math.floor(months / 12)
 * 2. Accumulated XP (days):  currentXp = Math.round((months / 12) * 261)
 * 3. XP for next level:      nextLevelXp = (Math.floor(months / 12) + 1) * 261
 * 4. Progress in level (%):  progress = ((months % 12) / 12) * 100
 * 5. Months into level:      currentLevelMonths = months % 12
 *
 * @example
 * calcXpLevel(53, 261)
 * // { label: 'Nível 4 — Experiência', fill: 42, sub: '1153 / 1305' }
 */
export function calcXpLevel(months: number, workingDaysPerYear: number) {
  const currentLevel = Math.floor(months / 12);
  const nextLevelXp = (currentLevel + 1) * workingDaysPerYear;
  const currentXp = Math.round((months / 12) * workingDaysPerYear);
  const fill = Math.round(((months % 12) / 12) * 100);
  return {
    label: `Nível ${currentLevel} — Experiência`,
    fill,
    sub: `${currentXp} / ${nextLevelXp}`,
  };
}
