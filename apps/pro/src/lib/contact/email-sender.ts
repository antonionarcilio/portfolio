import 'server-only';

import type { ReactElement } from 'react';
import { Resend } from 'resend';

export type EmailMessage = {
  to: string;
  subject: string;
  body: ReactElement;
  replyTo?: string;
};

/** Contrato de envio do projeto — o Resend fica atrás dele para poder ser trocado. */
export type EmailSender = (message: EmailMessage) => Promise<void>;

/**
 * Remetente baseado no Resend. Lança com o destinatário e o motivo quando o envio é recusado.
 * @example await createResendEmailSender(apiKey, from)({ to, subject, body: <Template /> });
 */
export function createResendEmailSender(apiKey: string, fromAddress: string): EmailSender {
  const resend = new Resend(apiKey);
  return async ({ to, subject, body, replyTo }) => {
    const { error } = await resend.emails.send({ from: fromAddress, to, subject, react: body, replyTo });
    if (error) throw new Error(`Resend rejected email to "${to}": ${error.name} — ${error.message}`);
  };
}
