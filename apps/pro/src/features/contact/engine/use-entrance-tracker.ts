'use client';

import { useEffect, useRef } from 'react';

/**
 * Decide quais peças da conversa entram animadas: só as que surgem depois da primeira renderização. O que
 * já estava lá ao montar (conversa restaurada do sessionStorage) aparece parado.
 * @example const isNew = useEntranceTracker(entries.map((entry) => entry.id)); isNew('bot:intro.name')
 */
export function useEntranceTracker(visibleIds: readonly string[]): (id: string) => boolean {
  const seenIdsRef = useRef<Set<string> | null>(null);
  if (seenIdsRef.current === null) seenIdsRef.current = new Set(visibleIds);
  const seenIds = seenIdsRef.current;
  const idsKey = visibleIds.join('|');

  useEffect(() => {
    idsKey.split('|').forEach((id) => seenIds.add(id));
  }, [idsKey, seenIds]);

  return (id: string) => !seenIds.has(id);
}
