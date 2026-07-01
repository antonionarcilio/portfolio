'use client';

import clsx from 'clsx';
import { motion, useInView } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { listItemVariants, listStaggerDelay } from '@/features/gamer/animations';
import { useA11y } from '@/features/gamer/contexts/a11y-context';

import { CvButton, shimmerChip } from './cv-button';
import { useScrollRoot } from './scroll-list';

// ─── Constants ───────────────────────────────────────────────────────────────

const ITEM_H = 36;
const GAP = 7;
const SLOT = ITEM_H + GAP;
const OVERSCAN = 3;
const VIRTUALIZE_THRESHOLD = 15;

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
};

export type SkillListItemData = CategoryListItem | ProjectListItem;

// ─── SkillListItem ────────────────────────────────────────────────────────────

export function SkillListItem({
  item,
  index,
  highlighted,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  item: SkillListItemData;
  index: number;
  highlighted?: boolean;
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

  const isInView = root ? isInScrollView && isInPageView : isInPageView;
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;
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
        className={`sc-cat-item cursor-gamer-pointer${highlighted ? ' hl' : ''}`}
        {...motionProps}
        onClick={() => onSelect?.(item.id)}
        onMouseEnter={() => onMouseEnter?.(item.id)}
        onMouseLeave={() => onMouseLeave?.()}
      >
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
    <CvButton
      ref={itemRef as React.RefObject<HTMLButtonElement>}
      variant="shimmer"
      className="sc-cat-item"
      labelClassName={clsx(shimmerChip({ size: 'sm' }), 'shrink-0')}
      leftIcon={
        <span className="name w-full" style={{ color: 'rgb(171, 198, 215)' }}>
          {item.label}
        </span>
      }
      {...motionProps}
      onClick={() => item.onView?.()}
    >
      VER
    </CvButton>
  );
}

// ─── SkillList ────────────────────────────────────────────────────────────────

export function SkillList({
  items,
  highlighted,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  items: SkillListItemData[];
  highlighted?: string;
  onSelect?: (id: string) => void;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
}) {
  if (items.length > VIRTUALIZE_THRESHOLD) {
    return (
      <VirtualSkillList
        items={items}
        highlighted={highlighted}
        onSelect={onSelect}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  }

  return (
    <div className="sc-cat-list">
      {items.map((item, i) => (
        <SkillListItem
          key={item.id}
          item={item}
          index={i}
          highlighted={highlighted === item.id}
          onSelect={onSelect}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ))}
    </div>
  );
}

// ─── VirtualSkillList ─────────────────────────────────────────────────────────

function VirtualSkillList({
  items,
  highlighted,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  items: SkillListItemData[];
  highlighted?: string;
  onSelect?: (id: string) => void;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerH, setContainerH] = useState(VIRTUALIZE_THRESHOLD * SLOT);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerH(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { start, end } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / SLOT) - OVERSCAN);
    const end = Math.min(items.length, Math.ceil((scrollTop + containerH) / SLOT) + OVERSCAN);
    return { start, end };
  }, [scrollTop, containerH, items.length]);

  const totalH = items.length * SLOT - GAP;

  return (
    <div
      ref={containerRef}
      className="cv-scroll"
      style={{ position: 'relative', overflowY: 'auto', maxHeight: VIRTUALIZE_THRESHOLD * SLOT }}
      onScroll={onScroll}
    >
      <div style={{ height: totalH, position: 'relative' }}>
        {items.slice(start, end).map((item, localIdx) => {
          const globalIdx = start + localIdx;
          return (
            <div key={item.id} style={{ position: 'absolute', top: globalIdx * SLOT, left: 0, right: 0 }}>
              <SkillListItem
                item={item}
                index={globalIdx}
                highlighted={highlighted === item.id}
                onSelect={onSelect}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
