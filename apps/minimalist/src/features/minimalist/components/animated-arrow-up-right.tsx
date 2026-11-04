import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { MINIMALIST_EASE } from '../animations';
import type { AnimatedIconRenderProps } from '../types';

const arrowVariants: Variants = {
  initial: { rotate: 0 },
  active: { rotate: 45, transition: { duration: 0.2, ease: MINIMALIST_EASE } },
};

/** `arrow-up-right` entry of the `ANIMATED_ICONS` registry — rotates 45° while active. */
export function AnimatedArrowUpRight({ isActive, size }: AnimatedIconRenderProps) {
  return (
    <motion.span
      className="inline-flex"
      variants={arrowVariants}
      initial="initial"
      animate={isActive ? 'active' : 'initial'}
    >
      <ArrowUpRight size={size} strokeWidth={1.5} />
    </motion.span>
  );
}
