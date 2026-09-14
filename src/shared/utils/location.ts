export interface ParsedLocation {
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
  isComplete: boolean;
}

export interface ParsedEducationLocation {
  city: string;
  federation: string;
  country: string;
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

/** Divide a localização no formato do CMS (`Cidade, UF - País`) para exibição por extenso na seção de formação. */
export function parseEducationLocation(location: string | null | undefined): ParsedEducationLocation {
  if (!location) return { city: '', federation: '', country: '', isComplete: false };
  const match = location.match(LOCATION_REGEX);
  if (!match) return { city: location.trim(), federation: '', country: '', isComplete: false };
  const city = match[1].trim();
  const federation = match[2].toUpperCase();
  const country = match[3].trim();
  return { city, federation, country, isComplete: Boolean(city && /^[A-Z]{2}$/.test(federation) && country) };
}
