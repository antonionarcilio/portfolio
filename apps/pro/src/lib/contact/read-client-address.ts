import 'server-only';

/**
 * IP do visitante para o rate limit. Na Vercel, o primeiro item de `x-forwarded-for` é o cliente (a borda
 * sobrescreve o header). Sem ele, `null` — quem chama agrupa como "unknown".
 * @example readClientAddress(request) ?? 'unknown'
 */
export function readClientAddress(request: Request): string | null {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
}
