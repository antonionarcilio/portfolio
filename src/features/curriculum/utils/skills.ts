export const SKILL_MAX_HOURS = 10_000;

export function skillRank(years: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (years >= 9) return 'S';
  if (years >= 7) return 'A';
  if (years >= 5) return 'B';
  if (years >= 3) return 'C';
  if (years >= 1) return 'D';
  return 'F';
}

export function sumMinutes(minutes: number[]): number {
  return minutes.reduce((a, b) => a + b, 0);
}

export function toHours(minutes: number[]): number {
  return Math.round(sumMinutes(minutes) / 60);
}

export function skillPct(minutes: number[]): number {
  return Math.min(Math.round((toHours(minutes) / SKILL_MAX_HOURS) * 100), 100);
}

export function skillLabel(minutes: number[]): string {
  const h = toHours(minutes);
  const k = h / 1000;
  if (k >= 10) return `${Math.round(k)}K`;
  if (k >= 1) return `${k.toFixed(1)}K`;
  return `${h}h`;
}
