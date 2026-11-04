import type { ContactFormValues } from './contact-form-schema';
import type { ContactSubmissionContext } from './contact-request-schema';

/** Tudo o que vai no POST: os campos do formulário mais idioma, token do Turnstile e honeypot. */
export type ContactSubmission = ContactFormValues & ContactSubmissionContext;

/** Assinatura do envio injetado em `useContactForm` — resolve quando a mensagem foi aceita. */
export type SendContactMessage = (submission: ContactSubmission) => Promise<void>;

const CONTACT_ENDPOINT = '/api/contact';

/**
 * Envia o formulário para `/api/contact`, que valida, confere o Turnstile e dispara os e-mails.
 * Rejeita com o status recebido quando a rota não responde 2xx.
 */
export const sendContactMessage: SendContactMessage = async (submission) => {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });
  if (!response.ok) {
    throw new Error(`POST ${CONTACT_ENDPOINT} failed with status ${response.status}; expected a 2xx response`);
  }
};
