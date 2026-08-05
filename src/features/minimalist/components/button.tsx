import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

import type { MinimalistAppearance } from '../types';

const buttonVariants = cva('minimalist-button', {
  variants: {
    appearance: {
      light: 'minimalist-button--light',
      dark: 'minimalist-button--dark',
    },
  },
  defaultVariants: { appearance: 'light' },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  appearance: MinimalistAppearance;
  label: string;
};

export function Button({ appearance, label, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button {...props} type={type} className={clsx(buttonVariants({ appearance }), className)}>
      <span className="minimalist-button__bracket" aria-hidden="true">
        [
      </span>
      <span className="minimalist-button__label">{label}</span>
      <span className="minimalist-button__bracket" aria-hidden="true">
        ]
      </span>
    </button>
  );
}
