import type { ExperienceEntry } from '@/shared/types/portfolio';

function formatMonthYear(isoDate: string, locale: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

/**
 * Returns a human-readable date range for an experience entry.
 * When `endDate` is absent or null, `presentLabel` is used as the end label.
 *
 * @example
 * formatExperienceDateRange({ startDate: '2021-03-01', endDate: null }, 'pt-BR', 'atual')
 * // "mar de 2021 — atual"
 */
export function formatExperienceDateRange(
  entry: Pick<ExperienceEntry, 'startDate' | 'endDate'>,
  locale: string,
  presentLabel: string,
): string {
  const start = formatMonthYear(entry.startDate, locale);
  const end = entry.endDate ? formatMonthYear(entry.endDate, locale) : presentLabel;
  return `${start} — ${end}`;
}

/**
 * Returns the year range for an experience entry as a short string.
 * Collapses to a single year when start and end fall in the same year.
 * Uses `presentLabel` when endDate is absent.
 *
 * @example
 * formatYearRange({ startDate: '2021-03-01', endDate: '2021-12-01' }, 'atual')
 * // "2021"
 */
export function formatYearRange(entry: Pick<ExperienceEntry, 'startDate' | 'endDate'>, presentLabel: string): string {
  const startYear = new Date(entry.startDate).getUTCFullYear();
  const endYear = entry.endDate ? String(new Date(entry.endDate).getUTCFullYear()) : presentLabel;
  if (String(startYear) === endYear) return String(startYear);
  return `${startYear} — ${endYear}`;
}
