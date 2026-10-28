import { MotionGlobalConfig } from 'framer-motion';

/** Chave própria do pro: os outros apps guardam outras opções sob `a11y-opts`. */
export const A11Y_STORAGE_KEY = 'pro-a11y-opts';

export const A11Y_FEATURE_KEYS = ['bigCursor', 'highlightLinks', 'biggerText', 'pauseAnimations'] as const;

export type A11yFeatureKey = (typeof A11Y_FEATURE_KEYS)[number];
export type A11yFeatures = Record<A11yFeatureKey, boolean>;

export const DEFAULT_A11Y_FEATURES: A11yFeatures = {
  bigCursor: false,
  highlightLinks: false,
  biggerText: false,
  pauseAnimations: false,
};

/** Classe no <html> que liga cada opção; o CSS correspondente vive em `shared/styles/a11y.css`. */
export const A11Y_CLASS_BY_KEY: Record<A11yFeatureKey, string> = {
  bigCursor: 'a11y-cursor-large',
  highlightLinks: 'a11y-highlight-links',
  biggerText: 'a11y-bigger-text',
  pauseAnimations: 'a11y-pause-animations',
};

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readStoredFeatures(): Partial<A11yFeatures> | null {
  try {
    const stored = window.localStorage.getItem(A11Y_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Partial<A11yFeatures>) : null;
  } catch {
    return null;
  }
}

/**
 * Opções salvas, ou o padrão. Sem nada salvo, "pausar animações" começa ligado se o sistema
 * pede movimento reduzido. Só no cliente (usa `window`).
 * @example const features = readFeatures(); // { bigCursor: false, ... }
 */
export function readFeatures(): A11yFeatures {
  const stored = readStoredFeatures();
  const features = { ...DEFAULT_A11Y_FEATURES };
  A11Y_FEATURE_KEYS.forEach((key) => {
    features[key] = stored?.[key] === true;
  });
  if (stored?.pauseAnimations === undefined) features.pauseAnimations = prefersReducedMotion();
  return features;
}

export function persistFeatures(features: A11yFeatures): void {
  try {
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(features));
  } catch {
    // Sem storage (modo privado, bloqueio): a preferência vale só na sessão atual.
  }
}

/** `skipAnimations` pausa todo `motion.*` e `animate()` de uma vez; o CSS é coberto pela classe do <html>. */
export function syncMotionPreference(features: Pick<A11yFeatures, 'pauseAnimations'>): void {
  MotionGlobalConfig.skipAnimations = features.pauseAnimations;
}

export function applyDocumentClasses(features: A11yFeatures): void {
  const root = document.documentElement;
  A11Y_FEATURE_KEYS.forEach((key) => root.classList.toggle(A11Y_CLASS_BY_KEY[key], features[key]));
}
