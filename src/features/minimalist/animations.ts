import type { Transition } from 'framer-motion';

/** Project easing curve — the single cubic-bezier used across the Minimalist feature. */
export const MINIMALIST_EASE = [0.2, 0.7, 0.2, 1] as const;

/** Corner brackets fade in/out on hover and focus. */
export const MINIMALIST_CORNER_FADE_DURATION = 0.2;

/** Shared quick fade for secondary chrome (card corners, the experience footer's nav hint). */
export const minimalistFadeTransition: Transition = {
  duration: MINIMALIST_CORNER_FADE_DURATION,
  ease: MINIMALIST_EASE,
};

/** Multi-phase icon morphs (see `animated-chevrons`, `animated-arrow-up-down`) run three equal phases. */
export const MINIMALIST_MORPH_PHASE_COUNT = 3;

/** Header logo-links reveal (see `logo-links.tsx`): shared enter/exit duration and per-icon stagger step. */
export const MINIMALIST_LOGO_LINKS_DURATION = 0.4;
export const MINIMALIST_LOGO_LINKS_ICON_STAGGER = 0.08;
/** How long the logo-links reveal stays open after losing hover/focus before it starts closing. */
export const MINIMALIST_LOGO_LINKS_HIDE_DELAY_MS = 2000;
