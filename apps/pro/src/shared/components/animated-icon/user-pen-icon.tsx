import {
  ICON_PEN_SCRIBBLE_POINTS,
  ICON_PEN_SCRIBBLE_RANGE_UNITS,
  ICON_PEN_SCRIBBLE_SECONDS,
  ICON_SOFT_EASING,
} from '@/shared/animations';
import { randomScribblePath } from './scribble-path';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/** Desenho de `lucide-user-pen.svg` inline; o lápis (`data-pen`) é a única parte que se mexe. */
function UserPenGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="black">
        <path d="M11.5 15H7C5.93913 15 4.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21" />
        <path d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" />
        <path
          data-pen
          d="M21.378 16.626C21.7764 16.2277 22.0001 15.6874 22.0001 15.124C22.0001 14.5607 21.7764 14.0204 21.378 13.622C20.9797 13.2237 20.4394 12.9999 19.876 12.9999C19.3127 12.9999 18.7724 13.2237 18.374 13.622L14.364 17.634C14.1263 17.8716 13.9522 18.1653 13.858 18.488L13.021 21.358C12.9959 21.4441 12.9944 21.5353 13.0166 21.6221C13.0389 21.7089 13.084 21.7882 13.1474 21.8516C13.2108 21.915 13.2901 21.9601 13.3769 21.9824C13.4637 22.0046 13.5549 22.0031 13.641 21.978L16.511 21.141C16.8337 21.0468 17.1274 20.8727 17.365 20.635L21.378 16.626Z"
        />
      </g>
    </svg>
  );
}

function playUserPenCycle(animate: IconAnimate): Promise<unknown> {
  return Promise.resolve(
    animate(
      '[data-pen]',
      {
        x: randomScribblePath(ICON_PEN_SCRIBBLE_RANGE_UNITS, ICON_PEN_SCRIBBLE_POINTS),
        y: randomScribblePath(ICON_PEN_SCRIBBLE_RANGE_UNITS, ICON_PEN_SCRIBBLE_POINTS),
      },
      { duration: ICON_PEN_SCRIBBLE_SECONDS, ease: ICON_SOFT_EASING },
    ),
  );
}

export const userPenIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: UserPenGraphic,
  playCycle: playUserPenCycle,
};
