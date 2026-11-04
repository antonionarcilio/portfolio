import { motion, type Variants } from 'framer-motion';

import type { AnimatedIconRenderProps } from '../types';

// `chevron-left` / `chevron-right`: a smooth nudge along x toward where the chevron points, then
// back to the initial position. `easeInOut` (not the project's ease-out curve) keeps the turnaround
// at the far point and the return home both gentle — the motion the request calls for.
const TRAVEL_DURATION_SECONDS = 0.4;
const TRAVEL_DISTANCE = 4; // ~12.5% of the 24-unit viewBox

const nudgeTransition = { duration: TRAVEL_DURATION_SECONDS, ease: 'easeInOut' as const };

const leftVariants: Variants = {
  initial: { x: 0 },
  active: { x: [0, -TRAVEL_DISTANCE, 0], transition: nudgeTransition },
};

const rightVariants: Variants = {
  initial: { x: 0 },
  active: { x: [0, TRAVEL_DISTANCE, 0], transition: nudgeTransition },
};

function AnimatedChevronArrow({
  isActive,
  size,
  pathData,
  variants,
}: AnimatedIconRenderProps & { pathData: string; variants: Variants }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
      initial="initial"
      animate={isActive ? 'active' : 'initial'}
    >
      <path d={pathData} />
    </motion.svg>
  );
}

// lucide `chevron-left` / `chevron-right` — one path each.
const CHEVRON_LEFT_PATH = 'm15 18-6-6 6-6';
const CHEVRON_RIGHT_PATH = 'm9 18 6-6-6-6';

/** `chevron-left` entry of the `ANIMATED_ICONS` registry. */
export function AnimatedChevronLeft(props: AnimatedIconRenderProps) {
  return <AnimatedChevronArrow {...props} pathData={CHEVRON_LEFT_PATH} variants={leftVariants} />;
}

/** `chevron-right` entry of the `ANIMATED_ICONS` registry. */
export function AnimatedChevronRight(props: AnimatedIconRenderProps) {
  return <AnimatedChevronArrow {...props} pathData={CHEVRON_RIGHT_PATH} variants={rightVariants} />;
}
