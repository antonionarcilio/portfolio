'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  DEFAULT_A11Y_OPTIONS,
  applyDocumentClasses,
  getUpscaleGuard,
  persistOptions,
  readOptions,
  syncMotionPreference,
  type A11yKey,
  type A11yOptions,
} from '@/shared/a11y/store';

export type { A11yKey } from '@/shared/a11y/store';
export type A11yOpts = A11yOptions;

type A11yContextValue = {
  opts: A11yOpts;
  toggle: (key: A11yKey) => void;
  reset: () => void;
};

const A11yContext = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<A11yOpts>(() => {
    const stored = readOptions();
    return getUpscaleGuard() ? { ...stored, upscale: false } : stored;
  });

  syncMotionPreference(opts);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 399px)');
    const applyGuard = () => {
      if (mediaQuery.matches) setOpts((current) => (current.upscale ? { ...current, upscale: false } : current));
    };
    applyGuard();
    mediaQuery.addEventListener('change', applyGuard);
    return () => mediaQuery.removeEventListener('change', applyGuard);
  }, []);

  useEffect(() => persistOptions(opts), [opts]);
  useEffect(() => applyDocumentClasses(opts), [opts]);

  const toggle = useCallback((key: A11yKey) => {
    setOpts((current) => (key === 'upscale' && getUpscaleGuard() ? current : { ...current, [key]: !current[key] }));
  }, []);

  const reset = useCallback(() => {
    setOpts((current) => ({ ...DEFAULT_A11Y_OPTIONS, soundEffects: current.soundEffects }));
  }, []);

  return <A11yContext.Provider value={{ opts, toggle, reset }}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yContextValue {
  const context = useContext(A11yContext);
  if (!context) throw new Error('useA11y must be used inside <A11yProvider>');
  return context;
}
