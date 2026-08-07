import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { useMinimalistSoundPreference } from '../contexts/sound-preference-context';
import { useMinimalistSoundEffects } from '../sound-controller';
import type { MinimalistAppearance } from '../types';

export const anchorVariants = cva('minimalist-anchor', {
  variants: {
    appearance: { light: 'minimalist-anchor--light', dark: 'minimalist-anchor--dark' },
    variant: {
      primary: 'minimalist-anchor--primary',
      secondary: 'minimalist-anchor--secondary',
      tertiary: 'minimalist-anchor--tertiary',
    },
    uppercase: { true: 'minimalist-anchor--uppercase', false: '' },
  },
  defaultVariants: { appearance: 'light', variant: 'primary', uppercase: true },
});

export type AnchorVariantProps = VariantProps<typeof anchorVariants>;

const anchorIconVariants = {
  initial: { rotate: 0 },
  active: {
    rotate: 45,
    transition: { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] as const },
  },
};

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

  return (
    <motion.a
      className={clsx('inline-flex items-center gap-1', anchorVariants({ appearance, variant, uppercase }))}
      href={disabled ? undefined : href}
      target={disabled ? undefined : '_blank'}
      rel={disabled ? undefined : 'noopener noreferrer'}
      aria-disabled={disabled ? true : undefined}
      tabIndex={disabled ? -1 : undefined}
      initial="initial"
      whileHover="active"
      whileFocus="active"
      onClick={() => {
        if (!disabled) playClickSound();
      }}
    >
      {children}
      {trailingIcon && (
        <motion.span
          className="minimalist-anchor__icon inline-flex items-center"
          aria-hidden="true"
          variants={anchorIconVariants}
        >
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </motion.span>
      )}
    </motion.a>
  );
}
