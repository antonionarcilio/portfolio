import { flushSync } from 'react-dom';

import type { MinimalistAppearance } from '../types';

export type ThemeTransitionPoint = { x: number; y: number };

const VT_TARGET_ATTRIBUTE = 'data-minimalist-vt-target';

export function shouldSkipAppearanceTransition(): boolean {
  if (typeof document === 'undefined') return true;
  if (document.documentElement.classList.contains('a11y-reduce-motion')) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function startAppearanceTransition(
  apply: () => void,
  target: MinimalistAppearance,
  origin?: ThemeTransitionPoint,
): void {
  if (!document.startViewTransition || shouldSkipAppearanceTransition()) {
    apply();
    return;
  }

  const root = document.documentElement;
  root.style.setProperty('--minimalist-vt-x', `${origin?.x ?? window.innerWidth / 2}px`);
  root.style.setProperty('--minimalist-vt-y', `${origin?.y ?? window.innerHeight / 2}px`);
  root.setAttribute(VT_TARGET_ATTRIBUTE, target);

  const transition = document.startViewTransition(() => flushSync(apply));
  transition.finished.finally(() => {
    root.style.removeProperty('--minimalist-vt-x');
    root.style.removeProperty('--minimalist-vt-y');
    root.removeAttribute(VT_TARGET_ATTRIBUTE);
  });
}
