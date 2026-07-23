import 'server-only';

import { env } from '@/env';
import { PORTFOLIO_CACHE_TAG } from '@/shared/data/cache-tags';

/**
 * Busca um arquivo cru do repo markdown CMS via raw.githubusercontent.com.
 * Repo público, sem autenticação. Retorna `null` em 404 (wikilink não resolvido
 * ou arquivo ausente) — tratado como caso esperado pelo chamador, não como erro.
 */
export async function fetchCmsFile(path: string): Promise<string | null> {
  const url = `https://raw.githubusercontent.com/${env.CMS_GITHUB_OWNER}/${env.CMS_GITHUB_REPO}/${env.CMS_GITHUB_BRANCH}/${path}`;
  const res = await fetch(url, {
    ...(process.env.NODE_ENV === 'development'
      ? { cache: 'no-store' as const }
      : { next: { tags: [PORTFOLIO_CACHE_TAG], revalidate: env.CMS_REVALIDATE_SECONDS } }),
  });
  return res.ok ? res.text() : null;
}
