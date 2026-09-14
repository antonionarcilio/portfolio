import { useCallback, useEffect, useState } from 'react';

import {
  A11Y_OPTION_KEYS,
  applyDocumentClasses,
  // getUpscaleGuard,
  persistOptions,
  readOptions,
  syncMotionPreference,
  type A11yOptions,
} from '@/shared/a11y/store';

export const MINIMALIST_A11Y_WHEEL_THRESHOLD = 80;
export const MINIMALIST_A11Y_WHEEL_COOLDOWN_MS = 250;
export const MINIMALIST_A11Y_SOUND_MOBILE_MAX_WIDTH_PX = 512; // matches the 32rem breakpoint already used in styles.css
export const MINIMALIST_A11Y_ACCORDION_MAX_WIDTH_PX = 670; // matches the shared @media (width <= 670px) mobile breakpoint in styles.css
export const MINIMALIST_GLOBAL_WHEEL_THRESHOLD = 420;
export const MINIMALIST_FOOTER_NAVIGATION_DELAY_MS = 0;
// The scale/font-size option is intentionally disabled in the Minimalist layout.
// Keep the original shared list commented so the functionality can be restored without
// losing the previous implementation. The shared list remains active for Gamified.
// export const MINIMALIST_A11Y_OPTION_KEYS = A11Y_OPTION_KEYS;
export const MINIMALIST_A11Y_OPTION_KEYS = A11Y_OPTION_KEYS.filter((key) => key !== 'upscale');

export type MinimalistA11yKey = (typeof MINIMALIST_A11Y_OPTION_KEYS)[number];
export type MinimalistA11yOptions = A11yOptions;

export type WheelSelection = { accumulator: number; direction: -1 | 0 | 1 };

export function consumeA11yWheel(
  accumulator: number,
  deltaY: number,
  threshold = MINIMALIST_A11Y_WHEEL_THRESHOLD,
): WheelSelection {
  const direction: -1 | 1 = deltaY > 0 ? 1 : -1;
  const sameDirection = accumulator === 0 || Math.sign(accumulator) === direction;
  const nextAccumulator = sameDirection ? accumulator + deltaY : deltaY;
  if (Math.abs(nextAccumulator) < threshold) {
    return { accumulator: nextAccumulator, direction: 0 };
  }
  return { accumulator: 0, direction };
}

export function nextCircularIndex(index: number, delta: number, itemCount: number): number {
  if (itemCount <= 0) return 0;
  return (((index + delta) % itemCount) + itemCount) % itemCount;
}

export function useMinimalistA11y(): {
  options: MinimalistA11yOptions;
  toggle: (key: MinimalistA11yKey) => void;
} {
  const [options, setOptions] = useState<MinimalistA11yOptions>(() => {
    const stored = readOptions();
    // return getUpscaleGuard() ? { ...stored, upscale: false } : stored;
    return stored;
  });

  syncMotionPreference(options);

  useEffect(() => applyDocumentClasses({ ...options, upscale: false }), [options]);
  useEffect(() => persistOptions(options), [options]);
  // The Minimalist upscale viewport guard is kept for reference while the option is disabled.
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia('(max-width: 399px)');
  //   const applyGuard = () => {
  //     if (mediaQuery.matches) setOptions((current) => (current.upscale ? { ...current, upscale: false } : current));
  //   };
  //   applyGuard();
  //   mediaQuery.addEventListener('change', applyGuard);
  //   return () => mediaQuery.removeEventListener('change', applyGuard);
  // }, []);

  const toggle = useCallback((key: MinimalistA11yKey) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  return { options, toggle };
}
