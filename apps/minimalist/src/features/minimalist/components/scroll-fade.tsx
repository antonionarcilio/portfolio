'use client';

import { motion } from 'framer-motion';

import { minimalistFadeTransition } from '../animations';

/**
 * Gradiente de topo/fundo de um scroller — aparece só quando há conteúdo escondido daquele
 * lado (`useScrollEdges`) e some ao chegar na ponta. `block` é o prefixo BEM do painel
 * chamador (ex.: "minimalist__project-fade", "minimalist__about-bio-panel__gradient") — cada
 * painel define suas próprias variantes `--top`/`--bottom`/`--{scroller}` no próprio CSS.
 */
export function ScrollFade({
  block,
  edge,
  scroller,
  visible,
}: {
  block: string;
  edge: 'top' | 'bottom';
  scroller: string;
  visible: boolean;
}) {
  return (
    <motion.span
      className={`${block} ${block}--${edge} ${block}--${scroller}`}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={minimalistFadeTransition}
    />
  );
}
