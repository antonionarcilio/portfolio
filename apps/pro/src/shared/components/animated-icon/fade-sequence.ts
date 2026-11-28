import { ICON_FLICKER_SECONDS, ICON_SOFT_EASING } from '@/shared/animations';
import { shuffled } from './shuffle';
import type { IconAnimate } from './types';

/**
 * Cada seletor apaga e volta a acender (opacidade 1 → 0 → 1), um após o outro, numa ORDEM ALEATÓRIA sorteada a
 * cada execução. Roda uma vez e termina com todos visíveis, a pose de repouso.
 * @example await fadeSequence(animate, ['[data-ray="0"]', '[data-ray="1"]'], 0.1);
 */
export function fadeSequence(
  animate: IconAnimate,
  selectors: readonly string[],
  staggerSeconds: number,
): Promise<unknown> {
  const flickers = shuffled(selectors).map((selector, index) =>
    animate(
      selector,
      { opacity: [1, 0, 1] },
      { duration: ICON_FLICKER_SECONDS, ease: ICON_SOFT_EASING, delay: index * staggerSeconds },
    ),
  );
  return Promise.all(flickers);
}
