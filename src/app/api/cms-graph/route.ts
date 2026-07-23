import { NextResponse, type NextRequest } from 'next/server';

import { getCmsGraph } from '@/shared/data/get-cms-graph';
import { DEFAULT_LOCALE, isSupportedLocale } from '@/shared/i18n/locales';

/**
 * BFF de depuração: lista os nós alcançados pela travessia BFS do CMS markdown
 * a partir do root (`content/index.md`), com chave normalizada + frontmatter cru.
 * Uso: `/api/cms-graph?locale=en`.
 */
export async function GET(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get('locale') ?? DEFAULT_LOCALE;
  if (!isSupportedLocale(requestedLocale)) {
    return NextResponse.json({ error: `Locale não suportado: ${requestedLocale}` }, { status: 400 });
  }

  const graph = await getCmsGraph(requestedLocale);
  const nodes = Array.from(graph.values());

  return NextResponse.json({ locale: requestedLocale, count: nodes.length, nodes });
}
