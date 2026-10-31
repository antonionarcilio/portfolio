import 'server-only';

import type { CmsClientConfig } from './create-cms-client';

const CMS_FETCH_MAX_RETRIES = 4;
const CMS_FETCH_RETRY_BASE_DELAY_MS = 300;
const CMS_BUILD_CACHE_BUSTER = process.env.VERCEL_DEPLOYMENT_ID ?? Date.now().toString();

/** Espera com backoff exponencial entre tentativas (300ms, 600ms, 1200ms, 2400ms). */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resposta HTTP inesperada do GitHub — carrega a URL e o status para o log do build apontar o arquivo. */
class CmsFetchStatusError extends Error {
  constructor(url: string, status: number) {
    super(`fetchCmsFile: status HTTP ${status} ao buscar ${url} (esperado 2xx, ou 404 para arquivo ausente)`);
    this.name = 'CmsFetchStatusError';
  }
}

/** 429 (rate limit) e 5xx são transitórios: vale repetir. Os demais status não mudam numa nova tentativa. */
function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

/**
 * Busca um arquivo cru do repo markdown CMS via raw.githubusercontent.com.
 * Repo público, sem autenticação. Retorna `null` somente em 404 (wikilink não resolvido
 * ou arquivo ausente) — tratado como caso esperado pelo chamador, não como erro.
 * Qualquer outra resposta que não seja 2xx lança: tratar um 429/5xx como "arquivo
 * inexistente" faria o conteúdo (projeto, time...) sumir do build sem aviso.
 *
 * Em produção o site é totalmente estático (sem ISR) — a busca só acontece
 * durante `next build`. A URL recebe um identificador único do deployment para
 * impedir que o Data Cache reutilize a resposta de um build anterior. O HTML
 * gerado permanece com esses dados até o próximo rebuild (disparado pelo
 * webhook do GitHub, ver docs/cms-content-updates.md).
 *
 * Reintenta em falhas de rede transitórias (DNS/TLS/socket) e em 429/5xx — o BFS do
 * getCmsGraph dispara dezenas dessas buscas em paralelo por camada, então uma
 * única falha isolada não deve derrubar a página inteira.
 */
export async function fetchCmsFile(path: string, config: CmsClientConfig): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${path}?build=${CMS_BUILD_CACHE_BUSTER}`;
  const options = { cache: 'force-cache' as const };

  for (let attempt = 0; attempt <= CMS_FETCH_MAX_RETRIES; attempt++) {
    const isLastAttempt = attempt === CMS_FETCH_MAX_RETRIES;
    try {
      const res = await fetch(url, options);
      if (res.ok) return res.text();
      if (res.status === 404) return null;
      if (!isRetryableStatus(res.status) || isLastAttempt) {
        throw new CmsFetchStatusError(url, res.status);
      }
    } catch (error) {
      if (error instanceof CmsFetchStatusError) throw error;
      if (isLastAttempt) {
        throw new Error(`fetchCmsFile: falha de rede persistente ao buscar ${url}`, { cause: error });
      }
    }
    await delay(CMS_FETCH_RETRY_BASE_DELAY_MS * 2 ** attempt);
  }
  throw new Error(`fetchCmsFile: estado inalcançável para ${url}`);
}
