import { ICON_RAYS_STAGGER_SECONDS } from '@/shared/animations';
import { fadeSequence } from './fade-sequence';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

const RAY_SELECTORS = Array.from({ length: 8 }, (_, index) => `[data-ray="${index}"]`);

/** `solar-sun.svg` inline (tema ensolarado); os 8 raios (`data-ray`, numerados no sentido horário a partir do topo) apagam e acendem, em ordem aleatória. */
function SunGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g stroke="black" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="6" />
        <path data-ray="0" d="M12 2V3" />
        <path data-ray="1" d="M19.0708 4.9292L18.678 5.32204" />
        <path data-ray="2" d="M22 12L21 12" />
        <path data-ray="3" d="M19.0708 19.0708L18.678 18.678" />
        <path data-ray="4" d="M12 21V22" />
        <path data-ray="5" d="M5.32178 18.6782L4.92894 19.0711" />
        <path data-ray="6" d="M3 12L2 12" />
        <path data-ray="7" d="M5.32178 5.32178L4.92894 4.92894" />
      </g>
    </svg>
  );
}

const playSunCycle = (animate: IconAnimate) => fadeSequence(animate, RAY_SELECTORS, ICON_RAYS_STAGGER_SECONDS);

export const sunIcon: AnimatedIconDefinition = { kind: 'cycle', Graphic: SunGraphic, playCycle: playSunCycle };
