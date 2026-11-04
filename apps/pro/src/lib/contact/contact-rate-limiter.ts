import 'server-only';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** Devolve `true` quando o endereço ainda pode enviar. */
export type ContactRateLimiter = (clientAddress: string) => Promise<boolean>;

const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW = '10 m';

type UpstashCredentials = { url: string; token: string };

/**
 * Limite por IP (janela deslizante) guardado no Upstash Redis — serverless não compartilha memória
 * entre instâncias, então um contador local não serviria.
 * @example const isAllowed = createContactRateLimiter({ url, token }); await isAllowed(ip);
 */
export function createContactRateLimiter({ url, token }: UpstashCredentials): ContactRateLimiter {
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_SUBMISSIONS_PER_WINDOW, WINDOW),
    prefix: 'contact-form',
  });
  return async (clientAddress) => (await limiter.limit(clientAddress)).success;
}
