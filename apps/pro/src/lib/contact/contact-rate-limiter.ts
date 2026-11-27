import 'server-only';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** Devolve `true` quando o endereço ainda pode enviar. */
export type ContactRateLimiter = (clientAddress: string) => Promise<boolean>;

type UpstashCredentials = { url: string; token: string };

/** Uma política por rota: o `prefix` separa os contadores no Redis. */
export type RateLimitPolicy = {
  prefix: string;
  maximumRequests: number;
  window: Parameters<typeof Ratelimit.slidingWindow>[1];
};

/** Envio da mensagem: 3 a cada 10 minutos por IP. */
export const CONTACT_SUBMISSION_POLICY: RateLimitPolicy = {
  prefix: 'contact-form',
  maximumRequests: 3,
  window: '10 m',
};

/**
 * Checagem de e-mail no meio do chat: mais folgada que o envio (o visitante pode corrigir o e-mail algumas
 * vezes), mas limitada para a rota não virar um verificador gratuito de e-mails descartáveis.
 */
export const EMAIL_CHECK_POLICY: RateLimitPolicy = {
  prefix: 'contact-email-check',
  maximumRequests: 15,
  window: '10 m',
};

/**
 * Limite por IP (janela deslizante) guardado no Upstash Redis — serverless não compartilha memória
 * entre instâncias, então um contador local não serviria.
 * @example const isAllowed = createContactRateLimiter({ url, token }, CONTACT_SUBMISSION_POLICY); await isAllowed(ip);
 */
export function createContactRateLimiter(
  { url, token }: UpstashCredentials,
  { prefix, maximumRequests, window }: RateLimitPolicy,
): ContactRateLimiter {
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(maximumRequests, window),
    prefix,
  });
  return async (clientAddress) => (await limiter.limit(clientAddress)).success;
}
