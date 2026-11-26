import { nextStepInPath, previousStepKey, targetAfterReviewEdit } from './conversation-path';
import { INITIAL_CONVERSATION_STATE, type ConversationState } from './conversation-state';
import { REVIEW_STEP_KEY, type StepAnswer, type StepKey, type StepTarget } from './flow-types';

export type ConversationAction =
  | { type: 'start' }
  | { type: 'answer'; stepKey: StepKey; answer: StepAnswer }
  | { type: 'goBack' }
  | { type: 'edit'; stepKey: StepKey }
  | { type: 'revealPrompt'; promptId: string }
  | { type: 'setPrivacyAccepted'; accepted: boolean }
  | { type: 'complete' }
  | { type: 'restart' }
  | { type: 'restore'; state: ConversationState };

/**
 * Vindo do "Editar" da revisão, volta ao resumo (ou à pergunta nova que a resposta abriu); no fluxo normal,
 * inclusive depois de "Voltar", segue a ordem do caminho com as respostas guardadas já preenchidas.
 */
function answerStep(state: ConversationState, stepKey: StepKey, answer: StepAnswer): ConversationState {
  const answers = { ...state.answers, [stepKey]: answer };
  const currentTarget = state.returnsToReview
    ? targetAfterReviewEdit(stepKey, answers)
    : nextStepInPath(stepKey, answers);
  return {
    ...state,
    answers,
    currentTarget,
    returnsToReview: state.returnsToReview && currentTarget !== REVIEW_STEP_KEY,
  };
}

/** "Editar" a partir da revisão marca a volta direta ao resumo; do histórico, segue o fluxo normal. */
function editStep(state: ConversationState, stepKey: StepKey): ConversationState {
  const returnsToReview = state.returnsToReview || state.currentTarget === REVIEW_STEP_KEY;
  return { ...state, currentTarget: stepKey, returnsToReview };
}

function moveTo(state: ConversationState, target: StepTarget | undefined): ConversationState {
  return target ? { ...state, currentTarget: target } : state;
}

function revealPrompt(state: ConversationState, promptId: string): ConversationState {
  if (state.revealedPrompts.includes(promptId)) return state;
  return { ...state, revealedPrompts: [...state.revealedPrompts, promptId] };
}

/**
 * Transições da conversa. Puro: o histórico mostrado é derivado do caminho + respostas, então voltar ou
 * editar só muda `currentTarget` — as respostas seguintes ficam guardadas e reaparecem preenchidas.
 * @example conversationReducer(state, { type: 'answer', stepKey: 'intro.name', answer })
 */
export function conversationReducer(state: ConversationState, action: ConversationAction): ConversationState {
  switch (action.type) {
    case 'start':
      return { ...state, stage: 'chat' };
    case 'answer':
      return answerStep(state, action.stepKey, action.answer);
    case 'goBack':
      return moveTo({ ...state, returnsToReview: false }, previousStepKey(state.currentTarget, state.answers));
    case 'edit':
      return editStep(state, action.stepKey);
    case 'revealPrompt':
      return revealPrompt(state, action.promptId);
    case 'setPrivacyAccepted':
      return { ...state, privacyAccepted: action.accepted };
    case 'complete':
      return { ...state, stage: 'success' };
    case 'restart':
      return INITIAL_CONVERSATION_STATE;
    case 'restore':
      return action.state;
  }
}
