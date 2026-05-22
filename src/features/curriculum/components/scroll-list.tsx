'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

export function ScrollList({ maxHeight, children }: { maxHeight: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const recompute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 2);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    recompute();
  }, [recompute]);

  return (
    <>
      <div
        className={clsx(
          "relative after:content-[''] after:absolute after:left-0 after:right-3 after:bottom-0 after:h-[60px] after:bg-[linear-gradient(to_bottom,transparent,#03060f_95%)] after:pointer-events-none after:z-[2] after:transition-opacity after:duration-[250ms]",
          (atBottom || !overflows) && 'after:opacity-0',
        )}
      >
        <div ref={ref} className="cv-scroll relative pr-2" style={{ maxHeight }} onScroll={recompute}>
          {children}
        </div>
      </div>
      {overflows && (
        <div
          className={clsx(
            'mt-[6px] text-[10px] text-[#a8e8fa] tracking-[0.2em] uppercase text-center opacity-70 flex items-center justify-center gap-[6px]',
            atBottom ? 'invisible' : 'visible',
          )}
          aria-hidden={atBottom}
        >
          <span>Role para ver mais</span>
          <span className="inline-block animate-bob">▼</span>
        </div>
      )}
    </>
  );
}
