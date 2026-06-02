import type { ExperienceEntry } from '@/features/gamer/types/portfolio';

/**
 * Calculates total years of professional experience by summing all non-overlapping
 * experience periods. When `endDate` is absent or null, the current date is used.
 *
 * Periods are merged before summing to avoid double-counting overlapping jobs.
 *
 * @example
 * calcTotalCareerYears([{ startDate: '2021-03-01', endDate: null, ... }])
 * // returns 4 in May 2025
 */
export function calcTotalCareerYears(experiences: ExperienceEntry[]): number {
  const now = new Date();

  const intervals = experiences.map((entry) => ({
    start: new Date(entry.startDate).getTime(),
    end: entry.endDate ? new Date(entry.endDate).getTime() : now.getTime(),
  }));

  // Sort by start date ascending before merging
  intervals.sort((a, b) => a.start - b.start);

  const merged = intervals.reduce<Array<{ start: number; end: number }>>((acc, interval) => {
    const last = acc[acc.length - 1];

    if (last && interval.start <= last.end) {
      last.end = Math.max(last.end, interval.end);
      return acc;
    }

    return [...acc, { ...interval }];
  }, []);

  const totalMs = merged.reduce((sum, interval) => sum + (interval.end - interval.start), 0);
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;

  return Math.floor(totalMs / msPerYear);
}
