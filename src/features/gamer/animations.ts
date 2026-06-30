/**
 * Shared Framer Motion animation primitives for the gamer portfolio.
 *
 * Used by: AnimatedCard, SkillListItem
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
