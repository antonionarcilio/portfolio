import type { Transition } from 'framer-motion';
import { useMemo } from 'react';

const flipTransition: Transition = {
  duration: 0.45,
  ease: [0.2, 0.7, 0.2, 1],
};

/**
 * Supplies the shared Framer Motion layout contract for Minimalist expansion.
 * Framer Motion performs the First/Last/Invert/Play measurement for the stable node.
 */
export function useMinimalistFlipLayout(layoutId: string, expanded: boolean) {
  return useMemo(
    () => ({
      layout: true as const,
      layoutId: `minimalist-card-${layoutId}`,
      transition: flipTransition,
      'data-expanded': expanded ? 'true' : 'false',
    }),
    [expanded, layoutId],
  );
}
