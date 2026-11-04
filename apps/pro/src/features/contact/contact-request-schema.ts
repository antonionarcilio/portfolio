import { SUPPORTED_LOCALES } from 'portfolio-content-model';
import { z } from 'zod';

import { contactFormSchema } from './contact-form-schema';

/**
 * Corpo do POST em `/api/contact`: os campos do formulário mais o que só o envio precisa.
 * `website` é o honeypot (humanos nunca o preenchem) e `turnstileToken` é o token do desafio da
 * Cloudflare, conferido no servidor.
 */
export const contactRequestSchema = contactFormSchema.safeExtend({
  locale: z.enum(SUPPORTED_LOCALES),
  turnstileToken: z.string().min(1),
  website: z.string(),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

/** Campos extras do envio, além dos valores do formulário. */
export type ContactSubmissionContext = Pick<ContactRequest, 'locale' | 'turnstileToken' | 'website'>;
