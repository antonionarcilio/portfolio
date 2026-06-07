import 'server-only';

import { env } from '@/env';
import type { PortfolioData } from '@/features/gamer/types/portfolio';

import { mapStrapiToPortfolio } from './map-portfolio';
import { portfolioData } from './portfolio-data';
import { fetchStrapiPortfolio } from './strapi-client';

/** Origem efetiva dos dados servidos — carimbada no HTML via `<meta x-data-source>`. */
export type PortfolioSource = 'strapi' | 'fallback';

export interface PortfolioResult {
  data: PortfolioData;
  source: PortfolioSource;
}

/**
 * Obtém os dados do portfólio.
 *
 * Quando o Strapi está configurado (`STRAPI_API_URL` + `STRAPI_API_TOKEN`),
 * busca e mapeia o single type `gamer-portfolio`. A resposta é cacheada pelo
 * Data Cache do Next (tag + revalidação on-demand via webhook), evitando
 * chamadas excessivas ao CMS.
 *
 * Em qualquer falha — Strapi offline, erro de rede, ou config ausente
 * (tipicamente durante o `next build`) — faz fallback para a fonte local de
 * verdade, mantendo o build estável.
 *
 * Retorna também `source` para auditoria: a página emite um `<meta>` indicando
 * se o conteúdo veio do `strapi` ou do `fallback` local.
 */
export async function getPortfolio(): Promise<PortfolioResult> {
  if (!env.STRAPI_API_URL || !env.STRAPI_API_TOKEN) {
    return { data: portfolioData, source: 'fallback' };
  }

  try {
    const raw = await fetchStrapiPortfolio();
    return { data: mapStrapiToPortfolio(raw), source: 'strapi' };
  } catch {
    // Fallback de build / API offline: usa a fonte local de verdade.
    return { data: portfolioData, source: 'fallback' };
  }
}
