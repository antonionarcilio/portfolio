/**
 * Shared Framer Motion animation primitives for the gamified portfolio.
 *
 * Used by: AnimatedCard, SkillListItem, Achievements, EducationSection,
 * ExperienceSection, ProjectsSection, Stats
 */

export const LIST_STAGGER_STEP = 0.07;
export const LIST_MAX_STAGGER_INDEX = 5;

export const listItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] as const, delay },
  }),
};

export function listStaggerDelay(index: number): number {
  return Math.min(index, LIST_MAX_STAGGER_INDEX) * LIST_STAGGER_STEP;
}

/**
 * "Mouse enter" transition that lifts the element 2px up on the Y axis.
 */
export const HOVER_LIFT_VARIANT = {
  y: -2,
  transition: { duration: 0.25, ease: [0.2, 0.7, 0.2, 1] as const },
};

export const HOVER_LIFT_SCALE_VARIANT = {
  scale: 0.98,
  transition: { duration: 0.25, ease: [0.2, 0.7, 0.2, 1] as const },
};

export const CARD_STAGGER_STEP = 0.12;

/**
 * Entrance transition shared by the hero Stats cards and the skills panel's
 * overview metric cards (Núcleos/Tecnologias): scales and slides up into view.
 */
export const cardVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.2, 0.7, 0.2, 1] as const, delay },
  }),
};
