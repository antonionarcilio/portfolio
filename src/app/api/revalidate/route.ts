import { env } from '@/env';
import { PORTFOLIO_CACHE_TAG } from '@/shared/data/strapi-client';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

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
  return NextResponse.json({ revalidated: true, tag: PORTFOLIO_CACHE_TAG });
}
