'use client';

import { useEffect, useState } from 'react';

/** Returns true when the viewport is narrower than Tailwind's `sm` breakpoint (640 px). */
export function useIsMobile(breakpoint = 640): boolean {
  // Start false to avoid SSR/hydration mismatch; corrected on first effect run.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}
