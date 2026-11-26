'use client';

import { useCallback, useSyncExternalStore } from 'react';

/** Espelha `--breakpoint-tablet` (640px) de `tokens.css` — `matchMedia` não lê custom properties. */
export const TABLET_AND_UP_MEDIA_QUERY = '(min-width: 640px)';

/**
 * `true` enquanto a media query casa. No servidor (e no primeiro render da hidratação) é `false`: use só para
 * o que aparece depois de uma interação (ex.: diálogo aberto por clique), nunca para o layout inicial.
 * @example const isTabletUp = useMediaQuery(TABLET_AND_UP_MEDIA_QUERY);
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaList = window.matchMedia(query);
      mediaList.addEventListener('change', onChange);
      return () => mediaList.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
