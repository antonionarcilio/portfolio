import { ICON_SOFT_EASING, ICON_STROKE_DRAW_SECONDS, ICON_STROKE_STAGGER_SECONDS } from '@/shared/animations';
import type { IconAnimate } from './types';

/** O traço "acende" quase instantaneamente quando chega a vez dele (a opacidade só liga/desliga, não é um fade). */
const VISIBILITY_SWITCH_SECONDS = 0.01;

/**
 * Desenha os traços (`pathLength` de 0 a 100%) um após o outro, na ordem dos seletores. O traço termina
 * completo, que é a pose de repouso: o ícone parado sempre aparece inteiro.
 *
 * Com `stroke-linecap: round`, um traço de comprimento 0 ainda mostra um pontinho (as pontas redondas). Por isso a
 * opacidade fica em 0 enquanto o traço espera a vez e vai a 1 no instante em que ele começa a ser desenhado.
 * @example await drawStrokes(animate, ['[data-stroke="arrow"]', '[data-stroke="curve"]'], { staggerSeconds: 0.1 });
 */
export function drawStrokes(
  animate: IconAnimate,
  selectors: readonly string[],
  options: { drawSeconds?: number; staggerSeconds?: number } = {},
): Promise<unknown> {
  const { drawSeconds = ICON_STROKE_DRAW_SECONDS, staggerSeconds = ICON_STROKE_STAGGER_SECONDS } = options;
  const drawings = selectors.map((selector, index) =>
    animate(
      selector,
      { pathLength: [0, 1], opacity: [0, 1] },
      {
        duration: drawSeconds,
        ease: ICON_SOFT_EASING,
        delay: index * staggerSeconds,
        opacity: { duration: VISIBILITY_SWITCH_SECONDS, ease: 'linear', delay: index * staggerSeconds },
      },
    ),
  );
  return Promise.all(drawings);
}
