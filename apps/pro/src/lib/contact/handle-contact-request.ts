import 'server-only';

import {
  contactSubmissionSchema,
  EMAIL_REJECTION_ERRORS,
  type ContactSubmission,
  type EmailRejectionError,
} from '@/features/contact/engine/contact-submission';
import {
  validateContactSubmission,
  type ValidatedContact,
} from '@/features/contact/engine/validate-contact-submission';

import {
  buildAutoresponderEmail,
  buildDeliveryAlertEmail,
  buildNotificationEmail,
  type ProfileLinks,
} from './build-contact-emails';
import type { ContactRateLimiter } from './contact-rate-limiter';
import type { ContactEmailChecker } from './email-reputation/contact-email-checker';
import type { EmailSender } from './email-sender';
import { isSameOriginRequest } from './is-same-origin-request';
import { readClientAddress } from './read-client-address';
import { readLimitedBody } from './read-limited-body';
import type { VerifyTurnstileToken } from './verify-turnstile';

export type ContactDependencies = {
  verifyTurnstileToken: VerifyTurnstileToken;
  /** `null` quando o Upstash não está configurado (dev): sem limite por IP. */
  isWithinRateLimit: ContactRateLimiter | null;
  /** Recusa e-mail descartável ou de domínio sem servidor de e-mail — a checagem do chat é só UX. */
  checkEmail: ContactEmailChecker;
  sendEmail: EmailSender;
  notificationEmail: string;
  /** Links da assinatura do autoresponder (vêm do CMS); se falhar, só o autoresponder é afetado. */
  loadProfileLinks: () => Promise<ProfileLinks>;
};

type ContactErrorCode =
  | 'forbidden_origin'
  | 'payload_too_large'
  | 'invalid_request'
  | EmailRejectionError
  | 'rate_limited'
  | 'verification_failed'
  | 'delivery_failed';

const ERROR_STATUS: Record<ContactErrorCode, number> = {
  forbidden_origin: 403,
  payload_too_large: 413,
  invalid_request: 400,
  email_disposable: 422,
  email_undeliverable: 422,
  rate_limited: 429,
  verification_failed: 403,
  delivery_failed: 502,
};

/** A conversa mais longa (textos de 2000 caracteres + URLs) fica bem abaixo disso. */
const MAXIMUM_BODY_LENGTH = 32_768;

function errorResponse(code: ContactErrorCode): Response {
  return Response.json({ error: code }, { status: ERROR_STATUS[code] });
}

/** Log JSON estruturado — nunca inclui nome, e-mail ou texto do lead (LGPD). */
function logContactEvent(event: string, details: Record<string, string> = {}): void {
  console.error(JSON.stringify({ scope: 'contact', event, ...details }));
}

async function parseSubmission(request: Request): Promise<ContactSubmission | 'too_large' | null> {
  const body = await readLimitedBody(request, MAXIMUM_BODY_LENGTH);
  if (body === 'too_large') return 'too_large';
  try {
    const parsed = contactSubmissionSchema.safeParse(JSON.parse(body.text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

type ReadContact = { contact: ValidatedContact; turnstileToken: string };

/** Formato do corpo e, depois, as respostas contra os fluxos; devolve o contato ou o código do erro. */
async function readContact(request: Request): Promise<ReadContact | ContactErrorCode> {
  const submission = await parseSubmission(request);
  if (submission === 'too_large') return 'payload_too_large';
  if (!submission) return 'invalid_request';
  const validation = validateContactSubmission(submission);
  if (validation.ok) return { contact: validation.value, turnstileToken: submission.turnstileToken };
  logContactEvent('invalid_submission', { reason: validation.reason });
  return 'invalid_request';
}

/** A notificação é obrigatória; o autoresponder é melhor esforço e, se falhar, quem atende é avisado. */
async function deliverEmails(contact: ValidatedContact, dependencies: ContactDependencies): Promise<void> {
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

/** Barreiras anteriores ao envio, da mais barata à mais cara; devolve o primeiro bloqueio ou `null`. */
async function findBlockingReason(
  contact: ValidatedContact,
  turnstileToken: string,
  request: Request,
  dependencies: ContactDependencies,
): Promise<ContactErrorCode | null> {
  const clientAddress = readClientAddress(request);
  const isAllowed = (await dependencies.isWithinRateLimit?.(clientAddress ?? 'unknown')) ?? true;
  if (!isAllowed) return 'rate_limited';
  if (!(await dependencies.verifyTurnstileToken(turnstileToken, clientAddress))) return 'verification_failed';
  const emailVerdict = await dependencies.checkEmail(contact.email);
  if (emailVerdict === 'accepted') return null;
  logContactEvent('email_rejected', { verdict: emailVerdict });
  return EMAIL_REJECTION_ERRORS[emailVerdict];
}

/**
 * Trata o POST do chat de contato: confere a origem, valida o corpo e as respostas contra os fluxos, barra
 * bots (rate limit, Turnstile), recusa e-mail descartável ou sem servidor de e-mail e envia a notificação e o
 * autoresponder (Resend).
 * @example export const POST = (request: Request) => handleContactRequest(request, dependencies);
 */
export async function handleContactRequest(request: Request, dependencies: ContactDependencies): Promise<Response> {
  if (!isSameOriginRequest(request)) return errorResponse('forbidden_origin');
  const read = await readContact(request);
  if (typeof read === 'string') return errorResponse(read);

  const { contact, turnstileToken } = read;
  const blockingReason = await findBlockingReason(contact, turnstileToken, request, dependencies);
  if (blockingReason) return errorResponse(blockingReason);

  try {
    await deliverEmails(contact, dependencies);
  } catch (error) {
    logContactEvent('notification_failed', { reason: error instanceof Error ? error.message : 'unknown' });
    return errorResponse('delivery_failed');
  }
  return Response.json({ ok: true });
}
