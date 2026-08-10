import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type FocusEventHandler, type KeyboardEventHandler, type MouseEventHandler } from 'react';

import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance, MinimalistInteractionState } from '../types';

export const switchBtnVariants = cva(
  'minimalist-switch-btn border-0 bg-transparent p-0 font-minimalist text-minimalist-md uppercase cursor-pointer disabled:cursor-not-allowed',
  {
    variants: {
      appearance: { light: 'minimalist-switch-btn--light', dark: 'minimalist-switch-btn--dark' },
      current: { true: 'minimalist-switch-btn--current', false: 'minimalist-switch-btn--idle' },
      state: { regular: '', hover: 'minimalist-switch-btn--hover', focus: 'minimalist-switch-btn--focus' },
    },
    defaultVariants: { appearance: 'light', current: false, state: 'regular' },
  },
);

export type SwitchBtnVariantProps = VariantProps<typeof switchBtnVariants>;

type MinimalistSwitchBtnProps = {
  appearance: MinimalistAppearance;
  current: boolean;
  disabled?: boolean;
  label: string;
  ariaLabel?: string;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Set to false when the caller already plays its own sound for this click (e.g. section-change navigation). */
  playClickSound?: boolean;
  state?: MinimalistInteractionState;
  tabIndex?: number;
};

export const MinimalistSwitchBtn = forwardRef<HTMLButtonElement, MinimalistSwitchBtnProps>(function MinimalistSwitchBtn(
  {
    appearance,
    current,
    disabled = false,
    label,
    ariaLabel,
    onFocus,
    onKeyDown,
    onClick,
    playClickSound: shouldPlayClickSound = true,
    state = 'regular',
    tabIndex,
  },
  ref,
) {
  const soundEnabled = useMinimalistSoundPreference();
  const { play: playClickSound } = useMinimalistSoundEffects('clearMouseClicks', soundEnabled && shouldPlayClickSound);
  return (
    <button
      ref={ref}
      type="button"
      className={switchBtnVariants({ appearance, current, state })}
      aria-pressed={current}
      aria-label={ariaLabel}
      disabled={disabled}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onClick={
        current
          ? undefined
          : (event) => {
              playClickSound();
              onClick?.(event);
            }
      }
      tabIndex={tabIndex}
    >
      {label}
    </button>
  );
});
