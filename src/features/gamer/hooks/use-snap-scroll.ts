'use client';

import { useA11y } from '@/features/gamer/contexts/a11y-context';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';
import { useCallback, useEffect, useRef } from 'react';

export function useSnapScroll(itemCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndex = useRef(0);
  const isScrolling = useRef(false);
  const { opts } = useA11y();
  const isMobile = useIsMobile();
  const disabled = opts.reduceMotion || isMobile;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(itemCount - 1, currentIndex.current + dir));
      if (next === currentIndex.current) {
        isScrolling.current = true;
        return;
      }

      e.preventDefault();

      isScrolling.current = true;
      currentIndex.current = next;

      const card = cardRefs.current[next];
      if (!card) {
        isScrolling.current = false;
        return;
      }
      container.scrollTo({ top: card.offsetTop, behavior: 'smooth' });
      setTimeout(() => {
        isScrolling.current = false;
      }, 350);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [itemCount, disabled]);

  const getCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    [],
  );

  return { containerRef, getCardRef };
}
