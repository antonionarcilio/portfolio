'use client';

import { createContext, useContext, type ReactNode } from 'react';

const MinimalistReducedMotionContext = createContext<boolean>(false);

type MinimalistReducedMotionProviderProps = {
  enabled: boolean;
  children: ReactNode;
};

export function MinimalistReducedMotionProvider({ enabled, children }: MinimalistReducedMotionProviderProps) {
  return <MinimalistReducedMotionContext.Provider value={enabled}>{children}</MinimalistReducedMotionContext.Provider>;
}

// Fail-safe: returns `false` (animations enabled) outside a provider instead of throwing.
// AnimatedIcon is meant to be reused broadly (anchors, hub, later Button); a throwing hook
// would turn every new mount site into a landmine.
export function useMinimalistReducedMotion(): boolean {
  return useContext(MinimalistReducedMotionContext);
}
