import { MotionGlobalConfig } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

export const MINIMALIST_A11Y_WHEEL_THRESHOLD = 80;
export const MINIMALIST_A11Y_WHEEL_COOLDOWN_MS = 250;
export const MINIMALIST_A11Y_SOUND_MOBILE_MAX_WIDTH_PX = 512; // matches the 32rem breakpoint already used in styles.css
export const MINIMALIST_GLOBAL_WHEEL_THRESHOLD = 450;
export const MINIMALIST_FOOTER_NAVIGATION_DELAY_MS = 0;
export const MINIMALIST_A11Y_OPTION_KEYS = [
  'upscale',
  'greyscale',
  'cursorLarge',
  'highlightLinks',
  'reduceMotion',
  'soundEffects',
] as const;

export type MinimalistA11yKey = (typeof MINIMALIST_A11Y_OPTION_KEYS)[number];
export type MinimalistA11yOptions = Record<MinimalistA11yKey, boolean>;

const STORAGE_KEY = 'a11y-opts';
const DEFAULT_OPTIONS: MinimalistA11yOptions = {
  upscale: false,
  cursorLarge: false,
  greyscale: false,
  highlightLinks: false,
  reduceMotion: false,
  soundEffects: true,
};

const CLASS_NAMES: Partial<Record<MinimalistA11yKey, string>> = {
  upscale: 'a11y-upscale',
  cursorLarge: 'a11y-cursor-large',
  greyscale: 'a11y-greyscale',
  highlightLinks: 'a11y-highlight-links',
  reduceMotion: 'a11y-reduce-motion',
};

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

function readStoredOptions(): MinimalistA11yOptions {
  if (typeof window === 'undefined') return DEFAULT_OPTIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_OPTIONS, ...JSON.parse(stored) } : DEFAULT_OPTIONS;
  } catch {
    return DEFAULT_OPTIONS;
  }
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Read reduceMotion synchronously at module load so MotionGlobalConfig.skipAnimations is set
// before any motion component renders — prevents the first-render opacity:0 flash. Mirrors
// src/features/gamified/contexts/a11y-context.tsx.
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    if (parsed?.reduceMotion === true || (parsed?.reduceMotion === undefined && prefersReducedMotion())) {
      MotionGlobalConfig.skipAnimations = true;
    }
  } catch {
    // Motion stays enabled for the current session when storage is unavailable.
  }
}

function syncDocumentClasses(options: MinimalistA11yOptions): void {
  const root = document.documentElement;
  MINIMALIST_A11Y_OPTION_KEYS.forEach((key) => {
    const className = CLASS_NAMES[key];
    if (className) root.classList.toggle(className, options[key]);
  });
}

export function useMinimalistA11y(): {
  options: MinimalistA11yOptions;
  toggle: (key: MinimalistA11yKey) => void;
} {
  const [options, setOptions] = useState<MinimalistA11yOptions>(readStoredOptions);

  // Sync framer-motion's global flag synchronously during render (not in a useEffect) — see
  // src/features/gamified/contexts/a11y-context.tsx for why this must not be deferred to an effect.
  MotionGlobalConfig.skipAnimations = options.reduceMotion;

  useEffect(() => syncDocumentClasses(options), [options]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // Preferences remain usable for the current session when storage is unavailable.
    }
  }, [options]);

  const toggle = useCallback((key: MinimalistA11yKey) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  return { options, toggle };
}
