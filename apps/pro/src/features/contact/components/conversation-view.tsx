'use client';

import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { OverlayScrollArea } from '@/shared/components/overlay-scroll-area';
import { useA11y } from '@/shared/contexts/a11y-context';

import { createAnswerReader } from '../engine/answer-reader';
import { buildTranscript } from '../engine/build-transcript';
import { previousStepKey } from '../engine/conversation-path';
import { REVIEW_STEP_KEY, type ResolvedStep } from '../engine/flow-types';
import type { VerifyEmailAddress } from '../engine/request-email-check';
import { useChatHeader } from '../engine/use-chat-header';
import { promptIdFor, type ConversationControls } from '../engine/use-conversation';
import { useFlowTexts } from '../engine/use-flow-texts';
import { usePromptReveal } from '../engine/use-prompt-reveal';
import { INTRO_FLOW_ID, INTRO_NAME_STEP_KEY } from '../flows/intro-flow';
import { ChatHeader } from './chat-header';
import { ConversationTranscript } from './conversation-transcript';
import { NameChangeComposer } from './name-change-composer';
import { RestartConfirmDialog, useRestartConfirmation } from './restart-confirm-dialog';
import { ReviewFooter } from './review-footer';
import { ReviewSummary } from './review-summary';
import { ShortcutsMenu } from './shortcuts-menu';
import type { ProfileLinks } from './social-links';
import { StepComposer } from './step-composer';
import type { StepNavigation } from './step-navigation';
import { SuccessState } from './success-state';
import { useNameChangeExchange } from './use-name-change-exchange';
import { useShortcutsMenu, type ShortcutsMenuControls } from './use-shortcuts-menu';
import { useTurnstileToken } from './use-turnstile-token';

type ConversationViewProps = {
  conversation: ConversationControls;
  links: ProfileLinks;
  /** Checagem de e-mail no BFF, repassada às etapas de campos. */
  verifyEmail: VerifyEmailAddress;
  /** Chave pública do Turnstile (vem do servidor); sem ela, a revisão não mostra o desafio. */
  turnstileSiteKey: string | undefined;
};

function buildNavigation(
  conversation: ConversationControls,
  step: ResolvedStep | undefined,
  shortcuts: ShortcutsMenuControls | undefined,
): StepNavigation {
  const { state } = conversation;
  const hasPrevious = Boolean(previousStepKey(state.currentTarget, state.answers));
  return {
    onBack: hasPrevious ? conversation.goBack : undefined,
    onSkip: step?.definition.optional ? () => conversation.answer(step.key, { type: 'skipped' }) : undefined,
    shortcuts,
  };
}

/** Atalhos (G06) só depois de escolher um fluxo: nem no nome nem no motivo; a revisão não tem compositor. */
function isFlowStep(step: ResolvedStep | undefined): step is ResolvedStep {
  return step !== undefined && step.flowId !== INTRO_FLOW_ID;
}

/**
 * Mantém o histórico encostado no fim: na montagem (conversa restaurada) pula direto; quando a conversa anda,
 * rola com suavidade. Só o contêiner do histórico rola — cabeçalho, compositor e a página ficam parados.
 */
function useFollowConversation(trigger: string) {
  const { features } = useA11y();
  const scrollAreaRef = useRef<HTMLElement | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    const isInstant = isFirstRenderRef.current || features.pauseAnimations;
    isFirstRenderRef.current = false;
    scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: isInstant ? 'auto' : 'smooth' });
  }, [trigger, features.pauseAnimations]);

  useStickToBottomOnResize(scrollAreaRef, trigger);
  return scrollAreaRef;
}

/**
 * Quando o histórico encolhe sem a conversa andar (erro de validação aumenta o compositor, teclado virtual
 * reduz o `dvh`, rotação), a última fala ficaria cortada embaixo: volta a encostar no fim, sem animação.
 * Reobserva a cada passo porque o elemento que rola só existe depois que o OverlayScrollArea inicializa.
 */
function useStickToBottomOnResize(scrollAreaRef: React.RefObject<HTMLElement | null>, trigger: string) {
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    let previousHeight = scrollArea.clientHeight;
    const observer = new ResizeObserver(() => {
      if (scrollArea.clientHeight < previousHeight) scrollArea.scrollTo({ top: scrollArea.scrollHeight });
      previousHeight = scrollArea.clientHeight;
    });
    observer.observe(scrollArea);
    return () => observer.disconnect();
  }, [scrollAreaRef, trigger]);
}

/**
 * Tela do chat (G01·2 em diante) em três faixas com altura fixa: cabeçalho (fixo), histórico (a única
 * área que rola) e rodapé com o compositor da etapa atual — ou o resumo com o rodapé de envio, na revisão,
 * ou o estado de sucesso no lugar do histórico.
 * @example <ConversationView conversation={conversation} links={links} verifyEmail={requestEmailCheck} turnstileSiteKey={siteKey} />
 */
export function ConversationView({ conversation, links, verifyEmail, turnstileSiteKey }: ConversationViewProps) {
  const t = useTranslations('pro.contactChat');
  const { state } = conversation;
  const visitorName = createAnswerReader(state.answers).field(INTRO_NAME_STEP_KEY, 'name') ?? '';
  const texts = useFlowTexts(visitorName, state.answers);
  const transcript = buildTranscript(state.currentTarget, state.answers);
  const step = transcript.currentStep;
  const isReview = state.currentTarget === REVIEW_STEP_KEY;
  // "Alterar meu nome" (G08): as falas do desvio entram entre o histórico e o compositor, na mesma etapa.
  const nameChange = useNameChangeExchange({ state, step, texts, visitorName, onReopen: conversation.openNameChange });
  const isEditingName = state.nameChange === 'editing';
  const promptId = nameChange?.prompt.id ?? promptIdFor(state.currentTarget);
  const stepPromptText = isReview ? t('review.prompt', { name: visitorName }) : step ? texts.prompt(step) : '';
  const promptText = nameChange?.prompt.text ?? stepPromptText;
  const isRevealed = state.revealedPrompts.includes(promptId);
  const isTyping = usePromptReveal({ promptId, text: promptText, isRevealed, onReveal: conversation.revealPrompt });
  const header = useChatHeader(state, step, texts);
  const scrollAreaRef = useFollowConversation(`${state.stage}|${state.currentTarget}|${state.nameChange}|${isTyping}`);
  const isSuccess = state.stage === 'success';
  const hasShortcuts = isFlowStep(step) && !isEditingName;
  const shortcuts = useShortcutsMenu(state.currentTarget, hasShortcuts && !isTyping);
  const restartConfirmation = useRestartConfirmation(shortcuts, conversation.restart);
  const turnstile = useTurnstileToken(conversation.submitStatus, isReview && !isTyping);

  return (
    <section className="contact-chat-viewport mx-auto flex w-full max-w-[720px] flex-col gap-md">
      {/* No sucesso o cabeçalho da conversa some (G02·Sucesso `WwOr4`): só a mensagem, centralizada na área. */}
      {!isSuccess && (
        <div className="shrink-0">
          <ChatHeader {...header} />
        </div>
      )}
      {isSuccess ? (
        <OverlayScrollArea className="min-h-0 flex-1">
          <div className="flex min-h-full flex-col">
            <SuccessState visitorName={visitorName} links={links} />
          </div>
        </OverlayScrollArea>
      ) : (
        <>
          {/* `min-h-full` + o `flex-1 justify-end` do transcript mantêm poucas mensagens encostadas embaixo.
              `min-h-[120px]`: em telas curtas (360×640, notebook com barra do navegador) o compositor mais alto
              (cards do motivo, investimento com faixa) não espreme o histórico a zero — quem cede é o compositor,
              cujo miolo passa a rolar por dentro (ver ComposerCard). */}
          <OverlayScrollArea className="min-h-[120px] flex-1" viewportRef={scrollAreaRef}>
            <div className="flex min-h-full flex-col">
              <ConversationTranscript
                entries={transcript.entries}
                asides={nameChange?.asides}
                currentPrompt={{
                  id: promptId,
                  text: promptText,
                  hint: step && !isReview && !nameChange ? texts.hint(step) : undefined,
                }}
                isTyping={isTyping}
                texts={texts}
                onEdit={conversation.edit}
                trailingContent={
                  isReview
                    ? (animateEntrance) => (
                        <ReviewSummary
                          answers={state.answers}
                          texts={texts}
                          onEdit={conversation.edit}
                          animateEntrance={animateEntrance}
                        />
                      )
                    : undefined
                }
              />
            </div>
          </OverlayScrollArea>
          {/* `relative`: o menu de atalhos flutua logo acima do compositor, sobre o fim do histórico.
              `min-h-0 flex-col`: em tela curta o rodapé encolhe e o miolo do compositor rola (ver ComposerCard). */}
          <div className="relative flex min-h-0 flex-col pb-md">
            <AnimatePresence>
              {shortcuts.isOpen && (
                <ShortcutsMenu
                  menu={shortcuts}
                  links={links}
                  onRestart={restartConfirmation.request}
                  onChangeName={() => {
                    shortcuts.close(false);
                    conversation.openNameChange();
                  }}
                />
              )}
            </AnimatePresence>
            {!isTyping && isReview && (
              <ReviewFooter
                privacyAccepted={state.privacyAccepted}
                onPrivacyChange={conversation.setPrivacyAccepted}
                submitStatus={conversation.submitStatus}
                onSubmit={() => void conversation.submit(turnstile.token)}
                turnstile={{ siteKey: turnstileSiteKey, ...turnstile, onTokenChange: turnstile.setToken }}
              />
            )}
            {!isTyping && step && isEditingName && (
              <NameChangeComposer
                texts={texts}
                currentName={state.answers[INTRO_NAME_STEP_KEY]}
                onChangeName={conversation.changeName}
                onCancel={conversation.cancelNameChange}
                verifyEmail={verifyEmail}
              />
            )}
            {!isTyping && step && !isEditingName && (
              <StepComposer
                step={step}
                texts={texts}
                previousAnswer={state.answers[step.key]}
                answers={state.answers}
                onAnswer={(answer) => conversation.answer(step.key, answer)}
                navigation={buildNavigation(conversation, step, hasShortcuts ? shortcuts : undefined)}
                verifyEmail={verifyEmail}
              />
            )}
          </div>
        </>
      )}
      <RestartConfirmDialog
        open={restartConfirmation.isOpen}
        onOpenChange={restartConfirmation.setIsOpen}
        visitorName={visitorName}
        onConfirm={restartConfirmation.confirm}
      />
    </section>
  );
}
