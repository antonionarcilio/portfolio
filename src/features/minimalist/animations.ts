import type { Transition } from 'framer-motion';

/** Project easing curve — the single cubic-bezier used across the Minimalist feature. */
export const MINIMALIST_EASE = [0.2, 0.7, 0.2, 1] as const;

/** Shared FLIP transition for every Minimalist expansion (project cards, experience detail). */
export const MINIMALIST_EXPANSION_DURATION_SECONDS = 0.4;

export const minimalistExpansionTransition: Transition = {
  duration: MINIMALIST_EXPANSION_DURATION_SECONDS,
  ease: MINIMALIST_EASE,
};

export const MINIMALIST_EXPANSION_DURATION_MS = MINIMALIST_EXPANSION_DURATION_SECONDS * 1000;

/** Corner brackets fade in/out on hover and focus. */
export const MINIMALIST_CORNER_FADE_DURATION = 0.2;

/** Shared quick fade for secondary chrome (card corners, the experience footer's nav hint). */
export const minimalistFadeTransition: Transition = {
  duration: MINIMALIST_CORNER_FADE_DURATION,
  ease: MINIMALIST_EASE,
};
