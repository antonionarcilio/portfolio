import {
  ICON_RUNNER_ARM_DEGREES,
  ICON_RUNNER_HEAD_SHIFT_UNITS,
  ICON_RUNNER_LEG_DEGREES,
  ICON_RUNNER_SECONDS,
  ICON_SOFT_EASING,
} from '@/shared/animations';
import type { AnimatedIconDefinition, IconAnimate, IconGraphicProps } from './types';

/**
 * `solar-running.svg` inline. O original funde tronco e braços numa só forma preenchida; aqui essa parte virou
 * traço (tronco, braço de trás e braço da frente), para os braços girarem em torno do ombro. Cabeça e pernas
 * são os traços originais.
 */
function RunningGraphic({ sizePixels, ref }: IconGraphicProps) {
  return (
    <svg ref={ref} aria-hidden width={sizePixels} height={sizePixels} viewBox="0 0 24 24" fill="none">
      <g stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle data-runner="head" cx="18.5" cy="4.5" r="2.5" />
        <path
          data-runner="rear-leg"
          d="M9 17L7.99923 18.2009C7.262 19.0856 6.89338 19.5279 6.38945 19.764C5.88552 20 5.30973 20 4.15813 20H3"
        />
        <path
          data-runner="front-leg"
          d="M14.0001 8.5L11.7793 11.2756L11.7793 11.2756C10.9429 12.321 10.5246 12.8438 10.4579 13.413C10.4204 13.733 10.4608 14.0573 10.5756 14.3584C10.7798 14.8939 11.3134 15.2981 12.3807 16.1066C13.1936 16.7225 13.6 17.0304 13.8755 17.4329C14.0326 17.6625 14.157 17.9129 14.2452 18.1767C14.3997 18.6394 14.3997 19.1493 14.3997 20.1692V21.9998"
        />
        <path d="M10.8 6.8C13.4 7 14.9 8.4 15.8 10.2" />
        <path data-runner="rear-arm" d="M10.8 6.8 4 9.6" />
        <path data-runner="front-arm" d="M15.8 10.2C16.6 11.4 17.8 12 19.1 12H21" />
      </g>
    </svg>
  );
}

/** Origem de rotação em fração da caixa de cada traço: o ombro/quadril é o canto por onde o traço se prende. */
const REAR_ARM_SHOULDER = { originX: 1, originY: 0 } as const;
const FRONT_ARM_SHOULDER = { originX: 0, originY: 0 } as const;
const FRONT_LEG_HIP = { originX: 0.9, originY: 0 } as const;
const REAR_LEG_HIP = { originX: 1, originY: 0 } as const;

/** Braço de trás -15°, braço da frente +15°, cabeça na horizontal e pernas em sentidos opostos; tudo volta ao repouso. */
function playRunningCycle(animate: IconAnimate): Promise<unknown> {
  const options = { duration: ICON_RUNNER_SECONDS, ease: ICON_SOFT_EASING };
  const arm = ICON_RUNNER_ARM_DEGREES;
  const leg = ICON_RUNNER_LEG_DEGREES;
  return Promise.all([
    animate('[data-runner="rear-arm"]', { rotate: [0, -arm, 0], ...REAR_ARM_SHOULDER }, options),
    animate('[data-runner="front-arm"]', { rotate: [0, arm, 0], ...FRONT_ARM_SHOULDER }, options),
    animate('[data-runner="head"]', { x: [0, ICON_RUNNER_HEAD_SHIFT_UNITS, 0] }, options),
    animate('[data-runner="front-leg"]', { rotate: [0, leg, 0], ...FRONT_LEG_HIP }, options),
    animate('[data-runner="rear-leg"]', { rotate: [0, -leg, 0], ...REAR_LEG_HIP }, options),
  ]);
}

export const runningIcon: AnimatedIconDefinition = {
  kind: 'cycle',
  Graphic: RunningGraphic,
  playCycle: playRunningCycle,
};
