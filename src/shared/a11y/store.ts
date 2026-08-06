import { MotionGlobalConfig } from 'framer-motion';

export const A11Y_STORAGE_KEY = 'a11y-opts';
export const A11Y_UPSCALE_MAX_WIDTH_PX = 399;

export const A11Y_OPTION_KEYS = [
  'upscale',
  'greyscale',
  'cursorLarge',
  'highlightLinks',
  'reduceMotion',
  'soundEffects',
] as const;

export type A11yKey = (typeof A11Y_OPTION_KEYS)[number];
export type A11yOptions = Record<A11yKey, boolean>;
export type StoredA11yOptions = Partial<A11yOptions> & Record<string, unknown>;

export const DEFAULT_A11Y_OPTIONS: A11yOptions = {
  upscale: false,
  greyscale: false,
  cursorLarge: false,
  highlightLinks: false,
  reduceMotion: false,
  soundEffects: true,
};

export const CLASS_MAP: Record<A11yKey, string> = {
  upscale: 'a11y-upscale',
  greyscale: 'a11y-greyscale',
  cursorLarge: 'a11y-cursor-large',
  highlightLinks: 'a11y-highlight-links',
  reduceMotion: 'a11y-reduce-motion',
  // This class is a shared JS/e2e state marker; it intentionally has no visual rule.
  soundEffects: 'a11y-sound-effects',
};

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readStoredObject(): StoredA11yOptions {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(A11Y_STORAGE_KEY);
    if (!stored) return {};
    const parsed: unknown = JSON.parse(stored);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as StoredA11yOptions) : {};
  } catch {
    return {};
  }
}

export function readOptions(): A11yOptions {
  const stored = readStoredObject();
  return {
    ...DEFAULT_A11Y_OPTIONS,
    reduceMotion: stored.reduceMotion === undefined ? prefersReducedMotion() : stored.reduceMotion === true,
    ...stored,
  } as A11yOptions;
}

export function persistOptions(options: A11yOptions): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify({ ...readStoredObject(), ...options }));
  } catch {
    // Preferences remain usable for the current session when storage is unavailable.
  }
}

export function getUpscaleGuard(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(`(max-width: ${A11Y_UPSCALE_MAX_WIDTH_PX}px)`).matches;
}

export function syncMotionPreference(options: Pick<A11yOptions, 'reduceMotion'>): void {
  MotionGlobalConfig.skipAnimations = options.reduceMotion;
}

export function applyDocumentClasses(options: A11yOptions): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  A11Y_OPTION_KEYS.forEach((key) => root.classList.toggle(CLASS_MAP[key], options[key]));
}

if (typeof window !== 'undefined') {
  syncMotionPreference(readOptions());
}
