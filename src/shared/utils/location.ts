export interface ParsedLocation {
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
}

const LOCATION_REGEX = /^(.+?),\s*([A-Z]{2})\s*[—–-]\s*(.+)$/;

export function parseLocation(location: string): ParsedLocation {
  const match = location.match(LOCATION_REGEX);
  if (match) {
    return {
      addressLocality: match[1].trim(),
      addressRegion: match[2],
      addressCountry: match[3],
    };
  }
  return { addressLocality: location, addressRegion: '', addressCountry: '' };
}
