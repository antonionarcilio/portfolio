const EN_DASH = '–';

/**
 * Período de um projeto a partir das datas ISO do CMS: "2022" quando começa e termina no mesmo
 * ano, "2022 – 2023" num intervalo e "2022 – Atual" quando não há `endDate`.
 * @example formatProjectPeriod('2022-04-04', '2022-12-30', 'Atual') // "2022"
 */
export function formatProjectPeriod(
  startDate: string,
  endDate: string | null | undefined,
  presentLabel: string,
): string {
  const startYear = startDate.slice(0, 4);
  if (!endDate) return `${startYear} ${EN_DASH} ${presentLabel}`;
  const endYear = endDate.slice(0, 4);
  return endYear === startYear ? startYear : `${startYear} ${EN_DASH} ${endYear}`;
}
