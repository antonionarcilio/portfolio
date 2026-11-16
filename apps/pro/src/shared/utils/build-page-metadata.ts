import type { Metadata } from 'next';

import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { PORTFOLIO_OG_IMAGE } from '@/shared/utils/portfolio-og-image';

type SupportedLocale = (typeof routing.locales)[number];

export type PageMetadataInput = {
  locale: SupportedLocale;
  /** Caminho sem prefixo de locale (ex.: `/`, `/about`, `/works/bi`) — o prefixo é resolvido por `getPathname`. */
  pathname: string;
  title: string;
  description: string;
  siteName: string;
  /** Palavras-chave-alvo da página; o Google ignora a meta, mas outros buscadores podem usá-la. */
  keywords?: string[];
  /** Imagem de compartilhamento própria da página; sem ela vale `PORTFOLIO_OG_IMAGE`. */
  image?: { url: string; alt: string };
};

const OPEN_GRAPH_LOCALES: Record<SupportedLocale, string> = { 'pt-BR': 'pt_BR', en: 'en_US' };

/**
 * Hreflang vem só do HTML (com `x-default`): `alternateLinks` está desligado em `routing.ts` para não
 * duplicar as mesmas entradas no cabeçalho HTTP `Link`.
 */
function buildLanguageAlternates(pathname: string): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((candidate) => [candidate, getPathname({ locale: candidate, href: pathname })]),
  );
  languages['x-default'] = getPathname({ locale: routing.defaultLocale, href: pathname });
  return languages;
}

/**
 * Metadados completos de uma página pública (title, description, canonical, hreflang, Open Graph, Twitter).
 * `metadataBase` vem do layout raiz, então todas as URLs relativas viram absolutas.
 *
 * @example
 * return buildPageMetadata({ locale, pathname: '/about', title, description, siteName: name });
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const { locale, title, description, siteName } = input;
  const canonical = getPathname({ locale, href: input.pathname });
  // Capas do CMS têm proporções variadas, então vão sem width/height; só a imagem padrão tem 1200×630 garantido.
  const images = [input.image ?? { ...PORTFOLIO_OG_IMAGE, alt: siteName }];

  return {
    title,
    description,
    keywords: input.keywords,
    alternates: { canonical, languages: buildLanguageAlternates(input.pathname) },
    openGraph: {
      type: 'website',
      url: canonical,
      locale: OPEN_GRAPH_LOCALES[locale],
      title,
      description,
      siteName,
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
