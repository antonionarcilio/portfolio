'use client';

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { SHIMMER_HOVER_VARIANT, ShimmerLabel } from './shimmer-text';

type EntranceMotionProps = Pick<HTMLMotionProps<'button'>, 'variants' | 'initial' | 'animate' | 'custom'>;

// Framer Motion redefines these DOM event handlers with animation-specific signatures,
// which conflicts with React's native ButtonHTMLAttributes typings; none of the call
// sites need them, so they're dropped from the prop surface entirely.
type ConflictingDomHandlers = 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd';

// Cor, caixa alta e tracking do label shimmer — idênticos em Ver/Expandir/VER.
// Vive no botão (não no label) porque também precisa alcançar ícones irmãos do
// label (ex.: Maximize2 no mobile), que herdam a cor via currentColor.
const SHIMMER_TEXT_CLS = 'text-[10px] text-cv-cyan tracking-[0.16em] uppercase';

/**
 * "Chip" que Ver/Expandir/VER compartilhavam por inteiro: borda, fundo e blur.
 * Não é aplicado automaticamente pelo CvButton porque o alvo varia: em
 * Stats/Expandir o botão inteiro É o chip (className), enquanto no item de
 * projeto do mapa de habilidades só o badge "VER" deve parecer um chip — o
 * botão-linha (sc-cat-item) tem seu próprio visual (labelClassName).
 */
export const shimmerChip = cva(
  'border border-cv-cyan-dim bg-[rgba(43,214,255,0.06)] backdrop-blur-[18px] whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'px-[7px] py-[2px]',
        md: 'px-[9px] py-[3px] cv-shimmer-chip--md',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type CvButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingDomHandlers> &
  EntranceMotionProps & {
    /** 'shimmer' habilita `cv-shimmer-btn`, envolve o label em <ShimmerLabel> e
     *  aplica a cor/caixa alta/tracking padrão. 'static' (padrão) é um botão
     *  comum, sem esse efeito — usado por ex. em a11y e "voltar". */
    variant?: 'static' | 'shimmer';
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    labelClassName?: string;
  };

/**
 * Botão base do layout gamified: cursor customizado + slots de ícone esquerdo/direito
 * sempre presentes; a variante controla se o label ganha cor/shimmer padrão.
 */
export const CvButton = forwardRef<HTMLButtonElement, CvButtonProps>(function CvButton(
  {
    variant = 'static',
    className,
    labelClassName,
    leftIcon,
    rightIcon,
    children,
    type = 'button',
    variants,
    initial,
    animate,
    custom,
    ...rest
  },
  ref,
) {
  const baseClassName = clsx(
    'inline-flex items-center gap-2 cursor-gamified-pointer',
    variant === 'shimmer' && SHIMMER_TEXT_CLS,
    className,
  );

  if (variant === 'shimmer') {
    return (
      <motion.button
        ref={ref}
        type={type}
        variants={variants}
        initial={initial}
        animate={animate}
        custom={custom}
        whileHover={SHIMMER_HOVER_VARIANT}
        whileFocus={SHIMMER_HOVER_VARIANT}
        className={clsx('cv-shimmer-btn', baseClassName)}
        {...rest}
      >
        {leftIcon}
        <ShimmerLabel className={labelClassName}>{children}</ShimmerLabel>
        {rightIcon}
      </motion.button>
    );
  }

  return (
    <button ref={ref} type={type} className={baseClassName} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
