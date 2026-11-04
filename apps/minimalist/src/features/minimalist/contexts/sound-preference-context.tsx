'use client';

import { createContext, useContext, type ReactNode } from 'react';

const MinimalistSoundPreferenceContext = createContext<boolean | null>(null);

type MinimalistSoundPreferenceProviderProps = {
  enabled: boolean;
  children: ReactNode;
};

export function MinimalistSoundPreferenceProvider({ enabled, children }: MinimalistSoundPreferenceProviderProps) {
  return (
    <MinimalistSoundPreferenceContext.Provider value={enabled}>{children}</MinimalistSoundPreferenceContext.Provider>
  );
}

export function useMinimalistSoundPreference(): boolean {
  const enabled = useContext(MinimalistSoundPreferenceContext);
  if (enabled === null) {
    throw new Error('useMinimalistSoundPreference must be used inside <MinimalistSoundPreferenceProvider>');
  }
  return enabled;
}
