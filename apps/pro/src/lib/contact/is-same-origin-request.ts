import 'server-only';

/**
 * `true` quando o POST veio de uma página do próprio site: o host do header `Origin` (que o navegador
 * preenche e o JavaScript da página não consegue alterar) é o mesmo host que recebeu o request. Compara com o
 * host do request, e não com um domínio fixo, para valer em produção, nos previews da Vercel e no localhost.
 *
 * Barra outro site de usar as rotas de contato a partir do navegador do visitante (CSRF, ou um site de
 * terceiros usando `/api/contact/email-check` como verificador grátis). NÃO barra scripts fora do navegador,
 * que forjam o header — para esses valem o rate limit e o Turnstile.
 * @example if (!isSameOriginRequest(request)) return Response.json({ error: 'forbidden_origin' }, { status: 403 });
 */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host.split(',')[0]?.trim();
  } catch {
    return false;
  }
}
