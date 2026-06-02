'use client';

import { type Variants, motion } from 'framer-motion';
import { useEffect } from 'react';

import { useA11y } from '@/features/gamer/contexts/a11y-context';

const FLASH_VARIANTS: Variants = {
  idle: {
    opacity: 1,
    textShadow: '0 0 0px rgba(0,0,0,0)',
    transition: { duration: 0 },
  },
  flash: {
    opacity: [1, 0.1, 1, 0.1, 1, 0.1, 1],
    textShadow: [
      '0 0 10px rgba(43,214,255,0.3)',
      '0 0 0px rgba(0,0,0,0)',
      '0 0 28px #2bd6ff, 0 0 56px rgba(43,214,255,0.5)',
      '0 0 0px rgba(0,0,0,0)',
      '0 0 28px #2bd6ff, 0 0 56px rgba(43,214,255,0.5)',
      '0 0 0px rgba(0,0,0,0)',
      '0 0 10px rgba(43,214,255,0.3)',
    ],
    transition: { duration: 1, ease: 'easeInOut' as const, times: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 1.0] },
  },
};

export function FlashHeading({
  flash,
  onFlashEnd,
  children,
}: {
  flash?: boolean;
  onFlashEnd?: () => void;
  children: React.ReactNode;
}) {
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  // When animations are disabled, fire onFlashEnd immediately so callers don't stall
  useEffect(() => {
    if (noMotion && flash) onFlashEnd?.();
  }, [noMotion, flash, onFlashEnd]);

  return (
    <motion.h2
      className="flex items-center gap-[10px] text-cv-cyan text-[13px] tracking-[0.24em] uppercase mt-0 mb-[18px] before:content-['▶'] before:text-cv-orange before:text-[10px]"
      variants={FLASH_VARIANTS}
      initial={false}
      animate={noMotion ? 'idle' : flash ? 'flash' : 'idle'}
      onAnimationComplete={(definition) => {
        if (definition === 'flash') onFlashEnd?.();
      }}
    >
      {children}
    </motion.h2>
  );
}
