import {
  ICON_LINE_HEIGHT_ARROW_UNITS,
  ICON_LINE_HEIGHT_SECONDS,
  ICON_LINE_HEIGHT_STEM_SCALE,
  ICON_SOFT_EASING,
} from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** `lucide-line-height.svg` inline: a parte da esquerda (haste + setas) estica; as 3 linhas da direita ficam. */
function LineHeightGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="1.4182" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path data-line-height="stem" d="M7 4v16" />
        <path data-line-height="arrow-up" d="m3 8 4-4 4 4" />
        <path data-line-height="arrow-down" d="m3 16 4 4 4-4" />
        <path d="M15 6h6" />
        <path d="M15 12h6" />
        <path d="M15 18h6" />
      </g>
    </svg>
  );
}

/** A seta de cima sobe, a de baixo desce e a haste se alonga junto (esticando para cima e para baixo); voltam. */
function playLineHeightCycle(animate: IconAnimate): Promise<unknown> {
  const options = { duration: ICON_LINE_HEIGHT_SECONDS, ease: ICON_SOFT_EASING };
  const reach = ICON_LINE_HEIGHT_ARROW_UNITS;
  return Promise.all([
    animate('[data-line-height="stem"]', { scaleY: [1, ICON_LINE_HEIGHT_STEM_SCALE, 1] }, options),
    animate('[data-line-height="arrow-up"]', { y: [0, -reach, 0] }, options),
    animate('[data-line-height="arrow-down"]', { y: [0, reach, 0] }, options),
  ]);
}

export const lineHeightIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: LineHeightGraphic,
  playCycle: playLineHeightCycle,
};
