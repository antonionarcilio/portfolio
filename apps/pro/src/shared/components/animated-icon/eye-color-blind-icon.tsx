import { ICON_EYE_BLINK_SCALE, ICON_EYE_BLINK_SECONDS, ICON_SOFT_EASING } from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** `lucide-eye-color-blind.svg` inline: o contorno do olho fica fixo e a bola (`data-eyeball`) pisca. */
function EyeColorBlindGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="1.4182" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle data-eyeball cx="12" cy="12" r="3" />
      </g>
    </svg>
  );
}

/** A bola achata na vertical (pálpebra fechando) e volta. */
function playEyeBlinkCycle(animate: IconAnimate): Promise<unknown> {
  return Promise.resolve(
    animate(
      '[data-eyeball]',
      { scaleY: [1, ICON_EYE_BLINK_SCALE, 1] },
      { duration: ICON_EYE_BLINK_SECONDS, ease: ICON_SOFT_EASING },
    ),
  );
}

export const eyeColorBlindIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: EyeColorBlindGraphic,
  playCycle: playEyeBlinkCycle,
};
