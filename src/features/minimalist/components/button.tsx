import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import type { MinimalistAppearance, MinimalistButtonVariant } from '../types';

const buttonVariants = cva(
  'minimalist-button inline-flex items-center border-0 bg-transparent p-0 font-minimalist text-minimalist-sm font-minimalist-regular leading-none uppercase cursor-pointer outline-none disabled:cursor-not-allowed',
  {
    variants: {
      appearance: {
        light: '',
        dark: '',
      },
      variant: {
        primary: '',
        secondary: '',
      },
    },
    compoundVariants: [
      {
        appearance: 'light',
        class:
          'text-minimalist-alpha-black-100 hover:text-minimalist-alpha-black-70 focus-visible:text-minimalist-alpha-black-70 disabled:text-minimalist-alpha-black-30 disabled:hover:text-minimalist-alpha-black-30 disabled:focus-visible:text-minimalist-alpha-black-30',
      },
      {
        appearance: 'dark',
        class:
          'text-minimalist-alpha-white-100 hover:text-minimalist-alpha-white-70 focus-visible:text-minimalist-alpha-white-70 disabled:text-minimalist-alpha-white-30 disabled:hover:text-minimalist-alpha-white-30 disabled:focus-visible:text-minimalist-alpha-white-30',
      },
    ],
    defaultVariants: { appearance: 'light', variant: 'primary' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onAnimationEnd' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
> & {
  appearance: MinimalistAppearance;
  variant?: MinimalistButtonVariant;
  label: string;
};

const hoverRevealVariants = {
  initial: { opacity: 0 },
  active: { opacity: 1, transition: { duration: 0.2, ease: [0.2, 0.7, 0.2, 1] as const } },
};

// Figma's wavy underline has no animatable "crawl" phase natively, so the secondary hover/focus
// state draws its own tiled sine path and slides it by exactly one period (seamless loop) instead.
const WAVE_PERIOD = 14;
const WAVE_HEIGHT = 4;
const WAVE_TILE_REPEATS = 20;
const WAVE_DURATION_SECONDS = 1.8;
const WAVE_SVG_WIDTH = WAVE_PERIOD * WAVE_TILE_REPEATS;

function buildWavePathD(): string {
  const midY = WAVE_HEIGHT / 2;
  const halfPeriod = WAVE_PERIOD / 2;
  let d = `M0,${midY}`;
  for (let x = 0, step = 0; x < WAVE_SVG_WIDTH; x += halfPeriod, step += 1) {
    const controlX = x + halfPeriod / 2;
    const controlY = step % 2 === 0 ? 0 : WAVE_HEIGHT;
    d += ` Q${controlX},${controlY} ${x + halfPeriod},${midY}`;
  }
  return d;
}

const WAVE_PATH_D = buildWavePathD();

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { appearance, variant = 'primary', label, className, type = 'button', disabled, ...props },
  ref,
) {
  return (
    <motion.button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      className={clsx(buttonVariants({ appearance, variant }), className)}
      initial="initial"
      whileHover={disabled ? undefined : 'active'}
      whileFocus={disabled ? undefined : 'active'}
    >
      {variant === 'primary' && (
        <motion.span className="minimalist-button__bracket" aria-hidden="true" variants={hoverRevealVariants}>
          [
        </motion.span>
      )}
      {variant === 'secondary' ? (
        <span className="minimalist-button__label relative inline-block">
          {label}
          <motion.span
            aria-hidden="true"
            className="minimalist-button__wave pointer-events-none absolute inset-x-0 -bottom-1.5 h-1 overflow-hidden"
            variants={hoverRevealVariants}
          >
            <motion.svg
              width={WAVE_SVG_WIDTH}
              height={WAVE_HEIGHT}
              viewBox={`0 0 ${WAVE_SVG_WIDTH} ${WAVE_HEIGHT}`}
              fill="none"
              animate={{ x: [0, -WAVE_PERIOD] }}
              transition={{ duration: WAVE_DURATION_SECONDS, repeat: Infinity, ease: 'linear' }}
            >
              <path d={WAVE_PATH_D} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
            </motion.svg>
          </motion.span>
        </span>
      ) : (
        <span className="minimalist-button__label">{label}</span>
      )}
      {variant === 'primary' && (
        <motion.span className="minimalist-button__bracket" aria-hidden="true" variants={hoverRevealVariants}>
          ]
        </motion.span>
      )}
    </motion.button>
  );
});
