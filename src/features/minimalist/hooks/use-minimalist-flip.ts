import { useMemo } from 'react';

import { minimalistExpansionTransition } from '../animations';

/**
 * Supplies the shared Framer Motion layout contract for Minimalist expansion.
 * Framer Motion performs the First/Last/Invert/Play measurement for the stable node.
 */
export function useMinimalistFlipLayout(layoutId: string, expanded: boolean) {
  return useMemo(
    () => ({
      layout: true as const,
      layoutId: `minimalist-card-${layoutId}`,
      transition: minimalistExpansionTransition,
      'data-expanded': expanded ? 'true' : 'false',
    }),
    [expanded, layoutId],
  );
}
