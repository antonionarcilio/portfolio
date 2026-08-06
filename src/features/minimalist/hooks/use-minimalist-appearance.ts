import { useLayoutEffect, useState } from 'react';

import type { MinimalistAppearance } from '../types';
import { APPEARANCE_STORAGE_KEY, readStoredPreference, writeStoredPreference } from '../utils/preferences';

function isAppearance(value: string | null): value is MinimalistAppearance {
  return value === 'light' || value === 'dark';
}

function systemAppearance(): MinimalistAppearance {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function storedAppearance(): MinimalistAppearance | null {
  const stored = readStoredPreference(APPEARANCE_STORAGE_KEY);
  return isAppearance(stored) ? stored : null;
}

export function useMinimalistAppearance() {
  const [appearance, setAppearance] = useState<MinimalistAppearance>('light');

  useLayoutEffect(() => {
    setAppearance(storedAppearance() ?? systemAppearance());
  }, []);

  useLayoutEffect(() => {
    if (storedAppearance()) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncFromSystem = () => setAppearance(media.matches ? 'dark' : 'light');
    media.addEventListener('change', syncFromSystem);
    return () => media.removeEventListener('change', syncFromSystem);
  }, []);

  const changeAppearance = (next: MinimalistAppearance) => {
    writeStoredPreference(APPEARANCE_STORAGE_KEY, next);
    setAppearance(next);
  };

  return { appearance, changeAppearance };
}
