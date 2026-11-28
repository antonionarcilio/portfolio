import { drawStrokes } from './stroke-drawing';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** Ordem do desenho: começa no ponto de baixo da curva, sobe até a seta e termina na outra aba da ponta. */
const UNDO_STROKE_SELECTORS = ['[data-stroke="curve"]', '[data-stroke="arrowhead"]'] as const;

/**
 * "Desfazer" em traço (lucide `undo-2`), com o sentido dos traços invertido para o desenho partir de baixo:
 * `curve` vai do ponto inferior, contorna a curva e sobe a aba de cima da seta (`l5-5`); `arrowhead` é a aba de baixo.
 */
function UndoGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path data-stroke="curve" d="M11 20h3.5a5.5 5.5 0 0 0 0-11H4l5-5" />
        <path data-stroke="arrowhead" d="M4 9l5 5" />
      </g>
    </svg>
  );
}

const playUndoCycle = (animate: IconAnimate) => drawStrokes(animate, UNDO_STROKE_SELECTORS);

export const undoIcon: AnimatedIconDefinition = { kind: 'cycle', Graphic: UndoGraphic, playCycle: playUndoCycle };
