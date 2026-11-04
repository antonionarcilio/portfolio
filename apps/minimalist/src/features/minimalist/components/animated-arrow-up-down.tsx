import { motion, type Variants } from 'framer-motion';

import { MINIMALIST_EASE, MINIMALIST_MORPH_PHASE_COUNT } from '../animations';
import type { AnimatedIconRenderProps } from '../types';

// `arrow-up-down` morph, played once when the parent container becomes active. Both arrows loop
// vertically in opposite directions, three equal phases:
//   A. up arrow (left) slides up out of view;  down arrow (right) slides down out of view
//   B. each is faded out (opacity 0) and travels, unseen, to the opposite edge
//   C. opacity restored at the far edge, then each slides back to home
const PHASE_DURATION_SECONDS = 0.4;
const TOTAL_DURATION_SECONDS = PHASE_DURATION_SECONDS * MINIMALIST_MORPH_PHASE_COUNT;

const VIEWBOX_SIZE = 24;
// Full viewBox height: at ±EXIT_DISTANCE the arrow is entirely outside the icon.
const EXIT_DISTANCE = VIEWBOX_SIZE;

// A short opacity step tucked just after each phase boundary — the fade happens while the arrow is
// already off-screen, so the wrap-around traversal (phase B) is never visible.
const FADE_STEP = 0.02;
const MORPH_TIMES = [0, 1 / 3, 1 / 3 + FADE_STEP, 2 / 3, 2 / 3 + FADE_STEP, 1];
const WRAP_OPACITY = [1, 1, 0, 0, 1, 1];
const morphTransition = { duration: TOTAL_DURATION_SECONDS, times: MORPH_TIMES, ease: MINIMALIST_EASE };

// SVG y axis points down: negative translate = up, positive = down.
const upArrowVariants: Variants = {
  initial: { y: 0, opacity: 1 },
  active: {
    y: [0, -EXIT_DISTANCE, -EXIT_DISTANCE, EXIT_DISTANCE, EXIT_DISTANCE, 0],
    opacity: WRAP_OPACITY,
    transition: morphTransition,
  },
};

const downArrowVariants: Variants = {
  initial: { y: 0, opacity: 1 },
  active: {
    y: [0, EXIT_DISTANCE, EXIT_DISTANCE, -EXIT_DISTANCE, -EXIT_DISTANCE, 0],
    opacity: WRAP_OPACITY,
    transition: morphTransition,
  },
};

// lucide `arrow-up-down`, split into its two arrows.
const DOWN_ARROW_PATHS = ['m21 16-4 4-4-4', 'M17 20V4']; // first two paths — the arrow pointing down (right)
const UP_ARROW_PATHS = ['m3 8 4-4 4 4', 'M7 4v16']; // last two paths — the arrow pointing up (left)

/** `arrow-up-down` entry of the `ANIMATED_ICONS` registry. */
export function AnimatedArrowUpDown({ isActive, size }: AnimatedIconRenderProps) {
  const state = isActive ? 'active' : 'initial';
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="hidden"
    >
      <motion.g variants={downArrowVariants} initial="initial" animate={state}>
        {DOWN_ARROW_PATHS.map((pathData) => (
          <path key={pathData} d={pathData} />
        ))}
      </motion.g>
      <motion.g variants={upArrowVariants} initial="initial" animate={state}>
        {UP_ARROW_PATHS.map((pathData) => (
          <path key={pathData} d={pathData} />
        ))}
      </motion.g>
    </motion.svg>
  );
}
