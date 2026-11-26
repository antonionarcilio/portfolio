import { z } from 'zod';

import { REVIEW_STEP_KEY } from './flow-types';
import { stepAnswerSchema, stepKeySchema } from './step-answer-schema';

/**
 * Estado completo da conversa. É serializável de propósito: vai inteiro para o sessionStorage e volta
 * validado por este schema (um JSON adulterado ou de uma versão antiga cai no estado inicial).
 */
export const conversationStateSchema = z.object({
  /** `hero` = tela de entrada; `chat` = conversa (inclui a revisão); `success` = mensagem enviada. */
  stage: z.enum(['hero', 'chat', 'success']),
  currentTarget: z.union([stepKeySchema, z.literal(REVIEW_STEP_KEY)]),
  answers: z.record(z.string(), stepAnswerSchema),
  /** Falas do bot já "digitadas": não repetem o "digitando…" ao voltar ou ao recarregar a página. */
  revealedPrompts: z.array(z.string()),
  /** Aceite da política de privacidade na revisão. */
  privacyAccepted: z.boolean(),
  /**
   * A etapa atual foi aberta pelo "Editar" da revisão: responder volta ao resumo. "Voltar" desliga, e a conversa
   * segue a ordem normal. `default` para conversas salvas antes deste campo existir.
   */
  returnsToReview: z.boolean().default(false),
});

export type ConversationState = z.infer<typeof conversationStateSchema>;

export const INITIAL_CONVERSATION_STATE: ConversationState = {
  stage: 'hero',
  currentTarget: 'intro.name',
  answers: {},
  revealedPrompts: [],
  privacyAccepted: false,
  returnsToReview: false,
};
