import { drawStrokes } from './stroke-drawing';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** Só as linhas de dentro do globo são desenhadas; o contorno (círculo) fica fixo. */
const GLOBE_INNER_STROKE_SELECTORS = ['[data-stroke="meridian"]', '[data-stroke="equator"]'] as const;

/** Desenho de `lucide-globe.svg` inline. */
function GlobeGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
        <path
          data-stroke="meridian"
          d="M12 2C9.43223 4.69615 8 8.27674 8 12C8 15.7233 9.43223 19.3038 12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2Z"
        />
        <path data-stroke="equator" d="M2 12H22" />
      </g>
    </svg>
  );
}

const playGlobeCycle = (animate: IconAnimate) => drawStrokes(animate, GLOBE_INNER_STROKE_SELECTORS);

export const globeIcon: AnimatedIconDefinition = { kind: 'cycle', Graphic: GlobeGraphic, playCycle: playGlobeCycle };
