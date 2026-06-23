import 'server-only';

import { PortfolioDocument } from '@/gql/graphql';
import { query } from '@/lib/apollo-client';
import { DEFAULT_LOCALE } from '@/shared/i18n/locales';
import type { PortfolioData } from '@/shared/types/portfolio';

import { mapPortfolioToData } from './map-portfolio';

/**
 * Busca o single type `portfolio` no Strapi via GraphQL para o locale informado,
 * usando o documento tipado gerado pelo codegen (`PortfolioDocument`).
 *
 * Retorna `null` quando o locale requisitado não possui conteúdo publicado
 * (`portfolio` vem `null`). O cache é controlado pelo Apollo client server-side
 * (tag `PORTFOLIO_CACHE_TAG` + revalidate), invalidado pelo webhook do Strapi.
 */
export async function getPortfolio(locale = DEFAULT_LOCALE): Promise<PortfolioData | null> {
  const { data } = await query({
    query: PortfolioDocument,
    variables: { locale },
  });

  if (!data?.portfolio) return null;
  return mapPortfolioToData(data.portfolio);
}
