'use client';

import clsx from 'clsx';
import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/*
 * Shimmer "spotlight" — varredura da faixa de brilho sobre o texto.
 *
 * O estilo estático (gradiente recortado no texto + cor transparente) continua
 * em styles.css (.cv-shimmer-text / .cv-shimmer-status). Aqui mora apenas o
 * MOVIMENTO da faixa, antes feito pelo `@keyframes cv-shimmer-sweep`
 * (2.5s linear infinite, background-position 100%→0%). Migrado para Framer Motion
 * conforme a regra de animações do projeto (AGENTS.md) — assim a varredura é
 * pausada automaticamente pelo toggle global reduceMotion
 * (MotionGlobalConfig.skipAnimations), sem branch manual.
 *
 * Fidelidade: `100% center`/`0% center` do keyframe original equivalem a
 * `100% 50%`/`0% 50%`; duração 2.5s, easing linear e loop infinito preservados.
 */

const SWEEP_POSITIONS = ['100% 50%', '0% 50%'];
const SWEEP_TRANSITION = { duration: 2.5, ease: 'linear', repeat: Infinity } as const;

/*
 * Em rótulos curtos (ex.: "Ver", ~21px), a faixa de brilho (largura fixa ~28px)
 * não sai por completo do texto nos extremos do ciclo, então o reinício-com-salto
 * do loop (background-position 0%→100%) fica visível ("seco"). Como a faixa é fixa
 * em px e o fundo é percentual, o ponto de costura depende da largura — qualquer
 * ajuste global penaliza rótulos longos. O `mirror` (vai-e-volta) reverte a posição
 * suavemente nos extremos em vez de saltar, eliminando a costura em qualquer largura.
 * Mantém a mesma velocidade/sentido na ida; só substitui o salto por uma volta.
 */
const SWEEP_HOVER_TRANSITION = { ...SWEEP_TRANSITION, repeatType: 'mirror' } as const;

// Label de variante propagada pelo botão pai (whileHover / whileFocus).
export const SHIMMER_HOVER_VARIANT = 'shimmer';

const hoverSweepVariants: Variants = {
  [SHIMMER_HOVER_VARIANT]: {
    backgroundPosition: SWEEP_POSITIONS,
    transition: SWEEP_HOVER_TRANSITION,
  },
};

/**
 * Texto de botão cujo brilho varre apenas no hover/focus do botão pai.
 *
 * O pai deve ser um componente `motion.*` com
 * `whileHover={SHIMMER_HOVER_VARIANT}` e `whileFocus={SHIMMER_HOVER_VARIANT}`,
 * para propagar a variante a este elemento (espelha `.cv-shimmer-btn:hover/.:focus-visible`).
 *
 * @example
 * <motion.button whileHover={SHIMMER_HOVER_VARIANT} whileFocus={SHIMMER_HOVER_VARIANT}>
 *   <ShimmerLabel>Expandir</ShimmerLabel>
 * </motion.button>
 */
export function ShimmerLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={clsx('cv-shimmer-text', className)} variants={hoverSweepVariants}>
      {children}
    </motion.div>
  );
}

/**
 * Status contínuo (rodapé): a varredura roda sempre.
 *
 * @example
 * <ShimmerStatus text="Procurando uma guilda" />
 */
export function ShimmerStatus({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={clsx('cv-shimmer-status', className)}
      animate={{ backgroundPosition: SWEEP_POSITIONS }}
      transition={SWEEP_TRANSITION}
    >
      {text}
    </motion.span>
  );
}
