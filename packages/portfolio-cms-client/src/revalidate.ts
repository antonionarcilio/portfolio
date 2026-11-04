import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

export interface RevalidateConfig {
  secret: string | undefined;
  deployHookUrl: string | undefined;
  branch: string;
}

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
 * Webhook de rebuild do GitHub (evento `push` no repo `portfolio-cms`), reutilizável
 * pelos 3 apps via um wrapper fino em `/api/revalidate/route.ts` de cada um.
 *
 * O site é totalmente estático em produção (sem ISR) — dispara um novo
 * build+deploy via Deploy Hook da Vercel, que busca o CMS fresco naquele
 * build. Ver docs/cms-content-updates.md para o fluxo completo.
 *
 * Autenticação: header `X-Hub-Signature-256` (HMAC-SHA256 do corpo cru, comparação
 * em tempo constante) — o corpo é lido como texto antes de qualquer parse.
 *
 * Filtro de branch: o webhook do GitHub não filtra por branch, então a rota
 * ignora pushs em qualquer branch que não seja `config.branch`, evitando
 * rebuilds em `develop`/features.
 */
export async function handleRevalidateWebhook(request: Request, config: RevalidateConfig): Promise<Response> {
  if (!config.secret || !config.deployHookUrl) {
    return Response.json({ error: 'Webhook não configurado.' }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  if (!isValidGitHubSignature(rawBody, signature, config.secret)) {
    return Response.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const expectedRef = `refs/heads/${config.branch}`;
  const payload = JSON.parse(rawBody) as { ref?: unknown };
  if (payload.ref !== expectedRef) {
    return Response.json({ triggered: false, reason: `Branch ignorada. Esperado ${expectedRef}.` });
  }

  const deployRes = await fetch(config.deployHookUrl, { method: 'POST' });
  if (!deployRes.ok) {
    return Response.json({ error: 'Falha ao disparar o Deploy Hook da Vercel.' }, { status: 502 });
  }

  return Response.json({ triggered: true });
}
