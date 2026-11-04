export function formatCareerYears(months: number): { years: number; approximate: boolean } {
  return { years: Math.floor(months / 12), approximate: months % 12 !== 0 };
}
