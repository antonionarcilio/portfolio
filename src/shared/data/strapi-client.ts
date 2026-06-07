import 'server-only';

import { env } from '@/env';
import type { StrapiGamerPortfolio, StrapiSingleResponse } from '@/shared/types/strapi-portfolio';

/** Tag de cache para revalidação on-demand via webhook do Strapi. */
export const PORTFOLIO_CACHE_TAG = 'gamer-portfolio';

/**
 * Populate explícito: `populate=*` resolve só 1 nível, então a nested
 * `skillCategories.items` (componente dentro de componente) precisa ser
 * declarada manualmente. Demais componentes são rasos.
 */
const POPULATE_QUERY = [
  'populate[skills]=true',
  'populate[skillCategories][populate][items]=true',
  'populate[projects]=true',
  'populate[services]=true',
  'populate[experience]=true',
  'populate[achievements]=true',
  'populate[games]=true',
  'populate[education]=true',
].join('&');

/**
 * Busca o single type `gamer-portfolio` no Strapi v5 via REST.
 *
 * Cacheado pelo Data Cache do Next com tag (`revalidateTag` no webhook) e um
 * `revalidate` de segurança — é o que mantém as chamadas ao Strapi mínimas.
 * Lança em falha/config ausente; o caller (`getPortfolio`) faz o fallback local.
 */
export async function fetchStrapiPortfolio(): Promise<StrapiGamerPortfolio> {
  if (!env.STRAPI_API_URL || !env.STRAPI_API_TOKEN) {
    throw new Error('Strapi não configurado: STRAPI_API_URL/STRAPI_API_TOKEN ausentes.');
  }

  const res = await fetch(`${env.STRAPI_API_URL}/api/gamer-portfolio?${POPULATE_QUERY}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_API_TOKEN}` },
    next: { tags: [PORTFOLIO_CACHE_TAG], revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`GET /api/gamer-portfolio failed: ${res.status}`);

  const json = (await res.json()) as StrapiSingleResponse<StrapiGamerPortfolio>;
  return json.data;
}
