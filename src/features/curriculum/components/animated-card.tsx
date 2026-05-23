'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { useScrollRoot } from './scroll-list';

const STAGGER_STEP = 0.07;
const MAX_STAGGER_INDEX = 5;

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] as const, delay },
  }),
};

export function AnimatedCard({
  index = 0,
  className,
  whileHover,
  children,
  onClick,
  role,
  tabIndex,
  title,
  onKeyDown,
}: {
  index?: number;
  className?: string;
  whileHover?: React.ComponentProps<typeof motion.div>['whileHover'];
  children: React.ReactNode;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  title?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const root = useScrollRoot();

  const isInScrollView = useInView(cardRef, {
    root: root ?? undefined,
    once: true,
    margin: '0px 0px -8px 0px',
  });
  const isInPageView = useInView(cardRef, {
    once: true,
    margin: '0px 0px -8px 0px',
  });

  const isInView = root ? isInScrollView && isInPageView : isInPageView;

  const delay = Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP;

  return (
    <motion.div
      ref={cardRef}
      className={className}
      custom={delay}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={whileHover}
      transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      title={title}
      onKeyDown={onKeyDown}
    >
      {children}
    </motion.div>
  );
}
