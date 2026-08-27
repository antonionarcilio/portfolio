import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

import { MINIMALIST_EASE } from '../animations';
import { useIconInteraction } from '../contexts/icon-interaction-context';
import { useMinimalistReducedMotion } from '../contexts/reduced-motion-context';

type AnimatedIconEntry = {
  Icon: LucideIcon;
  variants: Variants;
};

// Each icon owns its own animation — the effect is fixed per icon, never chosen by the caller.
// Register a new animated icon by adding an entry here; its key becomes a valid `icon` value.
const ANIMATED_ICONS = {
  'arrow-up-right': {
    Icon: ArrowUpRight,
    variants: {
      initial: { rotate: 0 },
      active: { rotate: 45, transition: { duration: 0.2, ease: MINIMALIST_EASE } },
    },
  },
} satisfies Record<string, AnimatedIconEntry>;

export type AnimatedIconName = keyof typeof ANIMATED_ICONS;

/** Every registered icon key, for iteration (e.g. the dev preview page). */
export const ANIMATED_ICON_NAMES = Object.keys(ANIMATED_ICONS) as AnimatedIconName[];

type AnimatedIconProps = {
  icon: AnimatedIconName;
  className?: string;
};

/**
 * Renders a registered icon that animates while its parent container is hovered/focused.
 * The animation is bound to the icon (see {@link ANIMATED_ICONS}) — `arrow-up-right` rotates 45°.
 *
 * @example
 * <a {...handlers}>
 *   <IconInteractionProvider value={state}>
 *     Ver projeto
 *     <AnimatedIcon icon="arrow-up-right" className="minimalist-anchor__icon" />
 *   </IconInteractionProvider>
 * </a>
 */
export function AnimatedIcon({ icon, className }: AnimatedIconProps) {
  const { Icon, variants } = ANIMATED_ICONS[icon];
  const interaction = useIconInteraction();
  const reduceMotion = useMinimalistReducedMotion();
  const isActive = interaction === 'active' && !reduceMotion;

  return (
    <motion.span
      className={`inline-flex items-center${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      variants={variants}
      initial="initial"
      animate={isActive ? 'active' : 'initial'}
    >
      <Icon size={14} strokeWidth={1.5} />
    </motion.span>
  );
}
