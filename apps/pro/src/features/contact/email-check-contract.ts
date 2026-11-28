import { z } from 'zod';

import { emailAddress } from './engine/field-validators';

/**
 * Contrato do BFF `POST /api/contact/email-check`, compartilhado pelo chat (cliente) e pela rota (servidor).
 * A rota revalida com o mesmo validador do campo; o veredito só existe no servidor porque a lista de
 * descartáveis (~10 mil domínios) e o DNS não vão para o bundle do navegador.
 */
export const EMAIL_CHECK_ENDPOINT = '/api/contact/email-check';

/** Estrito: chave a mais no corpo é rejeitada (400). */
export const emailCheckRequestSchema = z.strictObject({ email: emailAddress({ required: true }) });

export type EmailCheckRequest = z.input<typeof emailCheckRequestSchema>;

/** `undeliverable`: o domínio não tem servidor de e-mail (MX nem A) — erro de digitação ou domínio inventado. */
export const EMAIL_CHECK_VERDICTS = ['accepted', 'disposable', 'undeliverable'] as const;

export type EmailCheckVerdict = (typeof EMAIL_CHECK_VERDICTS)[number];

export const emailCheckResponseSchema = z.strictObject({ verdict: z.enum(EMAIL_CHECK_VERDICTS) });

export type EmailCheckResponse = z.infer<typeof emailCheckResponseSchema>;
