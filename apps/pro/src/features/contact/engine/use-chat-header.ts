'use client';

import { useTranslations } from 'next-intl';

import type { AnswerMap } from './answer-reader';
import { computeProgress, type ConversationProgress } from './conversation-progress';
import type { ConversationState } from './conversation-state';
import { REVIEW_STEP_KEY, type ResolvedStep } from './flow-types';
import type { FlowTexts } from './use-flow-texts';

export type ChatHeaderContent = { title: string; subtitle: string; progressLabel: string; progressFraction: number };

function progressLabel(progress: ConversationProgress, t: ReturnType<typeof useTranslations>): string {
  if (progress.kind === 'intro') return t('introProgress');
  return t('stepProgress', { current: progress.current, total: progress.total });
}

function headerTitle(
  state: ConversationState,
  step: ResolvedStep | undefined,
  texts: FlowTexts,
  t: ReturnType<typeof useTranslations>,
): string {
  if (state.currentTarget === REVIEW_STEP_KEY || !step) return t('reviewTitle');
  return texts.title(step);
}

/**
 * Título e progresso do "Cabeçalho da Conversa" para o momento atual (etapa ou revisão). No sucesso o
 * cabeçalho não aparece (design `WwOr4`).
 * @example const header = useChatHeader(state, transcript.currentStep, texts);
 */
export function useChatHeader(
  state: ConversationState,
  step: ResolvedStep | undefined,
  texts: FlowTexts,
): ChatHeaderContent {
  const t = useTranslations('pro.contactChat.header');
  const answers: AnswerMap = state.answers;
  const progress = computeProgress(state.currentTarget, answers);

  return {
    title: headerTitle(state, step, texts, t),
    subtitle: t('subtitle'),
    progressLabel: progressLabel(progress, t),
    progressFraction: progress.fraction,
  };
}
