import { createHmac, timingSafeEqual } from 'node:crypto';

import { env } from '@/env';
import { NextResponse, type NextRequest } from 'next/server';

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
 * Webhook de rebuild do GitHub (evento `push` no repo `portfolio-cms`).
 *
 * O site é totalmente estático em produção (sem ISR) — dispara um novo
 * build+deploy via Deploy Hook da Vercel, que busca o CMS fresco naquele
 * build. Ver docs/cms-content-updates.md para o fluxo completo e o fallback
 * manual caso essa cadeia falhe silenciosamente.
 *
 * Autenticação: header `X-Hub-Signature-256` (HMAC-SHA256 do corpo cru, comparação
 * em tempo constante) — o corpo é lido como texto antes de qualquer parse.
 */
export async function POST(request: NextRequest) {
  const secret = env.CMS_GITHUB_WEBHOOK_SECRET;
  const deployHookUrl = env.VERCEL_DEPLOY_HOOK_URL;
  if (!secret || !deployHookUrl) {
    return NextResponse.json({ error: 'Webhook não configurado.' }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  if (!isValidGitHubSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const deployRes = await fetch(deployHookUrl, { method: 'POST' });
  if (!deployRes.ok) {
    return NextResponse.json({ error: 'Falha ao disparar o Deploy Hook da Vercel.' }, { status: 502 });
  }

  return NextResponse.json({ triggered: true });
}
