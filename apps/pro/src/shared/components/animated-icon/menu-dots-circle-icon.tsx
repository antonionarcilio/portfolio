import {
  ICON_DOTS_FADE_SECONDS,
  ICON_DOTS_SLIDE_UNITS,
  ICON_DOTS_STAGGER_SECONDS,
  ICON_SOFT_EASING,
} from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

const DOT_SELECTORS = ['[data-dot="first"]', '[data-dot="second"]', '[data-dot="third"]'] as const;

/** Desenho de `solar-menu-dots-circle.svg` inline; o anel é fixo e os 3 pontos (`data-dot`) entram em sequência. */
function MenuDotsCircleGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g fill="#1C274C">
        <path
          data-dot="first"
          d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z"
        />
        <path
          data-dot="second"
          d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
        />
        <path
          data-dot="third"
          d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
        />
      </g>
    </svg>
  );
}

/** Cada ponto entra em fade-in deslizando de cima para baixo, um a um; terminam todos no lugar, a pose de repouso. */
function playMenuDotsCycle(animate: IconAnimate): Promise<unknown> {
  const fades = DOT_SELECTORS.map((selector, index) =>
    animate(
      selector,
      { opacity: [0, 1], y: [-ICON_DOTS_SLIDE_UNITS, 0] },
      { duration: ICON_DOTS_FADE_SECONDS, ease: ICON_SOFT_EASING, delay: index * ICON_DOTS_STAGGER_SECONDS },
    ),
  );
  return Promise.all(fades);
}

export const menuDotsCircleIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: MenuDotsCircleGraphic,
  playCycle: playMenuDotsCycle,
};
