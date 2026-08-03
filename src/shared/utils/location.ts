export interface ParsedLocation {
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
  isComplete: boolean;
}

const LOCATION_REGEX = /^(.+?),\s*([A-Za-z]{2})\s*[—–-]\s*(.+)$/;
const COUNTRY_NAMES: Record<string, string> = {
  brasil: 'BR',
  brazil: 'BR',
};

function normalizeCountry(country: string): string {
  const trimmedCountry = country.trim();
  if (/^[A-Za-z]{2}$/.test(trimmedCountry)) return trimmedCountry.toUpperCase();

  const countryKey = trimmedCountry
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return COUNTRY_NAMES[countryKey] ?? '';
}

export function parseLocation(location: string): ParsedLocation {
  const match = location.match(LOCATION_REGEX);
  if (match) {
    const addressLocality = match[1].trim();
    const addressRegion = match[2].toUpperCase();
    const addressCountry = normalizeCountry(match[3]);

    return {
      addressLocality,
      addressRegion,
      addressCountry,
      isComplete: Boolean(addressLocality && /^[A-Z]{2}$/.test(addressRegion) && addressCountry),
    };
  }

  return { addressLocality: location.trim(), addressRegion: '', addressCountry: '', isComplete: false };
}
