'use client';

import { useEffect } from 'react';

import { useA11y } from '@/shared/contexts/a11y-context';

import {
  BOT_TYPING_MAXIMUM_MILLISECONDS,
  BOT_TYPING_MILLISECONDS_PER_CHARACTER,
  BOT_TYPING_MINIMUM_MILLISECONDS,
} from '../animations';

/** @example botTypingDelay(80) // 880 */
export function botTypingDelay(characterCount: number): number {
  const proportional = BOT_TYPING_MINIMUM_MILLISECONDS + characterCount * BOT_TYPING_MILLISECONDS_PER_CHARACTER;
  return Math.min(BOT_TYPING_MAXIMUM_MILLISECONDS, proportional);
}

type PromptRevealOptions = {
  promptId: string | undefined;
  text: string;
  isRevealed: boolean;
  onReveal: (promptId: string) => void;
};

/**
 * Simula o bot "digitando": a fala ainda não revelada espera um atraso proporcional ao texto e então é
 * marcada como revelada. Com "pausar animações" (a11y, que já nasce de `prefers-reduced-motion`) revela na
 * hora. Devolve `true` enquanto o "digitando…" deve aparecer.
 * @example const isTyping = usePromptReveal({ promptId, text, isRevealed, onReveal });
 */
export function usePromptReveal({ promptId, text, isRevealed, onReveal }: PromptRevealOptions): boolean {
  const { features } = useA11y();
  const shouldSkipDelay = features.pauseAnimations;

  useEffect(() => {
    if (!promptId || isRevealed) return;
    if (shouldSkipDelay) {
      onReveal(promptId);
      return;
    }
    const timer = window.setTimeout(() => onReveal(promptId), botTypingDelay(text.length));
    return () => window.clearTimeout(timer);
  }, [promptId, text, isRevealed, onReveal, shouldSkipDelay]);

  return Boolean(promptId) && !isRevealed;
}
