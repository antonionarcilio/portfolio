export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isSupportedLocale, type SupportedLocale } from './i18n/locales';
export { parsePortfolioData, portfolioDataSchema } from './schema';
export type { ExperienceEntry, PortfolioData, ProjectEntry, Seniority } from './types/portfolio';
export {
  parseEducationLocation,
  parseLocation,
  type ParsedEducationLocation,
  type ParsedLocation,
} from './utils/location';
