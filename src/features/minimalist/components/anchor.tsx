import { cva, type VariantProps } from 'class-variance-authority';

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
  return (
    <a
      className={anchorVariants({ appearance, variant, uppercase })}
      href={disabled ? undefined : href}
      aria-disabled={disabled ? true : undefined}
      tabIndex={disabled ? -1 : undefined}
    >
      {children}
      {trailingIcon && <span aria-hidden="true">↗</span>}
    </a>
  );
}
