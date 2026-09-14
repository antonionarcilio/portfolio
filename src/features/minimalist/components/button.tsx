import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { motion, useAnimate } from 'framer-motion';
import { forwardRef, useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { IconInteractionProvider, useIconInteractionHandlers } from '../contexts/icon-interaction-context';
import type { MinimalistAppearance, MinimalistButtonVariant } from '../types';

const buttonVariants = cva(
  // `disabled:!opacity-100` exempts this component from the theme-wide opacity dim
  // (`.minimalist-theme button:disabled` in styles.css) — the button already conveys the
  // disabled state via its dimmed text color (alpha-30), so that generic dim would double-dim it.
  // `!` (important) is used instead of extra specificity because the global rule is a bare
  // `button:disabled` type selector on `.minimalist-theme` — a plain utility class loses to it.
  'group minimalist-button inline-flex items-center gap-1 border-0 bg-transparent p-0 font-minimalist font-minimalist-regular leading-none uppercase cursor-pointer outline-none disabled:cursor-not-allowed disabled:!opacity-100',
  {
    variants: {
      appearance: {
        light: '',
        dark: '',
      },
      variant: {
        primary: '',
        secondary: '',
        tertiary: '',
      },
      size: {
        sm: 'text-minimalist-sm',
        md: 'text-minimalist-md',
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
    defaultVariants: { appearance: 'light', variant: 'primary', size: 'sm' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onAnimationEnd' | 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
> & {
  appearance: MinimalistAppearance;
  variant?: MinimalistButtonVariant;
  size?: 'sm' | 'md';
  label: string;
  icon?: ReactNode;
  iconPosition?: 'leading' | 'trailing';
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

const WAVE_ANIMATE = { x: [0, -WAVE_PERIOD] };
const WAVE_TRANSITION = { duration: WAVE_DURATION_SECONDS, repeat: Infinity, ease: 'linear' as const };

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

// Driven imperatively (not via the declarative `animate` prop): this component is always mounted
// inside an ancestor `<AnimatePresence initial={false}>` (see section.tsx), which makes Framer
// Motion treat a nested motion component's first commit as "already at rest" and skip straight to
// the target value instead of starting the tween — the same quirk the `opacity-0` fallback below
// on the bracket spans guards against. useAnimate's imperative call runs outside that
// reconciliation path, so the repeat: Infinity loop actually starts.
function WaveUnderline() {
  const [scope, animate] = useAnimate<SVGSVGElement>();

  useEffect(() => {
    if (scope.current) animate(scope.current, WAVE_ANIMATE, WAVE_TRANSITION);
  }, [animate, scope]);

  return (
    <motion.svg
      ref={scope}
      width={WAVE_SVG_WIDTH}
      height={WAVE_HEIGHT}
      viewBox={`0 0 ${WAVE_SVG_WIDTH} ${WAVE_HEIGHT}`}
      fill="none"
    >
      <path d={WAVE_PATH_D} stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
    </motion.svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    appearance,
    variant = 'primary',
    size = 'sm',
    label,
    icon,
    iconPosition = 'trailing',
    className,
    type = 'button',
    disabled,
    ...props
  },
  ref,
) {
  const { state: iconInteractionState, handlers: iconInteractionHandlers } = useIconInteractionHandlers({
    disabled: disabled ?? false,
  });
  const iconElement = icon ? (
    <IconInteractionProvider value={iconInteractionState}>
      <span className="minimalist-button__icon inline-flex items-center group-hover:opacity-70 group-focus-visible:opacity-70 group-disabled:opacity-30">
        {icon}
      </span>
    </IconInteractionProvider>
  ) : null;
  return (
    <motion.button
      {...props}
      {...iconInteractionHandlers}
      ref={ref}
      type={type}
      disabled={disabled}
      className={clsx(buttonVariants({ appearance, variant, size }), className)}
      initial="initial"
      animate="initial"
      whileHover={disabled ? undefined : 'active'}
      whileFocus={disabled ? undefined : 'active'}
    >
      {iconPosition === 'leading' && iconElement}
      {variant === 'primary' && (
        <motion.span className="text-minimalist-md opacity-0" aria-hidden="true" variants={hoverRevealVariants}>
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
            <WaveUnderline />
          </motion.span>
        </span>
      ) : (
        <span className="minimalist-button__label">{label}</span>
      )}
      {variant === 'primary' && (
        <motion.span className="text-minimalist-md opacity-0" aria-hidden="true" variants={hoverRevealVariants}>
          ]
        </motion.span>
      )}
      {iconPosition !== 'leading' && iconElement}
    </motion.button>
  );
});
