import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { MINIMALIST_EASE } from '../animations';
import { useIconInteraction } from '../contexts/icon-interaction-context';
import { useMinimalistReducedMotion } from '../contexts/reduced-motion-context';

// The animation is fixed and internal — callers control only *when* (via IconInteractionProvider),
// never *what*. Moved here from the former `anchorIconVariants` export in anchor.tsx.
const iconAnimationVariants = {
  initial: { rotate: 0 },
  active: { rotate: 45, transition: { duration: 0.2, ease: MINIMALIST_EASE } },
};

type AnimatedIconProps = {
  icon: LucideIcon;
  className?: string;
};

/**
 * Lucide icon that rotates 45° while its parent container is hovered/focused.
 *
 * @example
 * <a {...handlers}>
 *   <IconInteractionProvider value={state}>
 *     Ver projeto
 *     <AnimatedIcon icon={ArrowUpRight} className="minimalist-anchor__icon" />
 *   </IconInteractionProvider>
 * </a>
 */
export function AnimatedIcon({ icon: Icon, className }: AnimatedIconProps) {
  const interaction = useIconInteraction();
  const reduceMotion = useMinimalistReducedMotion();
  const isActive = interaction === 'active' && !reduceMotion;

  return (
    <motion.span
      className={`inline-flex items-center${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      variants={iconAnimationVariants}
      initial="initial"
      animate={isActive ? 'active' : 'initial'}
    >
      <Icon size={14} strokeWidth={1.5} />
    </motion.span>
  );
}
