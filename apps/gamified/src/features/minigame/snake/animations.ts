import type { Variants } from 'framer-motion';

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as const } },
};

export const overlayContentVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] as const, delay: 0.1 },
  },
};

export const scorePopVariants: Variants = {
  initial: { scale: 1.3 },
  animate: { scale: 1, transition: { duration: 0.25, ease: [0.2, 0.7, 0.2, 1] as const } },
};

export const hudVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as const } },
};
