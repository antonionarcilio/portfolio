import { env } from '@/env';
import { PORTFOLIO_CACHE_TAG } from '@/shared/data/strapi-client';
import { SUPPORTED_LOCALES } from '@/shared/i18n/locales';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Base paths (sem locale) de cada portfolio que consome a API Strapi.
 * Ao criar um novo portfolio, adicione seu base path aqui.
 */
const PORTFOLIO_BASE_PATHS = ['/portfolios/gamer'] as const;

const LOCALE_PATHS = PORTFOLIO_BASE_PATHS.flatMap((base) => SUPPORTED_LOCALES.map((locale) => `${base}/${locale}`));

/**
 * Webhook de revalidação on-demand do Strapi.
 *
 * O Strapi dispara um POST neste endpoint ao publicar/atualizar o portfólio,
 * invalidando a tag de cache para que a próxima requisição re-busque o CMS.
 * É o mecanismo que mantém as chamadas ao Strapi mínimas: sem publish, sem fetch.
 *
 * Autenticação: header `Authorization: Bearer <STRAPI_WEBHOOK_SECRET>`.
 */
export async function POST(request: NextRequest) {
  if (!env.STRAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook não configurado.' }, { status: 503 });
  }

  const authorization = request.headers.get('authorization');
  if (authorization !== `Bearer ${env.STRAPI_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  revalidateTag(PORTFOLIO_CACHE_TAG);
  LOCALE_PATHS.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, tag: PORTFOLIO_CACHE_TAG, paths: LOCALE_PATHS });
}
