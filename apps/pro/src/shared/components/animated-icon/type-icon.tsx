import { ICON_SOFT_EASING, ICON_TYPE_SECONDS, ICON_TYPE_TOP_SCALE } from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** Ícone `type` do lucide (um "T"), inline; a barra de cima (`data-type-top`) é a que se estica. */
function TypeGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="1.4182" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <polyline data-type-top points="4 7 4 4 20 4 20 7" />
        <line x1="9" x2="15" y1="20" y2="20" />
        <line x1="12" x2="12" y1="4" y2="20" />
      </g>
    </svg>
  );
}

/** A barra de cima estica na horizontal, em torno do próprio centro (o eixo do T), e volta. */
function playTypeCycle(animate: IconAnimate): Promise<unknown> {
  return Promise.resolve(
    animate(
      '[data-type-top]',
      { scaleX: [1, ICON_TYPE_TOP_SCALE, 1] },
      { duration: ICON_TYPE_SECONDS, ease: ICON_SOFT_EASING },
    ),
  );
}

export const typeIcon: AnimatedIconDefinition = { kind: 'cycle', Graphic: TypeGraphic, playCycle: playTypeCycle };
