'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  applyDocumentClasses,
  DEFAULT_A11Y_FEATURES,
  persistFeatures,
  readFeatures,
  resolveDefaultFeatures,
  syncMotionPreference,
  type A11yFeatureKey,
  type A11yFeatures,
} from '@/shared/a11y/store';
import { suppressScrollDirectionForLayoutChange } from '@/shared/utils/scroll-direction-suppression';

type A11yContextValue = {
  features: A11yFeatures;
  toggleFeature: (key: A11yFeatureKey) => void;
  resetFeatures: () => void;
};

const A11yContext = createContext<A11yContextValue | null>(null);

/**
 * Guarda as opções de acessibilidade, salva no localStorage e reflete no <html> (classes) e no
 * Framer Motion (pausa global). Começa com o padrão e lê o salvo após a hidratação, para o
 * HTML do servidor e o primeiro render do cliente coincidirem; o `A11Y_SCRIPT` já aplicou as classes.
 * @example <A11yProvider>{children}</A11yProvider>
 */
export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<A11yFeatures>(DEFAULT_A11Y_FEATURES);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setFeatures(readFeatures());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    suppressScrollDirectionForLayoutChange();
    applyDocumentClasses(features);
    syncMotionPreference(features);
    persistFeatures(features);
  }, [features, isHydrated]);

  const toggleFeature = useCallback((key: A11yFeatureKey) => {
    setFeatures((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  const resetFeatures = useCallback(() => setFeatures(resolveDefaultFeatures()), []);

  return <A11yContext.Provider value={{ features, toggleFeature, resetFeatures }}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yContextValue {
  const context = useContext(A11yContext);
  if (!context) throw new Error('useA11y must be used inside <A11yProvider>; received no provider above the caller');
  return context;
}
