import { cva, type VariantProps } from 'class-variance-authority';
import type { FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react';

import type { MinimalistAppearance, MinimalistInteractionState } from '../types';

export const switchBtnVariants = cva('minimalist-switch-btn', {
  variants: {
    appearance: { light: 'minimalist-switch-btn--light', dark: 'minimalist-switch-btn--dark' },
    current: { true: 'minimalist-switch-btn--current', false: 'minimalist-switch-btn--idle' },
    state: { regular: '', hover: 'minimalist-switch-btn--hover', focus: 'minimalist-switch-btn--focus' },
  },
  defaultVariants: { appearance: 'light', current: false, state: 'regular' },
});

export type SwitchBtnVariantProps = VariantProps<typeof switchBtnVariants>;

type MinimalistSwitchBtnProps = {
  appearance: MinimalistAppearance;
  current: boolean;
  disabled?: boolean;
  label: string;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  state?: MinimalistInteractionState;
  tabIndex?: number;
};

export function MinimalistSwitchBtn({
  appearance,
  current,
  disabled = false,
  label,
  onFocus,
  onKeyDown,
  onClick,
  state = 'regular',
  tabIndex,
}: MinimalistSwitchBtnProps) {
  return (
    <button
      type="button"
      className={switchBtnVariants({ appearance, current, state })}
      aria-pressed={current}
      disabled={disabled}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {label}
    </button>
  );
}
