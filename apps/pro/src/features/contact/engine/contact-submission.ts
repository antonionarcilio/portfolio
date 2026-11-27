import { SUPPORTED_LOCALES, type SupportedLocale } from 'portfolio-content-model';
import { z } from 'zod';

import type { AnswerMap } from './answer-reader';
import { resolvePath } from './conversation-path';
import type { ResolvedStep, StepAnswer } from './flow-types';
import { stepAnswerSchema, stepKeySchema } from './step-answer-schema';
import { withoutHiddenFields } from './visible-fields';

/** O caminho mais longo tem ~10 etapas; o teto barra um payload com centenas de respostas. */
const MAXIMUM_SUBMITTED_ANSWERS = 30;

/**
 * Corpo do POST em `/api/contact`, compartilhado por cliente e servidor. Estrito e mínimo: só respostas
 * cruas, idioma, aceite e o token do Turnstile. Nome, e-mail e fluxo NÃO vêm prontos do cliente — o servidor
 * os deriva das respostas depois de validá-las contra os fluxos (`validate-contact-submission.ts`).
 */
export const contactSubmissionSchema = z.strictObject({
  locale: z.enum(SUPPORTED_LOCALES),
  privacyAccepted: z.literal(true),
  turnstileToken: z.string().min(1).max(4_096),
  answers: z.array(z.strictObject({ step: stepKeySchema, answer: stepAnswerSchema })).max(MAXIMUM_SUBMITTED_ANSWERS),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

/**
 * Códigos de erro do `/api/contact` que o chat trata à parte (422): o e-mail passou pela checagem do meio da
 * conversa (que libera em caso de falha) mas foi recusado no envio final.
 */
export const EMAIL_REJECTION_ERRORS = { disposable: 'email_disposable', undeliverable: 'email_undeliverable' } as const;

export type EmailRejectionError = (typeof EMAIL_REJECTION_ERRORS)[keyof typeof EMAIL_REJECTION_ERRORS];

/** Assinatura do envio injetado na página: resolve quando a mensagem foi aceita. */
export type SendContactSubmission = (submission: ContactSubmission) => Promise<void>;

/** Resposta como vai no payload: numa etapa de campos, sem os valores de campos escondidos (`visibleWhen`). */
function submittedAnswer(step: ResolvedStep, answers: AnswerMap): StepAnswer {
  const answer = answers[step.key] as StepAnswer;
  if (step.definition.kind !== 'fields') return answer;
  return withoutHiddenFields(step.definition.fields, answer, answers);
}

/**
 * Monta o payload a partir do estado; respostas de fluxos abandonados (o visitante trocou de motivo) ficam
 * de fora porque só o caminho atual entra, e campos que deixaram de aparecer (ex.: o link do projeto depois de
 * trocar para "Criar do zero") também. Só é chamado depois do aceite de privacidade na revisão.
 * @example buildContactSubmission(state.answers, 'pt-BR', turnstileToken)
 */
export function buildContactSubmission(
  answers: AnswerMap,
  locale: SupportedLocale,
  turnstileToken: string,
): ContactSubmission {
  const steps = resolvePath(answers).filter((step) => answers[step.key]);
  return {
    locale,
    privacyAccepted: true,
    turnstileToken,
    answers: steps.map((step) => ({ step: step.key, answer: submittedAnswer(step, answers) })),
  };
}
