'use client';
import { motion } from 'framer-motion';

import { islandPillTransition } from './animations';
import type { PillGeometry } from './use-pill-geometry';

/**
 * Pílula branca que desliza até o item ativo (menu da ilha e abas do painel de ferramentas).
 * `top-0`: o padding de 3px é do container da ilha, então a pílula nasce na altura dos botões.
 * @example {pill && <SlidingPill geometry={pill} />}
 */
export function SlidingPill({ geometry }: { geometry: PillGeometry }) {
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{ left: geometry.left, width: geometry.width }}
      transition={islandPillTransition}
      className="pointer-events-none absolute top-0 h-[33px] rounded-[6px] border border-alpha-white-100 bg-alpha-white-100 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)]"
    />
  );
}
