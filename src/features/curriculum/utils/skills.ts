export const SKILL_MAX_HOURS = 10_000;

export function skillRank(years: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (years >= 9) return 'S';
  if (years >= 7) return 'A';
  if (years >= 5) return 'B';
  if (years >= 3) return 'C';
  if (years >= 1) return 'D';
  return 'F';
}
