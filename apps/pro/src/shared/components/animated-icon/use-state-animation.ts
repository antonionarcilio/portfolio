'use client';
import { useEffect, useRef, type RefObject } from 'react';

import type { AnimatedIconDefinition } from './types';

/**
 * Leva um ícone `state` à pose ativa/repouso sempre que `isActive` muda. Não anima na montagem: só sai do
 * repouso depois da primeira ativação. Ícones `cycle` passam sem efeito.
 * @example useStateAnimation(definition, svgRef, isTriggered && isMotionAllowed);
 */
export function useStateAnimation(
  definition: AnimatedIconDefinition,
  svgRef: RefObject<SVGSVGElement | null>,
  isActive: boolean,
): void {
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (definition.kind !== 'state' || !svgRef.current) return;
    if (!isActive && !wasActiveRef.current) return;
    wasActiveRef.current = isActive;
    definition.applyState(svgRef.current, isActive);
  }, [definition, svgRef, isActive]);
}
