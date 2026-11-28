import { animate } from 'framer-motion';

import { ICON_ARROW_ACTIVE_ROTATION_DEGREES, ICON_ARROW_ROTATION_SECONDS, ICON_SOFT_EASING } from '@/shared/animations';
import type { AnimatedIconDefinition, IconGraphicProps } from './types';

/** Desenho de `lucide-arrow-up-right.svg` inline. */
function ArrowUpRightGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path d="M7.05029 16.9497L16.9498 7.05021" />
        <path d="M7.05029 7.05029H16.9498V16.9498" />
      </g>
    </svg>
  );
}

/** Gira o <svg> em torno do próprio centro; chamadas seguidas substituem a animação em curso, sem salto. */
function rotateArrow(element: SVGSVGElement, isActive: boolean): void {
  const rotate = isActive ? ICON_ARROW_ACTIVE_ROTATION_DEGREES : 0;
  animate(element, { rotate }, { duration: ICON_ARROW_ROTATION_SECONDS, ease: ICON_SOFT_EASING });
}

export const arrowUpRightIcon: AnimatedIconDefinition = {
  kind: 'state',
  Graphic: ArrowUpRightGraphic,
  applyState: rotateArrow,
};
