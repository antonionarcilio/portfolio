import 'server-only';

import { z } from 'zod';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const siteverifyResponseSchema = z.object({ success: z.boolean() });

export type VerifyTurnstileToken = (token: string, clientAddress: string | null) => Promise<boolean>;

/**
 * Cria o verificador do token do Turnstile (a prova que o servidor tem de que o desafio foi
 * resolvido). Falha de rede ou resposta inesperada contam como não verificado.
 * @example const verify = createTurnstileVerifier(secret); await verify(token, ip);
 */
export function createTurnstileVerifier(secretKey: string): VerifyTurnstileToken {
  return async (token, clientAddress) => {
    const body = new URLSearchParams({ secret: secretKey, response: token });
    if (clientAddress) body.set('remoteip', clientAddress);

    const response = await fetch(SITEVERIFY_URL, { method: 'POST', body });
    if (!response.ok) return false;
    const parsed = siteverifyResponseSchema.safeParse(await response.json());
    return parsed.success && parsed.data.success;
  };
}
