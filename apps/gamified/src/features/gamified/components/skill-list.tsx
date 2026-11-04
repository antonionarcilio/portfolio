'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { HOVER_LIFT_SCALE_VARIANT, listItemVariants, listStaggerDelay } from '@/features/gamified/animations';
import { useA11y } from '@/features/gamified/contexts/a11y-context';

import { CornerBrackets } from './corner-brackets';
import { useScrollRoot } from './scroll-list';
import { Tooltip } from './tooltip';

// ─── Constants ───────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export type CategoryListItem = {
  kind: 'category';
  id: string;
  icon?: React.ReactNode;
  label: string;
  value: string | number;
};

export type ProjectListItem = {
  kind: 'project';
  id: string;
  label: string;
  onView?: () => void;
  /** Projeto atualmente aberto no modal — anima o ícone para o estado "×". */
  active?: boolean;
};

export type SkillListItemData = CategoryListItem | ProjectListItem;

// ─── SkillListItem ────────────────────────────────────────────────────────────

export function SkillListItem({
  item,
  index,
  highlighted,
  skipEnterAnimation,
  holdUntilReady,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  item: SkillListItemData;
  index: number;
  highlighted?: boolean;
  // Skips the hidden→visible entrance animation, rendering already in its
  // final pose. Used once the skills panel has animated in for the first
  // time, so later list changes (navigating levels, refetched data) don't
  // replay the entrance stagger on every newly-mounted item.
  skipEnterAnimation?: boolean;
  // Keeps the item in its hidden pose regardless of viewport intersection,
  // even though it's technically already in view. Used while an ancestor
  // (the skills panel) is still expanding, so the entrance animation waits
  // until that expand finishes instead of playing invisibly underneath it.
  holdUntilReady?: boolean;
  onSelect?: (id: string) => void;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
}) {
  const itemRef = useRef<HTMLElement>(null);
  const root = useScrollRoot();

  const isInScrollView = useInView(itemRef as React.RefObject<Element>, {
    root: root ?? undefined,
    once: true,
    margin: '0px 0px -8px 0px',
  });
  const isInPageView = useInView(itemRef as React.RefObject<Element>, {
    once: true,
    margin: '0px 0px -8px 0px',
  });

  const isInView = !holdUntilReady && (root ? isInScrollView && isInPageView : isInPageView);
  const t = useTranslations('gamified.skillMap');
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion || skipEnterAnimation;
  const delay = listStaggerDelay(index);

  const motionProps = {
    custom: delay,
    variants: listItemVariants,
    initial: noMotion ? (false as const) : ('hidden' as const),
    animate: noMotion ? { opacity: 1, y: 0 } : isInView ? 'visible' : 'hidden',
  } as const;

  if (item.kind === 'category') {
    return (
      <motion.button
        ref={itemRef as React.RefObject<HTMLButtonElement>}
        className={`sc-cat-item relative group outline-none focus-visible:outline-none cursor-gamified-pointer${highlighted ? ' hl' : ''}`}
        {...motionProps}
        whileHover={opts.reduceMotion ? undefined : HOVER_LIFT_SCALE_VARIANT}
        onClick={() => onSelect?.(item.id)}
        onMouseEnter={() => onMouseEnter?.(item.id)}
        onMouseLeave={() => onMouseLeave?.()}
      >
        <CornerBrackets
          size="xs"
          className="border-cv-cyan opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        {item.icon && (
          <span
            className="icon"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}
          >
            {item.icon}
          </span>
        )}
        <span className="name" style={{ color: 'rgb(171, 198, 215)' }}>
          {item.label}
        </span>
        <span className="count" style={{ color: 'rgb(171, 198, 215)' }}>
          {item.value}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={itemRef as React.RefObject<HTMLButtonElement>}
      type="button"
      className="sc-cat-item relative group inline-flex items-center gap-2 outline-none focus-visible:outline-none cursor-gamified-pointer"
      {...motionProps}
      whileHover={opts.reduceMotion ? undefined : HOVER_LIFT_SCALE_VARIANT}
      onClick={() => item.onView?.()}
    >
      <CornerBrackets
        size="xs"
        className="border-cv-cyan opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span className="name w-full" style={{ color: 'rgb(171, 198, 215)' }}>
        {item.label}
      </span>
      <Tooltip title={t('clickForDetails')} placement="left">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-cv-cyan cursor-gamified-help"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <rect x="0.5" y="0.5" width="13" height="13" stroke="currentColor" />
          <motion.g
            style={{ transformOrigin: '50% 50%' }}
            animate={{ rotate: item.active ? 45 : 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <line x1="7" y1="3" x2="7" y2="11" stroke="currentColor" strokeWidth="1.2" />
            <line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.2" />
          </motion.g>
        </motion.svg>
      </Tooltip>
    </motion.button>
  );
}
