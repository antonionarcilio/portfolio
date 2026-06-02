import 'server-only';

import { env } from '@/env';
import type { PortfolioData } from '@/features/gamer/types/portfolio';

import { portfolioData } from './portfolio-data';

/**
 * Obtém os dados do portfólio via BFF (`/api/portfolio`).
 *
 * Usa `force-cache` por se tratar de conteúdo estático (revalida em novo deploy).
 * Caso o fetch falhe — tipicamente durante o `next build`, com o servidor offline —
 * faz fallback para a fonte local de verdade, mantendo o build estável.
 */
export async function getPortfolio(): Promise<PortfolioData> {
  try {
    const res = await fetch(`${env.MY_DOMAIN}/api/portfolio`, {
      cache: 'force-cache',
    });
    if (!res.ok) throw new Error(`GET /api/portfolio failed: ${res.status}`);
    return (await res.json()) as PortfolioData;
  } catch {
    // Fallback de build / API offline: usa a fonte local de verdade.
    return portfolioData;
  }
}
