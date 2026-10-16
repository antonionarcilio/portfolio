import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type FocusEventHandler, type KeyboardEventHandler, type MouseEventHandler } from 'react';

import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance, MinimalistInteractionState } from '../types';

export const switchBtnVariants = cva(
  'minimalist-switch-btn border-0 bg-transparent p-0 font-minimalist text-minimalist-md uppercase disabled:cursor-not-allowed disabled:!opacity-100',
  {
    variants: {
      appearance: { light: '', dark: '' },
      current: { true: 'cursor-default', false: 'cursor-pointer' },
      // No live caller ever passes a non-default `state` — kept for API shape.
      state: { regular: '', hover: '', focus: '' },
    },
    compoundVariants: [
      // Exactly one `text-*` (and cursor is already split above) per (current, appearance) pair —
      // never two conflicting plain utilities, since equal-specificity utilities don't reliably
      // cascade by className string order.
      {
        current: true,
        appearance: 'light',
        class: 'text-minimalist-alpha-black-100 underline underline-offset-4',
      },
      {
        current: true,
        appearance: 'dark',
        class: 'text-minimalist-alpha-white-100 underline underline-offset-[3px]',
      },
      {
        current: false,
        appearance: 'light',
        class:
          'text-minimalist-alpha-black-40 hover:text-minimalist-alpha-black-80 focus-visible:text-minimalist-alpha-black-80',
      },
      {
        current: false,
        appearance: 'dark',
        class:
          'text-minimalist-alpha-white-50 hover:text-minimalist-alpha-white-80 focus-visible:text-minimalist-alpha-white-80',
      },
    ],
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
