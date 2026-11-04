'use client';

import type { KeyboardEventHandler } from 'react';

type ActivationProps = {
  role?: 'button';
  tabIndex?: number;
  onKeyDown?: KeyboardEventHandler;
};

/** Turns a click handler into a keyboard-activatable (Enter/Space) button. */
export function useActivationProps(onClick?: () => void): ActivationProps {
  if (!onClick) return {};

  return {
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  };
}
