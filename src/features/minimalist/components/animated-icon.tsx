import type { ComponentType } from 'react';

import { useIconInteraction } from '../contexts/icon-interaction-context';
import { useMinimalistReducedMotion } from '../contexts/reduced-motion-context';
import type { AnimatedIconRenderProps } from '../types';
import { AnimatedArrowUpDown } from './animated-arrow-up-down';
import { AnimatedArrowUpRight } from './animated-arrow-up-right';
import { AnimatedChevronLeft, AnimatedChevronRight } from './animated-chevron-arrow';
import { AnimatedChevronsDownUp, AnimatedChevronsUpDown } from './animated-chevrons';

// Each icon owns its own animation — the effect is fixed per icon, never chosen by the caller.
// Register a new animated icon by adding a renderer here; its key becomes a valid `icon` value
// and the dev preview page (`/dev/minimalist-animated-icon`) picks it up automatically.
const ANIMATED_ICONS = {
  'arrow-up-right': AnimatedArrowUpRight,
  'arrow-up-down': AnimatedArrowUpDown,
  'chevron-left': AnimatedChevronLeft,
  'chevron-right': AnimatedChevronRight,
  'chevrons-up-down': AnimatedChevronsUpDown,
  'chevrons-down-up': AnimatedChevronsDownUp,
} satisfies Record<string, ComponentType<AnimatedIconRenderProps>>;

export type AnimatedIconName = keyof typeof ANIMATED_ICONS;

/** Every registered icon key, for iteration (e.g. the dev preview page). */
export const ANIMATED_ICON_NAMES = Object.keys(ANIMATED_ICONS) as AnimatedIconName[];

type AnimatedIconProps = {
  icon: AnimatedIconName;
  className?: string;
  size?: number;
};

/**
 * Renders a registered icon that animates while its parent container is hovered/focused.
 * The animation is bound to the icon (see {@link ANIMATED_ICONS}).
 *
 * @example
 * <a {...handlers}>
 *   <IconInteractionProvider value={state}>
 *     Ver projeto
 *     <AnimatedIcon icon="arrow-up-right" className="minimalist-anchor__icon" />
 *   </IconInteractionProvider>
 * </a>
 */
export function AnimatedIcon({ icon, className, size = 14 }: AnimatedIconProps) {
  const interaction = useIconInteraction();
  const reduceMotion = useMinimalistReducedMotion();
  const isActive = interaction === 'active' && !reduceMotion;
  const IconRenderer = ANIMATED_ICONS[icon];

  return (
    <span className={`inline-flex items-center${className ? ` ${className}` : ''}`} aria-hidden="true">
      <IconRenderer isActive={isActive} size={size} />
    </span>
  );
}
