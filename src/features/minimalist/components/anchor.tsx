import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

import { IconInteractionProvider, useIconInteractionHandlers } from '../contexts/icon-interaction-context';
import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { AnimatedIcon } from './animated-icon';

export const anchorVariants = cva('minimalist-anchor text-minimalist-sm aria-disabled:pointer-events-none', {
  variants: {
    appearance: {
      light: 'aria-disabled:text-minimalist-alpha-black-30',
      dark: 'aria-disabled:text-minimalist-alpha-white-30',
    },
    variant: {
      primary: 'text-minimalist-foreground font-minimalist-regular',
      secondary: 'text-minimalist-foreground font-minimalist-semibold',
      tertiary: 'text-minimalist-muted font-minimalist-medium',
    },
    uppercase: { true: 'uppercase', false: '' },
  },
  compoundVariants: [
    {
      appearance: 'light',
      variant: ['primary', 'secondary'],
      class: 'hover:text-minimalist-alpha-black-70 focus-visible:text-minimalist-alpha-black-70',
    },
    {
      appearance: 'dark',
      variant: ['primary', 'secondary'],
      class: 'hover:text-minimalist-alpha-white-70 focus-visible:text-minimalist-alpha-white-70',
    },
    {
      appearance: 'light',
      variant: 'tertiary',
      class: 'hover:text-minimalist-alpha-black-50 focus-visible:text-minimalist-alpha-black-50',
    },
    {
      appearance: 'dark',
      variant: 'tertiary',
      class: 'hover:text-minimalist-alpha-white-50 focus-visible:text-minimalist-alpha-white-50',
    },
  ],
  defaultVariants: { appearance: 'light', variant: 'primary', uppercase: true },
});

export type AnchorVariantProps = VariantProps<typeof anchorVariants>;

type MinimalistAnchorProps = {
  appearance: MinimalistAppearance;
  children: string;
  disabled?: boolean;
  href: string;
  trailingIcon?: boolean;
  uppercase?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
};

export function MinimalistAnchor({
  appearance,
  children,
  disabled = false,
  href,
  trailingIcon = true,
  uppercase = true,
  variant = 'primary',
}: MinimalistAnchorProps) {
  const soundEnabled = useMinimalistSoundPreference();
  const { play: playClickSound } = useMinimalistSoundEffects('fastDoubleClickOnMouse', soundEnabled);
  const { state, handlers } = useIconInteractionHandlers({ disabled });

  return (
    <a
      className={clsx('inline-flex items-center gap-1', anchorVariants({ appearance, variant, uppercase }))}
      href={disabled ? undefined : href}
      target={disabled ? undefined : '_blank'}
      rel={disabled ? undefined : 'noopener noreferrer'}
      aria-disabled={disabled ? true : undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={() => {
        if (!disabled) playClickSound();
      }}
      {...handlers}
    >
      {children}
      {trailingIcon && (
        <IconInteractionProvider value={state}>
          <AnimatedIcon icon="arrow-up-right" className="minimalist-anchor__icon" />
        </IconInteractionProvider>
      )}
    </a>
  );
}
