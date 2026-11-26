'use client';

import type { SupportedLocale } from 'portfolio-content-model';
import { useCallback, useEffect, useMemo, useReducer, useState, type Dispatch } from 'react';

import { RESTORE_LOADING_MILLISECONDS } from '../animations';
import { buildContactSubmission, EMAIL_REJECTION_ERRORS, type SendContactSubmission } from './contact-submission';
import { conversationReducer, type ConversationAction } from './conversation-reducer';
import { INITIAL_CONVERSATION_STATE, type ConversationState } from './conversation-state';
import { clearSavedConversation, readSavedConversation, saveConversation } from './conversation-storage';
import { REVIEW_STEP_KEY, type StepAnswer, type StepKey } from './flow-types';
import { ContactSendError } from './send-contact-submission';

/**
 * `failed`: falha genérica (rede, Turnstile, Resend) — tentar de novo resolve. `emailDisposable` /
 * `emailUndeliverable`: o envio final recusou o e-mail — tentar de novo não resolve, é preciso editá-lo.
 */
export type SubmitStatus = 'idle' | 'submitting' | 'failed' | 'emailDisposable' | 'emailUndeliverable';

/** Status depois de um envio que falhou, pelo código que o servidor devolveu. */
function statusAfterFailure(error: unknown): SubmitStatus {
  const code = error instanceof ContactSendError ? error.code : undefined;
  if (code === EMAIL_REJECTION_ERRORS.disposable) return 'emailDisposable';
  return code === EMAIL_REJECTION_ERRORS.undeliverable ? 'emailUndeliverable' : 'failed';
}

/**
 * `pending`: ainda não leu o sessionStorage (SSR/primeiro render). `restoring`: achou uma conversa salva e
 * mostra o loading por `RESTORE_LOADING_MILLISECONDS`. `ready`: Hero ou chat já podem aparecer.
 */
export type HydrationPhase = 'pending' | 'restoring' | 'ready';

/** Id da fala do bot de cada etapa (e da revisão), usado para lembrar o que já foi "digitado". */
export const promptIdFor = (target: string): string => `bot:${target}`;

export type ConversationControls = {
  state: ConversationState;
  hydration: HydrationPhase;
  submitStatus: SubmitStatus;
  start: () => void;
  answer: (stepKey: StepKey, answer: StepAnswer) => void;
  goBack: () => void;
  edit: (stepKey: StepKey) => void;
  revealPrompt: (promptId: string) => void;
  setPrivacyAccepted: (accepted: boolean) => void;
  restart: () => void;
  /** Envia a conversa com o token do Turnstile da revisão. */
  submit: (turnstileToken: string) => Promise<void>;
};

/** Ao restaurar, a fala atual já conta como vista: recarregar a página não repete o "digitando…". */
function withCurrentPromptRevealed(saved: ConversationState): ConversationState {
  const currentPrompt = promptIdFor(saved.currentTarget);
  if (saved.revealedPrompts.includes(currentPrompt)) return saved;
  return { ...saved, revealedPrompts: [...saved.revealedPrompts, currentPrompt] };
}

function useConversationPersistence(
  state: ConversationState,
  restore: (saved: ConversationState) => void,
): HydrationPhase {
  const [hydration, setHydration] = useState<HydrationPhase>('pending');

  useEffect(() => {
    const saved = readSavedConversation();
    if (!saved) {
      setHydration('ready');
      return;
    }
    restore(withCurrentPromptRevealed(saved));
    setHydration('restoring');
    const timeoutId = window.setTimeout(() => setHydration('ready'), RESTORE_LOADING_MILLISECONDS);
    return () => window.clearTimeout(timeoutId);
  }, [restore]);

  // No Hero não há conversa a guardar: sem isso, "Reiniciar conversa" regravava o estado inicial e o reload
  // seguinte mostrava o loading de "restaurando" só para cair no Hero de novo. Depois do envio (`success`)
  // também apaga: os dados pessoais não ficam na aba, e voltar a /contact recomeça do Hero.
  useEffect(() => {
    if (hydration === 'pending') return;
    if (state.stage === 'hero' || state.stage === 'success') clearSavedConversation();
    else saveConversation(state);
  }, [state, hydration]);

  return hydration;
}

type ConversationActions = Omit<ConversationControls, 'state' | 'hydration' | 'submitStatus' | 'submit'>;

/**
 * Ações da conversa. As que mexem nas respostas (responder, voltar, editar) zeram o erro do último envio: ao
 * voltar à revisão, ele não aparece antes de uma nova tentativa.
 */
function createConversationActions(
  dispatch: Dispatch<ConversationAction>,
  setSubmitStatus: (status: SubmitStatus) => void,
): ConversationActions {
  const changeAnswers = (action: ConversationAction) => {
    setSubmitStatus('idle');
    dispatch(action);
  };
  return {
    start: () => dispatch({ type: 'start' }),
    answer: (stepKey, answer) => changeAnswers({ type: 'answer', stepKey, answer }),
    goBack: () => changeAnswers({ type: 'goBack' }),
    edit: (stepKey) => changeAnswers({ type: 'edit', stepKey }),
    revealPrompt: (promptId) => dispatch({ type: 'revealPrompt', promptId }),
    setPrivacyAccepted: (accepted) => dispatch({ type: 'setPrivacyAccepted', accepted }),
    restart: () => {
      clearSavedConversation();
      changeAnswers({ type: 'restart' });
    },
  };
}

/**
 * Estado + ações da conversa guiada, com persistência na aba e envio injetado (`sendContactSubmission`).
 * @example const conversation = useConversation(sendContactSubmission, locale);
 */
export function useConversation(send: SendContactSubmission, locale: SupportedLocale): ConversationControls {
  const [state, dispatch] = useReducer(conversationReducer, INITIAL_CONVERSATION_STATE);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const restore = useCallback((saved: ConversationState) => dispatch({ type: 'restore', state: saved }), []);
  const hydration = useConversationPersistence(state, restore);

  const submit = useCallback(
    async (turnstileToken: string) => {
      if (state.currentTarget !== REVIEW_STEP_KEY || !state.privacyAccepted) return;
      setSubmitStatus('submitting');
      try {
        await send(buildContactSubmission(state.answers, locale, turnstileToken));
        setSubmitStatus('idle');
        dispatch({ type: 'complete' });
      } catch (error) {
        setSubmitStatus(statusAfterFailure(error));
      }
    },
    [send, locale, state.answers, state.privacyAccepted, state.currentTarget],
  );

  const actions = useMemo(() => createConversationActions(dispatch, setSubmitStatus), []);

  return { state, hydration, submitStatus, submit, ...actions };
}
