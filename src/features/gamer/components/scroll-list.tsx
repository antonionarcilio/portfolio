'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useA11y } from '@/features/gamer/contexts/a11y-context';

const ScrollRootContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export function useScrollRoot() {
  return useContext(ScrollRootContext);
}

export function ScrollList({
  maxHeight,
  maxHeightMobile,
  breakpoint = 879,
  itemCount,
  children,
}: {
  maxHeight: number;
  maxHeightMobile?: number;
  breakpoint?: number;
  /** When provided, the scroll hint is suppressed if itemCount <= 1. */
  itemCount?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [currentMaxHeight, setCurrentMaxHeight] = useState(maxHeight);

  useEffect(() => {
    if (!maxHeightMobile) return;
    const update = () => setCurrentMaxHeight(window.innerWidth <= breakpoint ? maxHeightMobile : maxHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [maxHeight, maxHeightMobile, breakpoint]);

  const recompute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 2);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    recompute();
    // Re-check after fonts/images settle and on content resize
    const observer = new ResizeObserver(recompute);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [recompute, currentMaxHeight]);

  const shouldShowHint = overflows && !atBottom && (itemCount === undefined || itemCount > 1);
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  return (
    <>
      <div className="relative">
        <div ref={ref} className="cv-scroll relative pr-2" style={{ maxHeight: currentMaxHeight }} onScroll={recompute}>
          <ScrollRootContext.Provider value={ref}>{children}</ScrollRootContext.Provider>
        </div>
        <div
          className="absolute left-0 right-3 bottom-0 h-[60px] bg-[linear-gradient(to_bottom,transparent,#03060f_95%)] pointer-events-none z-[2]"
          style={{ opacity: shouldShowHint ? 1 : 0 }}
        />
      </div>
      <div
        className={clsx(
          'mt-[6px] text-[10px] text-[#a8e8fa] tracking-[0.2em] uppercase text-center opacity-70 flex items-center justify-center gap-[6px]',
          !shouldShowHint ? 'invisible' : 'visible',
        )}
        aria-hidden={!shouldShowHint}
      >
        <span>Role para ver mais</span>
        {noMotion ? (
          <span className="inline-block">▼</span>
        ) : (
          <motion.span
            className="inline-block"
            animate={{ y: [0, 3, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            ▼
          </motion.span>
        )}
      </div>
    </>
  );
}
