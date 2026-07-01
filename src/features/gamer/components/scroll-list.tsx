'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useA11y } from '@/features/gamer/contexts/a11y-context';

const ScrollRootContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export function useScrollRoot() {
  return useContext(ScrollRootContext);
}

export const ScrollList = forwardRef<
  HTMLDivElement,
  {
    maxHeight: number;
    maxHeightMobile?: number;
    breakpoint?: number;
    itemCount?: number;
    snap?: boolean;
    overlayGradient?: string;
    className?: string;
    hideScrollHint?: boolean;
    children: React.ReactNode;
  }
>(function ScrollList(
  {
    maxHeight,
    maxHeightMobile,
    breakpoint = 879,
    itemCount,
    snap = false,
    overlayGradient,
    className,
    hideScrollHint = false,
    children,
  },
  externalRef,
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof externalRef === 'function') externalRef(node);
      else if (externalRef) (externalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [externalRef],
  );
  const [atBottom, setAtBottom] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [currentMaxHeight, setCurrentMaxHeight] = useState(maxHeight);

  useEffect(() => {
    if (!maxHeightMobile) {
      setCurrentMaxHeight(maxHeight);
      return;
    }
    const update = () => setCurrentMaxHeight(window.innerWidth <= breakpoint ? maxHeightMobile : maxHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [maxHeight, maxHeightMobile, breakpoint]);

  const recompute = useCallback(() => {
    const el = internalRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 2);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    recompute();
    const observer = new ResizeObserver(recompute);
    if (internalRef.current) observer.observe(internalRef.current);
    return () => observer.disconnect();
  }, [recompute, currentMaxHeight]);

  const shouldShowHint = overflows && !atBottom && (itemCount === undefined || itemCount > 1);
  const { opts } = useA11y();
  const noMotion = opts.reduceMotion;

  return (
    <>
      <div className={clsx('relative', className)}>
        <div
          ref={ref}
          className={clsx('cv-scroll relative', overflows && 'pr-2', snap && 'snap-y snap-mandatory')}
          style={{ maxHeight: currentMaxHeight }}
          onScroll={recompute}
        >
          <ScrollRootContext.Provider value={internalRef}>{children}</ScrollRootContext.Provider>
        </div>
        <div
          className="absolute left-0 right-3 bottom-0 h-[60px] pointer-events-none z-[2]"
          style={{
            opacity: shouldShowHint ? 1 : 0,
            background: overlayGradient ?? 'linear-gradient(to bottom, transparent, #03060f 95%)',
          }}
        />
      </div>
      <div
        className={clsx(
          'mt-[6px] text-[10px] text-[#a8e8fa] tracking-[0.2em] uppercase text-center opacity-70 flex items-center justify-center gap-[6px]',
          hideScrollHint ? 'hidden' : !shouldShowHint ? 'invisible' : 'visible',
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
});
