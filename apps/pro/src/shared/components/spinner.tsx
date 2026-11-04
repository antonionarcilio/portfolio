'use client';

import { motion } from 'framer-motion';

import { SPINNER_TRANSITION } from '@/shared/animations';

type SpinnerProps = {
  sizePixels?: number;
};

/**
 * Indicador de carregamento: arco de 270° que gira. Decorativo (`aria-hidden`) — o estado é dito pelo
 * texto ao lado. Com "pausar animações" ativo o Framer Motion não anima e ele fica estático.
 * @example <Spinner sizePixels={16} />
 */
export function Spinner({ sizePixels = 16 }: SpinnerProps) {
  return (
    <motion.svg
      aria-hidden
      width={sizePixels}
      height={sizePixels}
      viewBox="0 0 16 16"
      fill="none"
      animate={{ rotate: 360 }}
      transition={SPINNER_TRANSITION}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}
