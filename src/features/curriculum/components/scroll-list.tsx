'use client';

import { motion } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ScrollRootContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export function useScrollRoot() {
  return useContext(ScrollRootContext);
}

export function ScrollList({
  maxHeight,
  maxHeightMobile,
  breakpoint = 879,
  children,
}: {
  maxHeight: number;
  maxHeightMobile?: number;
  breakpoint?: number;
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
  }, [recompute, currentMaxHeight]);

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          ref={ref}
          className="cv-scroll relative pr-2"
          style={{ maxHeight: currentMaxHeight, minHeight: currentMaxHeight }}
          onScroll={recompute}
        >
          <ScrollRootContext.Provider value={ref}>{children}</ScrollRootContext.Provider>
        </div>
        <motion.div
          className="absolute left-0 right-3 bottom-0 h-[60px] bg-[linear-gradient(to_bottom,transparent,#03060f_95%)] pointer-events-none z-[2]"
          animate={{ opacity: atBottom || !overflows ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        />
      </div>
      {overflows && (
        <div
          className={`mt-[6px] text-[10px] text-[#a8e8fa] tracking-[0.2em] uppercase text-center opacity-70 flex items-center justify-center gap-[6px] ${atBottom ? 'invisible' : 'visible'}`}
          aria-hidden={atBottom}
        >
          <span>Role para ver mais</span>
          <motion.span
            className="inline-block"
            animate={{ y: [0, 3, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            ▼
          </motion.span>
        </div>
      )}
    </>
  );
}
