import 'server-only';

import type { PortfolioData, SupportedLocale } from 'portfolio-content-model';

import { buildCmsGraph, type CmsGraph } from './get-cms-graph';
import { mapPortfolioToData } from './map-portfolio';

export interface CmsClientConfig {
  owner: string;
  repo: string;
  branch: string;
}

export interface CmsClient {
  getPortfolio(locale: SupportedLocale): Promise<PortfolioData | null>;
  getCmsGraph(locale: SupportedLocale): Promise<CmsGraph>;
}

/**
 * Fábrica do cliente de CMS — toda a configuração (`owner`/`repo`/`branch`) é
 * injetada aqui, nunca lida de `process.env` dentro deste pacote (cada app
 * monta seu próprio `CmsClientConfig` a partir do seu `env.ts`).
 *
 * O grafo é cacheado por locale para a vida do processo (não por request):
 * em dev, sem isso, cada navegação refazia o BFS inteiro — dezenas de fetches
 * em paralelo pro mesmo host, o que estourava o limite de conexões
 * simultâneas do undici (UND_ERR_CONNECT_TIMEOUT). Para pegar conteúdo
 * atualizado em dev, reinicie o servidor.
 */
export function createCmsClient(config: CmsClientConfig): CmsClient {
  const graphCache = new Map<SupportedLocale, Promise<CmsGraph>>();

  function getCachedCmsGraph(locale: SupportedLocale): Promise<CmsGraph> {
    const cached = graphCache.get(locale);
    if (cached) return cached;
    const promise = buildCmsGraph(locale, config);
    graphCache.set(locale, promise);
    return promise;
  }

  return {
    getCmsGraph: getCachedCmsGraph,
    async getPortfolio(locale) {
      const graph = await getCachedCmsGraph(locale);
      const root = graph.get('');
      if (!root) return null;
      return mapPortfolioToData(root, graph, config);
    },
  };
}
