import { ICON_SOFT_EASING, ICON_SPREAD_SECONDS, ICON_SPREAD_UNITS } from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** `lucide-letter-spacing.svg` inline; as barras das pontas (`data-bar`) são as que se afastam. */
function LetterSpacingGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="1.4182" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path data-bar="left" d="M4 6v12" />
        <path data-bar="right" d="M20 6v12" />
        <path d="m8 16 4-9 4 9" />
        <path d="M9.5 13h5" />
      </g>
    </svg>
  );
}

/** A barra da esquerda vai para a esquerda e a da direita para a direita, ao mesmo tempo, e voltam. */
function playLetterSpacingCycle(animate: IconAnimate): Promise<unknown> {
  const options = { duration: ICON_SPREAD_SECONDS, ease: ICON_SOFT_EASING };
  return Promise.all([
    animate('[data-bar="left"]', { x: [0, -ICON_SPREAD_UNITS, 0] }, options),
    animate('[data-bar="right"]', { x: [0, ICON_SPREAD_UNITS, 0] }, options),
  ]);
}

export const letterSpacingIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: LetterSpacingGraphic,
  playCycle: playLetterSpacingCycle,
};
