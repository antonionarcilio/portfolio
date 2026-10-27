'use client';

import { useRef, type ReactNode } from 'react';

import { useStickyTop } from '@/shared/hooks/use-sticky-top';

type StickyColumnProps = {
  topOffsetPixels: number;
  children: ReactNode;
};

/**
 * Sticky wrapper for a column that can be taller than the viewport (see `useStickyTop`).
 * Put it in a flex row with `items-start` so each column sticks independently.
 * @example <StickyColumn topOffsetPixels={36}><Covers /></StickyColumn>
 */
export function StickyColumn({ topOffsetPixels, children }: StickyColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const top = useStickyTop(columnRef, topOffsetPixels);

  return (
    <div ref={columnRef} style={{ top }} className="sticky shrink-0">
      {children}
    </div>
  );
}
