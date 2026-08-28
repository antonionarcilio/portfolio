import type { Transition } from 'framer-motion';

/** Easing curve used across the project — see CLAUDE.md "Animations". */
export const FLIP_DEMO_EASE = [0.2, 0.7, 0.2, 1] as const;

/** Duration of the FLIP expand/collapse animation. */
export const FLIP_DEMO_EXPANSION_DURATION_SECONDS = 0.4;
export const FLIP_DEMO_EXPANSION_DURATION_MS = FLIP_DEMO_EXPANSION_DURATION_SECONDS * 1000;

export const flipDemoExpansionTransition: Transition = {
  duration: FLIP_DEMO_EXPANSION_DURATION_SECONDS,
  ease: FLIP_DEMO_EASE,
};

/** Quick fade for secondary chrome (corner brackets). */
export const FLIP_DEMO_FADE_DURATION = 0.2;

export const flipDemoFadeTransition: Transition = {
  duration: FLIP_DEMO_FADE_DURATION,
  ease: FLIP_DEMO_EASE,
};
