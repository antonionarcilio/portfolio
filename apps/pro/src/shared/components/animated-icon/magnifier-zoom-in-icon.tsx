import { ICON_SOFT_EASING, ICON_ZOOM_PLUS_SCALE, ICON_ZOOM_PLUS_SECONDS } from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/**
 * `solar-minimalistic-magnifer-zoom-in.svg` em traço (o original funde lupa e "+" numa só forma, e não dá para
 * mexer só no sinal): anel de 1,5, cabo e o "+" (`data-zoom-plus`) centrado em (11.5, 11.5), o centro da lupa.
 */
function MagnifierZoomInGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g stroke="black" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11.5" cy="11.5" r="9.5" />
        <path d="M20 20L22 22" />
        <path data-zoom-plus d="M11.5 9V14M9 11.5H14" />
      </g>
    </svg>
  );
}

/** Espessura do traço do ícone, em unidades do viewBox. */
const STROKE_WIDTH = 1.5;

/**
 * Só o sinal de mais cresce, em torno do próprio centro (que é o da lupa), e volta ao tamanho. A escala também
 * engrossaria o traço (1,5 × 1,7 ≈ 2,5), então a espessura é reduzida na mesma proporção durante o crescimento.
 */
function playMagnifierZoomInCycle(animate: IconAnimate): Promise<unknown> {
  return Promise.resolve(
    animate(
      '[data-zoom-plus]',
      {
        scale: [1, ICON_ZOOM_PLUS_SCALE, 1],
        strokeWidth: [STROKE_WIDTH, STROKE_WIDTH / ICON_ZOOM_PLUS_SCALE, STROKE_WIDTH],
      },
      { duration: ICON_ZOOM_PLUS_SECONDS, ease: ICON_SOFT_EASING },
    ),
  );
}

export const magnifierZoomInIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: MagnifierZoomInGraphic,
  playCycle: playMagnifierZoomInCycle,
};
