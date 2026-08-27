import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

import { IconInteractionProvider, useIconInteractionHandlers } from '../contexts/icon-interaction-context';
import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';
import { AnimatedIcon } from './animated-icon';

export const anchorVariants = cva('minimalist-anchor text-minimalist-sm', {
  variants: {
    appearance: { light: 'minimalist-anchor--light', dark: 'minimalist-anchor--dark' },
    variant: {
      primary: 'minimalist-anchor--primary font-minimalist-regular',
      secondary: 'minimalist-anchor--secondary font-minimalist-bold',
      tertiary: 'minimalist-anchor--tertiary font-minimalist-medium',
    },
    uppercase: { true: 'uppercase', false: '' },
  },
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
          <AnimatedIcon icon={ArrowUpRight} className="minimalist-anchor__icon" />
        </IconInteractionProvider>
      )}
    </a>
  );
}
