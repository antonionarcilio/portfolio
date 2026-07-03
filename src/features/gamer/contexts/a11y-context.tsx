'use client';

import { MotionGlobalConfig } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type A11yKey = 'textLarge' | 'cursorLarge' | 'greyscale' | 'highlightLinks' | 'reduceMotion';
export type A11yOpts = Record<A11yKey, boolean>;

const DEFAULT_OPTS: A11yOpts = {
  textLarge: false,
  cursorLarge: false,
  greyscale: false,
  highlightLinks: false,
  reduceMotion: false,
};

const STORAGE_KEY = 'a11y-opts';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Read reduceMotion synchronously at module load so MotionGlobalConfig.skipAnimations
// is set before any motion component renders — prevents the first-render opacity:0 flash.
if (typeof window !== 'undefined') {
  try {
    const _stored = localStorage.getItem(STORAGE_KEY);
    const _parsed = _stored ? JSON.parse(_stored) : null;
    if (_parsed?.reduceMotion === true || (_parsed?.reduceMotion === undefined && prefersReducedMotion())) {
      MotionGlobalConfig.skipAnimations = true;
    }
  } catch {}
}

// Map each option to the CSS class applied to <html>
const CLASS_MAP: Record<A11yKey, string> = {
  textLarge: 'a11y-text-large',
  cursorLarge: 'a11y-cursor-large',
  greyscale: 'a11y-greyscale',
  highlightLinks: 'a11y-highlight-links',
  reduceMotion: 'a11y-reduce-motion',
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type A11yContextValue = {
  opts: A11yOpts;
  toggle: (key: A11yKey) => void;
  reset: () => void;
};

const A11yContext = createContext<A11yContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<A11yOpts>(() => ({
    ...DEFAULT_OPTS,
    reduceMotion: prefersReducedMotion(),
  }));

  // Sync framer-motion's global flag synchronously during render (not in a useEffect).
  // Effects fire child-before-parent, so a descendant that (re)mounts an infinite/repeat
  // animation in the same render pass (e.g. BlinkingCursor toggling from hidden back to
  // visible) would otherwise read a stale value here and get its animation frozen
  // instantly, with nothing left to ever restart it.
  MotionGlobalConfig.skipAnimations = opts.reduceMotion;

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setOpts({ ...DEFAULT_OPTS, ...JSON.parse(stored) });
    } catch {
      // ignore
    }
  }, []);

  // "Aumento de escala" (textLarge) is unavailable below 400px: the zoom breaks
  // the layout on very narrow viewports. Force it off whenever the viewport is
  // (or becomes) narrower than 400px, even if it was enabled on a wider screen.
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 399px)');
    const apply = () => {
      if (mql.matches) {
        setOpts((prev) => (prev.textLarge ? { ...prev, textLarge: false } : prev));
      }
    };
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  // Persist opts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opts));
    } catch {
      // ignore
    }
  }, [opts]);

  // Apply / remove CSS classes on <html> for each option
  useEffect(() => {
    const html = document.documentElement;
    (Object.keys(CLASS_MAP) as A11yKey[]).forEach((key) => {
      html.classList.toggle(CLASS_MAP[key], opts[key]);
    });
  }, [opts]);

  const toggle = useCallback((key: A11yKey) => {
    setOpts((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    setOpts(DEFAULT_OPTS);
  }, []);

  return <A11yContext.Provider value={{ opts, toggle, reset }}>{children}</A11yContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useA11y(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used inside <A11yProvider>');
  return ctx;
}
