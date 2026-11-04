'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type IconInteractionState = 'idle' | 'active';

const IconInteractionContext = createContext<IconInteractionState>('idle');

type IconInteractionProviderProps = {
  value: IconInteractionState;
  children: ReactNode;
};

export function IconInteractionProvider({ value, children }: IconInteractionProviderProps) {
  return <IconInteractionContext.Provider value={value}>{children}</IconInteractionContext.Provider>;
}

// Default `'idle'` (no throw): an AnimatedIcon without a provider stays static.
export function useIconInteraction(): IconInteractionState {
  return useContext(IconInteractionContext);
}

type IconInteractionHandlers = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

type UseIconInteractionHandlersResult = {
  state: IconInteractionState;
  handlers: IconInteractionHandlers;
};

/**
 * Bundles the hover/focus state a container feeds to its {@link IconInteractionProvider}.
 * When `disabled`, handlers are no-ops and `state` stays `'idle'`.
 *
 * @example
 * const { state, handlers } = useIconInteractionHandlers({ disabled });
 * return (
 *   <a {...handlers}>
 *     <IconInteractionProvider value={state}>{children}</IconInteractionProvider>
 *   </a>
 * );
 */
export function useIconInteractionHandlers({ disabled }: { disabled: boolean }): UseIconInteractionHandlersResult {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const handlers = useMemo<IconInteractionHandlers>(() => {
    if (disabled) {
      const noop = () => {};
      return { onMouseEnter: noop, onMouseLeave: noop, onFocus: noop, onBlur: noop };
    }
    return {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    };
  }, [disabled]);

  const state: IconInteractionState = !disabled && (hovered || focused) ? 'active' : 'idle';

  return { state, handlers };
}
