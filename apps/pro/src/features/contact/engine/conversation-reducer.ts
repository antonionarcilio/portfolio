import { INTRO_NAME_STEP_KEY } from '../flows/intro-flow';
import { nextStepInPath, previousStepKey, targetAfterEdit } from './conversation-path';
import { INITIAL_CONVERSATION_STATE, type ConversationState } from './conversation-state';
import type { StepAnswer, StepKey, StepTarget } from './flow-types';

export type ConversationAction =
  | { type: 'start' }
  | { type: 'answer'; stepKey: StepKey; answer: StepAnswer }
  | { type: 'goBack' }
  | { type: 'edit'; stepKey: StepKey }
  | { type: 'revealPrompt'; promptId: string }
  | { type: 'setPrivacyAccepted'; accepted: boolean }
  | { type: 'complete' }
  | { type: 'restart' }
  | { type: 'restore'; state: ConversationState }
  | { type: 'openNameChange' }
  | { type: 'cancelNameChange' }
  | { type: 'changeName'; answer: StepAnswer };

/**
 * Vindo de um "Editar" (histórico ou revisão), volta para onde o visitante estava (ou à pergunta nova que a
 * resposta abriu no meio do caminho); no fluxo normal, inclusive depois de "Voltar", segue a ordem do caminho com
 * as respostas guardadas já preenchidas. `resumeTarget` some quando o visitante chega ao destino.
 */
function answerStep(state: ConversationState, stepKey: StepKey, answer: StepAnswer): ConversationState {
  const answers = { ...state.answers, [stepKey]: answer };
  const resumed = state.resumeTarget ? targetAfterEdit(stepKey, answers, state.resumeTarget) : undefined;
  const currentTarget = resumed ?? nextStepInPath(stepKey, answers);
  const resumeTarget = resumed && resumed !== state.resumeTarget ? state.resumeTarget : undefined;
  return { ...state, answers, currentTarget, resumeTarget, nameChange: 'idle' };
}

/**
 * "Alterar meu nome" (G08): grava o nome novo em `intro.name` (a mesma resposta que o servidor valida) sem sair
 * da etapa atual nem mexer em `resumeTarget`; a confirmação fica à vista até a próxima resposta.
 */
function changeName(state: ConversationState, answer: StepAnswer): ConversationState {
  return { ...state, answers: { ...state.answers, [INTRO_NAME_STEP_KEY]: answer }, nameChange: 'confirmed' };
}

/**
 * "Editar" (bloco da revisão ou "Editar resposta" do histórico) guarda onde o visitante estava, para voltar
 * depois de responder. Editando de novo antes de responder, vale o destino guardado primeiro (o mais adiante).
 */
function editStep(state: ConversationState, stepKey: StepKey): ConversationState {
  const resumeTarget = state.resumeTarget ?? state.currentTarget;
  return { ...state, currentTarget: stepKey, resumeTarget, nameChange: 'idle' };
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
      return moveTo(
        { ...state, resumeTarget: undefined, nameChange: 'idle' },
        previousStepKey(state.currentTarget, state.answers),
      );
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
    case 'openNameChange':
      return { ...state, nameChange: 'editing' };
    case 'cancelNameChange':
      return { ...state, nameChange: 'idle' };
    case 'changeName':
      return changeName(state, action.answer);
  }
}
