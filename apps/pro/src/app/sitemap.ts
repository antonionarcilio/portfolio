import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { cmsClient } from '@/lib/cms-client';
import { buildAbsoluteUrl } from '@/shared/utils/structured-data';

type SupportedLocale = (typeof routing.locales)[number];

const STATIC_PATHNAMES = ['/', '/about', '/works', '/contact'] as const;

/** Slugs de projeto de cada locale; o CMS pode ter um projeto traduzido em apenas um idioma. */
async function loadSlugsByLocale(): Promise<Map<SupportedLocale, string[]>> {
  const entries = await Promise.all(
    routing.locales.map(async (locale) => {
      const portfolio = await cmsClient.getPortfolio(locale);
      return [locale, (portfolio?.projects ?? []).map((project) => project.slug)] as const;
    }),
  );
  return new Map(entries);
}

function listPathnames(slugsByLocale: Map<SupportedLocale, string[]>): Map<string, SupportedLocale[]> {
  const localesByPathname = new Map<string, SupportedLocale[]>(
    STATIC_PATHNAMES.map((pathname) => [pathname, [...routing.locales]]),
  );
  for (const [locale, slugs] of slugsByLocale) {
    for (const slug of slugs) {
      const pathname = `/works/${slug}`;
      localesByPathname.set(pathname, [...(localesByPathname.get(pathname) ?? []), locale]);
    }
  }
  return localesByPathname;
}

function buildEntry(pathname: string, locale: SupportedLocale, availableLocales: SupportedLocale[]) {
  const languages = Object.fromEntries(
    availableLocales.map((candidate) => [candidate, buildAbsoluteUrl(candidate, pathname)]),
  );
  return {
    url: buildAbsoluteUrl(locale, pathname),
    alternates: { languages },
    changeFrequency: 'monthly' as const,
    priority: pathname === '/' ? 1 : 0.7,
  };
}

// Sem `lastModified`: `new Date()` mudaria a cada build e ensinaria o Google a ignorar o campo.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localesByPathname = listPathnames(await loadSlugsByLocale());
  return [...localesByPathname].flatMap(([pathname, locales]) =>
    locales.map((locale) => buildEntry(pathname, locale, locales)),
  );
}
