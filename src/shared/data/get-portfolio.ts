import 'server-only';

import { getCmsGraph } from '@/shared/data/get-cms-graph';
import { DEFAULT_LOCALE, type SupportedLocale } from '@/shared/i18n/locales';
import type { PortfolioData } from '@/shared/types/portfolio';

import { mapPortfolioToData } from './map-portfolio';

/**
 * Monta o grafo do CMS markdown (GitHub) via BFS a partir do root e converte
 * o nó raiz em `PortfolioData` para o locale informado.
 */
export async function getPortfolio(locale: SupportedLocale = DEFAULT_LOCALE): Promise<PortfolioData | null> {
  const graph = await getCmsGraph(locale);
  const root = graph.get('');
  if (!root) return null;

  return mapPortfolioToData(root, graph);
}
