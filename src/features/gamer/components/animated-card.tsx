'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { listItemVariants, listStaggerDelay } from '@/features/gamer/animations';
import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { useScrollRoot } from './scroll-list';

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
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  const delay = listStaggerDelay(index);

  return (
    <motion.div
      ref={cardRef}
      className={className}
      custom={delay}
      variants={listItemVariants}
      initial={noMotion ? false : 'hidden'}
      animate={noMotion ? { opacity: 1, y: 0 } : isInView ? 'visible' : 'hidden'}
      whileHover={noMotion ? undefined : whileHover}
      transition={noMotion ? { duration: 0 } : { duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
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
