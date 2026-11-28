import { drawStrokes } from './stroke-drawing';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

const SLASH_STROKE_SELECTORS = ['[data-stroke="slash"]'] as const;

/** A barra "/" do botão Atalhos como traço; o `d` parte do topo, então ela é desenhada de cima para baixo. */
function SlashGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <path data-stroke="slash" d="M16 4 8 20" stroke="black" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

const playSlashCycle = (animate: IconAnimate) => drawStrokes(animate, SLASH_STROKE_SELECTORS);

export const slashIcon: AnimatedIconDefinition = { kind: 'cycle', Graphic: SlashGraphic, playCycle: playSlashCycle };
