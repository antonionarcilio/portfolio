import { createHmac, timingSafeEqual } from 'node:crypto';

import { env } from '@/env';
import { PORTFOLIO_CACHE_TAG } from '@/shared/data/cache-tags';
import { SUPPORTED_LOCALES } from '@/shared/i18n/locales';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Base paths (sem locale) de cada portfolio que consome o CMS markdown.
 * Ao criar um novo portfolio, adicione seu base path aqui.
 */
const PORTFOLIO_BASE_PATHS = ['/portfolios/gamer'] as const;

const LOCALE_PATHS = PORTFOLIO_BASE_PATHS.flatMap((base) => SUPPORTED_LOCALES.map((locale) => `${base}/${locale}`));

/** Assinatura HMAC-SHA256 do payload, no formato `sha256=<hex>` usado pelo header `X-Hub-Signature-256` do GitHub. */
function isValidGitHubSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`;
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

/**
 * Webhook de revalidação on-demand do GitHub (evento `push` no repo `portfolio-cms`).
 *
 * Invalida a tag de cache para que a próxima requisição re-busque o CMS via
 * `raw.githubusercontent.com`. Sem o webhook, `CMS_REVALIDATE_SECONDS` garante
 * o refresh de qualquer forma — ver docs/migration-strapi-to-markdown-cms.md.
 *
 * Autenticação: header `X-Hub-Signature-256` (HMAC-SHA256 do corpo cru, comparação
 * em tempo constante) — o corpo é lido como texto antes de qualquer parse.
 */
export async function POST(request: NextRequest) {
  const secret = env.CMS_GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook não configurado.' }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  if (!isValidGitHubSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  revalidateTag(PORTFOLIO_CACHE_TAG);
  LOCALE_PATHS.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, tag: PORTFOLIO_CACHE_TAG, paths: LOCALE_PATHS });
}
