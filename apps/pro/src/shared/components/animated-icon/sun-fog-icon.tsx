import { ICON_RAYS_STAGGER_SECONDS } from '@/shared/animations';
import { fadeSequence } from './fade-sequence';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/**
 * Só estes traços animam: os 5 raios e as DUAS últimas listras do reflexo (a de cima, `M2 16H22`, fica fixa).
 * Todos entram no mesmo sorteio, com o mesmo efeito do sol.
 */
const FADING_SELECTORS = [
  ...Array.from({ length: 5 }, (_, index) => `[data-ray="${index}"]`),
  '[data-reflection="1"]',
  '[data-reflection="2"]',
] as const;

/** `solar-sun-fog.svg` inline (tema entardecer). */
function SunFogGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16H22" />
        <path data-reflection="1" d="M5 19H19" />
        <path data-reflection="2" d="M8 22H16" />
        <path d="M6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 13.5217 17.4335 14.911 16.5 15.9687H7.5C6.56645 14.911 6 13.5217 6 12Z" />
        <path data-ray="0" d="M12 2V3" />
        <path data-ray="1" d="M19.0708 4.9292L18.678 5.32204" />
        <path data-ray="2" d="M22 12L21 12" />
        <path data-ray="3" d="M3 12L2 12" />
        <path data-ray="4" d="M5.32178 5.32178L4.92894 4.92894" />
      </g>
    </svg>
  );
}

const playSunFogCycle = (animate: IconAnimate) => fadeSequence(animate, FADING_SELECTORS, ICON_RAYS_STAGGER_SECONDS);

export const sunFogIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: SunFogGraphic,
  playCycle: playSunFogCycle,
};
