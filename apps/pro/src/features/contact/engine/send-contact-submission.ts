import { z } from 'zod';

import type { SendContactSubmission } from './contact-submission';

const CONTACT_ENDPOINT = '/api/contact';

const errorBodySchema = z.object({ error: z.string().max(64) });

/** Falha do envio com o código do servidor (`error` do corpo), quando ele mandou um. */
export class ContactSendError extends Error {
  readonly code: string | undefined;

  constructor(status: number, code: string | undefined) {
    super(`POST ${CONTACT_ENDPOINT} failed with status ${status} (${code ?? 'no code'}); expected a 2xx response`);
    this.name = 'ContactSendError';
    this.code = code;
  }
}

async function readErrorCode(response: Response): Promise<string | undefined> {
  const parsed = errorBodySchema.safeParse(await response.json().catch(() => null));
  return parsed.success ? parsed.data.error : undefined;
}

/**
 * Envia a conversa para `/api/contact`, que revalida as respostas, confere o Turnstile e o e-mail e dispara
 * os e-mails (Resend). Rejeita com `ContactSendError` quando a rota não responde 2xx.
 * @example await sendContactSubmission(buildContactSubmission(answers, locale, token));
 */
export const sendContactSubmission: SendContactSubmission = async (submission) => {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });
  if (!response.ok) throw new ContactSendError(response.status, await readErrorCode(response));
};
