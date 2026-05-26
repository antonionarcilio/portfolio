import type { ExperienceEntry } from '@/features/gamer/types/portfolio';

const PT_BR_MONTHS: Record<number, string> = {
  0: 'Jan',
  1: 'Fev',
  2: 'Mar',
  3: 'Abr',
  4: 'Mai',
  5: 'Jun',
  6: 'Jul',
  7: 'Ago',
  8: 'Set',
  9: 'Out',
  10: 'Nov',
  11: 'Dez',
};

function formatMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  return `${PT_BR_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * Returns a human-readable date range for an experience entry.
 * When `endDate` is absent or null, "atual" is used as the end label.
 *
 * @example
 * formatExperienceDateRange({ startDate: '2021-03-01', endDate: null })
 * // "Mar 2021 — atual"
 *
 * formatExperienceDateRange({ startDate: '2021-03-01', endDate: '2026-05-01' })
 * // "Mar 2021 — Mai 2026"
 */
export function formatExperienceDateRange(entry: Pick<ExperienceEntry, 'startDate' | 'endDate'>): string {
  const start = formatMonthYear(entry.startDate);
  const end = entry.endDate ? formatMonthYear(entry.endDate) : 'atual';
  return `${start} — ${end}`;
}
