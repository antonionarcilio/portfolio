import {
  ICON_PERSON_BODY_FADE_SECONDS,
  ICON_PERSON_HEAD_DELAY_SECONDS,
  ICON_PERSON_HEAD_FADE_SECONDS,
  ICON_PERSON_WAVE_DEGREES,
  ICON_PERSON_WAVE_SECONDS,
  ICON_SOFT_EASING,
} from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/**
 * `solar-accessibility.svg` redesenhado em traço (o original funde corpo, braços e pernas numa só forma e
 * não dá para mover os braços): anel e cabeça de 1,5 de espessura; os braços partem do tronco (12, 11.5).
 * Cada braço gira em torno do ombro, que é o canto inferior (esquerdo: direito; direito: esquerdo) da própria caixa.
 */
function AccessibilityGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle data-person="head" cx="12" cy="7" r="2" />
        <g data-person="body">
          <path d="M12 11.5V13.5L9 18.8M12 13.5L15 18.8" />
          <path data-person="arm-left" d="M12 11.5 6 10" />
          <path data-person="arm-right" d="M12 11.5 18 10" />
        </g>
      </g>
    </svg>
  );
}

/** Origem da rotação em fração da caixa do traço: o ombro fica no canto inferior interno de cada braço. */
const LEFT_ARM_SHOULDER = { originX: 1, originY: 1 } as const;
const RIGHT_ARM_SHOULDER = { originX: 0, originY: 1 } as const;

const WAVE_DEGREES = [...ICON_PERSON_WAVE_DEGREES];

/** Corpo em fade-in, braços acenando logo depois e cabeça em fade-in mais longo com atraso. */
function playAccessibilityCycle(animate: IconAnimate): Promise<unknown> {
  const wave = { duration: ICON_PERSON_WAVE_SECONDS, ease: ICON_SOFT_EASING, delay: ICON_PERSON_BODY_FADE_SECONDS };
  return Promise.all([
    animate(
      '[data-person="body"]',
      { opacity: [0, 1] },
      { duration: ICON_PERSON_BODY_FADE_SECONDS, ease: ICON_SOFT_EASING },
    ),
    animate('[data-person="arm-left"]', { rotate: WAVE_DEGREES, ...LEFT_ARM_SHOULDER }, wave),
    animate(
      '[data-person="arm-right"]',
      { rotate: WAVE_DEGREES.map((degrees) => -degrees), ...RIGHT_ARM_SHOULDER },
      wave,
    ),
    animate(
      '[data-person="head"]',
      { opacity: [0, 1] },
      { duration: ICON_PERSON_HEAD_FADE_SECONDS, ease: ICON_SOFT_EASING, delay: ICON_PERSON_HEAD_DELAY_SECONDS },
    ),
  ]);
}

export const accessibilityIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: AccessibilityGraphic,
  playCycle: playAccessibilityCycle,
};
