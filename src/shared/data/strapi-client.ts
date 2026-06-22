import 'server-only';

import { env } from '@/env';
import { DEFAULT_LOCALE } from '@/shared/i18n/locales';
import type { StrapiPortfolio, StrapiSingleResponse } from '@/shared/types/strapi-portfolio';

/** Tag de cache para revalidação on-demand via webhook do Strapi. */
export const PORTFOLIO_CACHE_TAG = 'portfolio';

/**
 * `populate=*` resolve só 1 nível; relações aninhadas (technologies dentro de
 * skills/projects/experience) e media (badge) precisam ser declaradas
 * explicitamente.
 */
const POPULATE_QUERY = [
  'populate[contact]=true',
  'populate[skills][populate][technologies]=true',
  'populate[projects][populate][technologies]=true',
  'populate[services]=true',
  'populate[experience][populate][technologies]=true',
  'populate[achievements][populate]=badge',
  'populate[education]=true',
].join('&');

/**
 * Busca o single type `portfolio` no Strapi v5 via REST para o locale informado.
 *
 * Retorna `null` quando o locale requisitado não possui conteúdo publicado (404).
 * Cacheado pelo Data Cache do Next com tag (`revalidateTag` no webhook) e um
 * `revalidate` de segurança — é o que mantém as chamadas ao Strapi mínimas.
 * O mesmo tag é usado para todos os locales: o webhook invalida tudo de uma vez.
 */
export async function fetchStrapiPortfolio(locale = DEFAULT_LOCALE): Promise<StrapiPortfolio | null> {
  // Em desenvolvimento não cacheamos para que alterações no Strapi sejam imediatas.
  // Em produção o Data Cache é controlado pela tag + revalidate de segurança.
  const cacheConfig =
    process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' as const }
      : { next: { tags: [PORTFOLIO_CACHE_TAG], revalidate: 3600 } };

  const res = await fetch(`${env.STRAPI_API_URL}/api/portfolio?${POPULATE_QUERY}&locale=${locale}`, {
    headers: { Authorization: `Bearer ${env.STRAPI_API_TOKEN}` },
    ...cacheConfig,
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/portfolio failed: ${res.status} (locale=${locale})`);

  const json = (await res.json()) as StrapiSingleResponse<StrapiPortfolio>;
  return json.data;
}
