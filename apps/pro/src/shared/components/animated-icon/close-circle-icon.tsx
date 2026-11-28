import { ICON_CLOSE_DRAW_SECONDS, ICON_CLOSE_SECOND_LINE_DELAY_SECONDS } from '@/shared/animations';
import { drawStrokes } from './stroke-drawing';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** Os dois traços do X, na ordem do desenho; ambos partem do topo, então são desenhados de cima para baixo. */
const CLOSE_LINE_SELECTORS = ['[data-stroke="first-line"]', '[data-stroke="second-line"]'] as const;

/** `solar-close-circle.svg` em traço: o anel fica fixo e as duas linhas do X são desenhadas. */
function CloseCircleGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path data-stroke="first-line" d="M9.5 9.5 14.5 14.5" />
        <path data-stroke="second-line" d="M14.5 9.5 9.5 14.5" />
      </g>
    </svg>
  );
}

const playCloseCircleCycle = (animate: IconAnimate) =>
  drawStrokes(animate, CLOSE_LINE_SELECTORS, {
    drawSeconds: ICON_CLOSE_DRAW_SECONDS,
    staggerSeconds: ICON_CLOSE_SECOND_LINE_DELAY_SECONDS,
  });

export const closeCircleIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: CloseCircleGraphic,
  playCycle: playCloseCircleCycle,
};
