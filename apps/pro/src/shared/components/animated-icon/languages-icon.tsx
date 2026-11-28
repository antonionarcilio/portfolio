import { drawStrokes } from './stroke-drawing';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** Ordem em que o ideograma é "escrito": ponto, traço de cima, diagonal longa e diagonal curta. */
const IDEOGRAM_STROKE_SELECTORS = [
  '[data-ideogram-stroke="0"]',
  '[data-ideogram-stroke="1"]',
  '[data-ideogram-stroke="2"]',
  '[data-ideogram-stroke="3"]',
] as const;

/** `lucide-languages.svg` inline: o "A" fica fixo e cada linha do ideograma (`data-ideogram-stroke`) é desenhada. */
function LanguagesGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path data-ideogram-stroke="0" d="M7 2H8" />
        <path data-ideogram-stroke="1" d="M2 5H14" />
        <path data-ideogram-stroke="2" d="M4 14L10 8L12 5" />
        <path data-ideogram-stroke="3" d="M5 8L11 14" />
        <path d="M22 22L17 12L12 22" />
        <path d="M14 18H20" />
      </g>
    </svg>
  );
}

/** Cada linha do ideograma é desenhada de 0 a 100% e só então começa a seguinte; termina tudo completo. */
const playLanguagesCycle = (animate: IconAnimate) => drawStrokes(animate, IDEOGRAM_STROKE_SELECTORS);

export const languagesIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: LanguagesGraphic,
  playCycle: playLanguagesCycle,
};
