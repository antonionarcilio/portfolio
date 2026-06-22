import 'server-only';

import { DEFAULT_LOCALE } from '@/shared/i18n/locales';
import type { PortfolioData } from '@/shared/types/portfolio';

import { mapStrapiToPortfolio } from './map-portfolio';
import { fetchStrapiPortfolio } from './strapi-client';

export async function getPortfolio(locale = DEFAULT_LOCALE): Promise<PortfolioData | null> {
  const raw = await fetchStrapiPortfolio(locale);
  if (!raw) return null;
  return mapStrapiToPortfolio(raw);
}
