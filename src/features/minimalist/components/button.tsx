import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { motion } from 'framer-motion';
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

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onAnimationEnd' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
> & {
  appearance: MinimalistAppearance;
  label: string;
};

const bracketVariants = {
  initial: { opacity: 0 },
  active: { opacity: 1, transition: { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] as const } },
};

export function Button({ appearance, label, className, type = 'button', ...props }: ButtonProps) {
  return (
    <motion.button
      {...props}
      type={type}
      className={clsx(buttonVariants({ appearance }), className)}
      initial="initial"
      whileHover="active"
      whileFocus="active"
    >
      <motion.span className="minimalist-button__bracket" aria-hidden="true" variants={bracketVariants}>
        [
      </motion.span>
      <span className="minimalist-button__label">{label}</span>
      <motion.span className="minimalist-button__bracket" aria-hidden="true" variants={bracketVariants}>
        ]
      </motion.span>
    </motion.button>
  );
}
