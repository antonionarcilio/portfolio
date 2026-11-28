import {
  ICON_MARKER_ENTRY_ANGLE_DEGREES,
  ICON_MARKER_ENTRY_DISTANCE_UNITS,
  ICON_MARKER_ENTRY_SECONDS,
  ICON_MARKER_SCRIBBLE_SECONDS,
  ICON_MARKER_SCRIBBLE_UNITS,
  ICON_SOFT_EASING,
} from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/**
 * `lucide-highligh-links.svg` inline. Dois grupos aninhados, para os dois movimentos não disputarem o mesmo
 * eixo: `data-marker-entry` faz a entrada diagonal; `data-marker-scribble` faz o vai-e-vem horizontal.
 */
function HighlightLinksGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g data-marker-entry>
        <g data-marker-scribble strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
          <path d="M9 11L3 17V20H12L15 17" />
          <path d="M22.0001 12L17.4001 16.6C17.0262 16.9665 16.5236 17.1717 16.0001 17.1717C15.4766 17.1717 14.9739 16.9665 14.6001 16.6L9.40008 11.4C9.03363 11.0261 8.82837 10.5235 8.82837 10C8.82837 9.47649 9.03363 8.97386 9.40008 8.6L14.0001 4" />
        </g>
      </g>
    </svg>
  );
}

const ENTRY_ANGLE_RADIANS = (ICON_MARKER_ENTRY_ANGLE_DEGREES * Math.PI) / 180;

/** Ponto de partida da entrada: à direita (+x) e acima (-y) da posição final, na direção do ângulo configurado. */
const ENTRY_START_X = Math.cos(ENTRY_ANGLE_RADIANS) * ICON_MARKER_ENTRY_DISTANCE_UNITS;
const ENTRY_START_Y = -Math.sin(ENTRY_ANGLE_RADIANS) * ICON_MARKER_ENTRY_DISTANCE_UNITS;

/** Vai-e-vem horizontal que termina na posição de repouso. */
const SCRIBBLE_X = [0, -1, 1, -1, 1, 0].map((direction) => direction * ICON_MARKER_SCRIBBLE_UNITS);

/** O marca-texto entra na diagonal (com fade) e, ao assentar, rabisca na horizontal. */
function playHighlightLinksCycle(animate: IconAnimate): Promise<unknown> {
  return Promise.all([
    animate(
      '[data-marker-entry]',
      { x: [ENTRY_START_X, 0], y: [ENTRY_START_Y, 0], opacity: [0, 1] },
      { duration: ICON_MARKER_ENTRY_SECONDS, ease: ICON_SOFT_EASING },
    ),
    animate(
      '[data-marker-scribble]',
      { x: SCRIBBLE_X },
      { duration: ICON_MARKER_SCRIBBLE_SECONDS, ease: ICON_SOFT_EASING, delay: ICON_MARKER_ENTRY_SECONDS },
    ),
  ]);
}

export const highlightLinksIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: HighlightLinksGraphic,
  playCycle: playHighlightLinksCycle,
};
