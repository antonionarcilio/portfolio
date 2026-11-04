'use client';
import { animate, useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import { useEffect } from 'react';

import { ISLAND_BAR_SPRING } from './animations';

/**
 * Largura animada (mola) que segue `targetWidth`. A primeira medição é aplicada na hora e as
 * seguintes animam. O valor de movimento existe desde a montagem (começa em `auto`); com
 * `animate={{ width }}` ele só passava a existir depois da primeira medição, e a primeira troca
 * de largura depois de recarregar a página saía seca, sem mola.
 * @example const barWidth = useAnimatedWidth(contentWidth + 6); <motion.div style={{ width: barWidth }} />
 */
export function useAnimatedWidth(targetWidth: number | null): MotionValue<number | 'auto'> {
  const animatedWidth = useMotionValue<number | 'auto'>('auto');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (targetWidth === null) return;
    if (animatedWidth.get() === 'auto' || shouldReduceMotion) return animatedWidth.jump(targetWidth);
    const controls = animate(animatedWidth, targetWidth, ISLAND_BAR_SPRING);
    return () => controls.stop();
  }, [targetWidth, animatedWidth, shouldReduceMotion]);

  return animatedWidth;
}
