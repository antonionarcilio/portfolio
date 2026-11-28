import 'server-only';

import {
  emailCheckRequestSchema,
  type EmailCheckResponse,
  type EmailCheckVerdict,
} from '@/features/contact/email-check-contract';

import type { ContactRateLimiter } from './contact-rate-limiter';
import type { ContactEmailChecker } from './email-reputation/contact-email-checker';
import { isSameOriginRequest } from './is-same-origin-request';
import { readClientAddress } from './read-client-address';
import { readLimitedBody } from './read-limited-body';

export type EmailCheckDependencies = {
  checkEmail: ContactEmailChecker;
  /** `null` quando o Upstash não está configurado (dev): sem limite por IP. */
  isWithinRateLimit: ContactRateLimiter | null;
};

/** O corpo legítimo é `{"email":"…"}` (≤ ~270 bytes); qualquer coisa muito maior é abuso. */
const MAXIMUM_BODY_LENGTH = 1_024;

/** Resultado por endereço não deve ficar em cache de CDN nem do navegador. */
const NO_STORE = { 'Cache-Control': 'no-store' } as const;

type EmailCheckErrorCode = 'forbidden_origin' | 'invalid_request' | 'payload_too_large' | 'rate_limited';

function errorResponse(error: EmailCheckErrorCode, status: number): Response {
  return Response.json({ error }, { status, headers: NO_STORE });
}

async function readEmail(request: Request): Promise<string | 'too_large' | null> {
  const body = await readLimitedBody(request, MAXIMUM_BODY_LENGTH);
  if (body === 'too_large') return 'too_large';
  const parsed = emailCheckRequestSchema.safeParse(JSON.parse(body.text || 'null'));
  return parsed.success ? parsed.data.email : null;
}

/** Log JSON estruturado só com o veredito — nunca o e-mail (LGPD). */
function logRejectedEmail(verdict: EmailCheckVerdict): void {
  if (verdict !== 'accepted') console.info(JSON.stringify({ scope: 'contact', event: 'email_rejected', verdict }));
}

/**
 * Trata o POST do BFF de checagem de e-mail: confere a origem, valida o corpo com o schema estrito, aplica o rate limit por IP e
 * devolve o veredito (descartável / sem servidor de e-mail / aceito).
 * @example export const POST = (request: Request) => handleEmailCheckRequest(request, dependencies);
 */
export async function handleEmailCheckRequest(
  request: Request,
  dependencies: EmailCheckDependencies,
): Promise<Response> {
  if (!isSameOriginRequest(request)) return errorResponse('forbidden_origin', 403);
  const email = await readEmail(request).catch(() => null);
  if (email === 'too_large') return errorResponse('payload_too_large', 413);
  if (!email) return errorResponse('invalid_request', 400);

  const isAllowed = (await dependencies.isWithinRateLimit?.(readClientAddress(request) ?? 'unknown')) ?? true;
  if (!isAllowed) return errorResponse('rate_limited', 429);

  const verdict = await dependencies.checkEmail(email);
  logRejectedEmail(verdict);
  return Response.json({ verdict } satisfies EmailCheckResponse, { headers: NO_STORE });
}
