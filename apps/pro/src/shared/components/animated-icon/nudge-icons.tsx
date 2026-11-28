import { ICON_NUDGE_SECONDS, ICON_NUDGE_UNITS, ICON_SOFT_EASING } from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

type NudgeAxis = 'x' | 'y';

/**
 * O ícone inteiro (`data-nudge`) desloca para `direction` no `axis` (x: -1 esquerda, 1 direita; y: -1 cima,
 * 1 baixo) e volta devagar ao lugar.
 */
function nudgeCycle(axis: NudgeAxis, direction: -1 | 1): (animate: IconAnimate) => Promise<unknown> {
  return (animate) =>
    Promise.resolve(
      animate(
        '[data-nudge]',
        { [axis]: [0, direction * ICON_NUDGE_UNITS, 0] },
        { duration: ICON_NUDGE_SECONDS, ease: ICON_SOFT_EASING },
      ),
    );
}

/** Chevron ‹ de `lucide-chevron-left.svg` ("Onde me encontrar" → voltar ao menu). */
function ChevronLeftGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g data-nudge strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path d="M15 18L9 12L15 6" />
      </g>
    </svg>
  );
}

/** Chevron › de `lucide-chevron-right.svg` (item que abre o submenu "Onde me encontrar"). */
function ChevronRightGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g data-nudge strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path d="M9 18L15 12L9 6" />
      </g>
    </svg>
  );
}

/** Seta ← de `lucide-arrow-left.svg` (botão Voltar do compositor). */
function ArrowLeftGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g data-nudge strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path d="M12 19L5 12L12 5" />
        <path d="M19 12H5" />
      </g>
    </svg>
  );
}

/** Seta ↑ branca de `lucide-arrow-up-white.svg` (botão Enviar, sobre o círculo preto). */
function ArrowUpWhiteGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g data-nudge strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="white">
        <path d="M12 19V5" />
        <path d="M5 12L12 5L19 12" />
      </g>
    </svg>
  );
}

export const chevronLeftIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: ChevronLeftGraphic,
  playCycle: nudgeCycle('x', -1),
};

export const chevronRightIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: ChevronRightGraphic,
  playCycle: nudgeCycle('x', 1),
};

export const arrowLeftIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: ArrowLeftGraphic,
  playCycle: nudgeCycle('x', -1),
};

export const arrowUpWhiteIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: ArrowUpWhiteGraphic,
  playCycle: nudgeCycle('y', -1),
};
