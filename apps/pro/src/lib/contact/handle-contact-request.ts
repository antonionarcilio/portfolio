import 'server-only';

import { contactRequestSchema, type ContactRequest } from '@/features/contact/contact-request-schema';

import {
  buildAutoresponderEmail,
  buildDeliveryAlertEmail,
  buildNotificationEmail,
  type ProfileLinks,
} from './build-contact-emails';
import type { ContactRateLimiter } from './contact-rate-limiter';
import type { EmailSender } from './email-sender';
import type { VerifyTurnstileToken } from './verify-turnstile';

export type ContactDependencies = {
  verifyTurnstileToken: VerifyTurnstileToken;
  /** `null` quando o Upstash não está configurado (dev): sem limite por IP. */
  isWithinRateLimit: ContactRateLimiter | null;
  sendEmail: EmailSender;
  notificationEmail: string;
  /** Links da assinatura do autoresponder (vêm do CMS); se falhar, só o autoresponder é afetado. */
  loadProfileLinks: () => Promise<ProfileLinks>;
};

type ContactErrorCode = 'invalid_request' | 'rate_limited' | 'verification_failed' | 'delivery_failed';

const ERROR_STATUS: Record<ContactErrorCode, number> = {
  invalid_request: 400,
  rate_limited: 429,
  verification_failed: 403,
  delivery_failed: 502,
};

function errorResponse(code: ContactErrorCode): Response {
  return Response.json({ error: code }, { status: ERROR_STATUS[code] });
}

/** Log JSON estruturado — nunca inclui nome, e-mail ou texto do lead (LGPD). */
function logContactEvent(event: string, details: Record<string, string> = {}): void {
  console.error(JSON.stringify({ scope: 'contact', event, ...details }));
}

function readClientAddress(request: Request): string | null {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
}

async function parseRequest(request: Request): Promise<ContactRequest | null> {
  const body: unknown = await request.json().catch(() => null);
  const parsed = contactRequestSchema.safeParse(body);
  return parsed.success ? parsed.data : null;
}

/** A notificação é obrigatória; o autoresponder é melhor esforço e, se falhar, quem atende é avisado. */
async function deliverEmails(contact: ContactRequest, dependencies: ContactDependencies): Promise<void> {
  const { sendEmail, notificationEmail } = dependencies;
  await sendEmail(await buildNotificationEmail(contact, notificationEmail));

  try {
    const profileLinks = await dependencies.loadProfileLinks();
    await sendEmail(await buildAutoresponderEmail(contact, notificationEmail, profileLinks));
  } catch (error) {
    logContactEvent('autoresponder_failed', { reason: error instanceof Error ? error.message : 'unknown' });
    await sendEmail(await buildDeliveryAlertEmail(contact.email, notificationEmail)).catch(() =>
      logContactEvent('delivery_alert_failed'),
    );
  }
}

/**
 * Trata o POST do formulário de contato: valida, barra bots (honeypot, rate limit, Turnstile) e envia
 * a notificação e o autoresponder.
 * @example export const POST = (request: Request) => handleContactRequest(request, dependencies);
 */
export async function handleContactRequest(request: Request, dependencies: ContactDependencies): Promise<Response> {
  const contact = await parseRequest(request);
  if (!contact) return errorResponse('invalid_request');
  // Bot preencheu o honeypot: responde sucesso para ele não tentar de novo, sem enviar nada.
  if (contact.website) return Response.json({ ok: true });

  const clientAddress = readClientAddress(request);
  const isAllowed = (await dependencies.isWithinRateLimit?.(clientAddress ?? 'unknown')) ?? true;
  if (!isAllowed) return errorResponse('rate_limited');
  if (!(await dependencies.verifyTurnstileToken(contact.turnstileToken, clientAddress))) {
    return errorResponse('verification_failed');
  }

  try {
    await deliverEmails(contact, dependencies);
  } catch (error) {
    logContactEvent('notification_failed', { reason: error instanceof Error ? error.message : 'unknown' });
    return errorResponse('delivery_failed');
  }
  return Response.json({ ok: true });
}
