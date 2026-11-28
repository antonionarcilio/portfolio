import { drawStrokes } from './stroke-drawing';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** `lucide-contrast.svg` inline: o círculo fica fixo e o meio-círculo de dentro é desenhado. */
function ContrastGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="1.4182" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <circle cx="12" cy="12" r="10" />
        <path data-stroke="inner-half" d="M12 18a6 6 0 0 0 0-12v12z" />
      </g>
    </svg>
  );
}

const playContrastCycle = (animate: IconAnimate) => drawStrokes(animate, ['[data-stroke="inner-half"]']);

export const contrastIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: ContrastGraphic,
  playCycle: playContrastCycle,
};
