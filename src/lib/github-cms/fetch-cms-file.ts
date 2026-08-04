import 'server-only';

import { env } from '@/env';

const CMS_FETCH_MAX_RETRIES = 2;
const CMS_FETCH_RETRY_DELAY_MS = 250;

/** Espera com backoff simples entre tentativas (250ms, 500ms). */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Busca um arquivo cru do repo markdown CMS via raw.githubusercontent.com.
 * Repo público, sem autenticação. Retorna `null` em 404 (wikilink não resolvido
 * ou arquivo ausente) — tratado como caso esperado pelo chamador, não como erro.
 *
 * Em produção o site é totalmente estático (sem ISR) — a busca só acontece
 * durante `next build`, sempre consultando o CMS diretamente. O HTML gerado
 * permanece com esses dados até o próximo rebuild (disparado pelo webhook do
 * GitHub, ver docs/cms-content-updates.md).
 *
 * Reintenta em falhas de rede transitórias (DNS/TLS/socket) — o BFS do
 * getCmsGraph dispara dezenas dessas buscas em paralelo por camada, então uma
 * única falha isolada não deve derrubar a página inteira.
 */
export async function fetchCmsFile(path: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${env.CMS_GITHUB_OWNER}/${env.CMS_GITHUB_REPO}/${env.CMS_GITHUB_BRANCH}/${path}`;
  const options = { cache: 'no-store' as const };

  for (let attempt = 0; attempt <= CMS_FETCH_MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, options);
      return res.ok ? res.text() : null;
    } catch (error) {
      if (attempt === CMS_FETCH_MAX_RETRIES) {
        throw new Error(`fetchCmsFile: falha de rede persistente ao buscar ${url}`, { cause: error });
      }
      await delay(CMS_FETCH_RETRY_DELAY_MS * (attempt + 1));
    }
  }
  throw new Error(`fetchCmsFile: estado inalcançável para ${url}`);
}
