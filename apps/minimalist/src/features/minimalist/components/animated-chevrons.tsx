import { motion, type Variants } from 'framer-motion';

import { MINIMALIST_EASE, MINIMALIST_MORPH_PHASE_COUNT } from '../animations';
import type { AnimatedIconRenderProps } from '../types';

// Morph animation shared by `chevrons-up-down` and `chevrons-down-up`.
//
// Three equal phases, played once when the parent container becomes active:
//   A. icon scales to SCALE_DOWN  +  top path moves toward center, bottom path moves toward center
//   B. top path moves apart (up), bottom path moves apart (down)  +  scale returns to 1
//   C. both paths return to their default position
const PHASE_DURATION_SECONDS = 0.3;

const CHEVRON_VIEWBOX_SIZE = 24;
const CONVERGE_PERCENT = 2;
const SPREAD_PERCENT = 4;
const CONVERGE_TRANSLATE = (CONVERGE_PERCENT / 100) * CHEVRON_VIEWBOX_SIZE;
const SPREAD_TRANSLATE = (SPREAD_PERCENT / 100) * CHEVRON_VIEWBOX_SIZE;
const SCALE_DOWN = 0.9;

const phaseTransition = {
  duration: PHASE_DURATION_SECONDS * MINIMALIST_MORPH_PHASE_COUNT,
  times: [0, 1 / 3, 2 / 3, 1],
  ease: MINIMALIST_EASE,
};

const svgVariants: Variants = {
  initial: { scale: 1 },
  active: { scale: [1, SCALE_DOWN, 1, 1], transition: phaseTransition },
};

// SVG y axis points down: positive translate = down, negative = up.
const topPathVariants: Variants = {
  initial: { y: 0 },
  active: { y: [0, CONVERGE_TRANSLATE, -SPREAD_TRANSLATE, 0], transition: phaseTransition },
};

const bottomPathVariants: Variants = {
  initial: { y: 0 },
  active: { y: [0, -CONVERGE_TRANSLATE, SPREAD_TRANSLATE, 0], transition: phaseTransition },
};

type ChevronsShape = {
  topPathData: string;
  bottomPathData: string;
};

function AnimatedChevrons({ isActive, size, topPathData, bottomPathData }: AnimatedIconRenderProps & ChevronsShape) {
  const state = isActive ? 'active' : 'initial';
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${CHEVRON_VIEWBOX_SIZE} ${CHEVRON_VIEWBOX_SIZE}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={svgVariants}
      initial="initial"
      animate={state}
    >
      <motion.path d={topPathData} variants={topPathVariants} initial="initial" animate={state} />
      <motion.path d={bottomPathData} variants={bottomPathVariants} initial="initial" animate={state} />
    </motion.svg>
  );
}

const CHEVRONS_UP_DOWN: ChevronsShape = { topPathData: 'M7 9L12 4L17 9', bottomPathData: 'M7 15L12 20L17 15' };
const CHEVRONS_DOWN_UP: ChevronsShape = { topPathData: 'M7 4L12 9L17 4', bottomPathData: 'M7 20L12 15L17 20' };

/** `chevrons-up-down` entry of the `ANIMATED_ICONS` registry. */
export function AnimatedChevronsUpDown(props: AnimatedIconRenderProps) {
  return <AnimatedChevrons {...props} {...CHEVRONS_UP_DOWN} />;
}

/** `chevrons-down-up` entry of the `ANIMATED_ICONS` registry. */
export function AnimatedChevronsDownUp(props: AnimatedIconRenderProps) {
  return <AnimatedChevrons {...props} {...CHEVRONS_DOWN_UP} />;
}
