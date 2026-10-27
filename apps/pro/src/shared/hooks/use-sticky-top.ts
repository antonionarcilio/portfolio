import { useEffect, useState, type RefObject } from 'react';

/**
 * `top` for a `position: sticky` element that may be taller than the viewport. When it fits, it
 * sticks at `topOffsetPixels`; when it is taller, `top` goes negative so the element scrolls until
 * its bottom reaches the viewport bottom and only then sticks, keeping its whole content reachable.
 * Re-measured when the element resizes (e.g. an accordion opens) and when the window resizes.
 * @example const top = useStickyTop(columnRef, 0);
 */
export function useStickyTop(
  elementRef: RefObject<HTMLElement | null>,
  topOffsetPixels: number,
  bottomOffsetPixels = 0,
): number {
  const [top, setTop] = useState(topOffsetPixels);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const measure = () => {
      const availableTop = window.innerHeight - element.offsetHeight - bottomOffsetPixels;
      setTop(Math.min(topOffsetPixels, availableTop));
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [elementRef, topOffsetPixels, bottomOffsetPixels]);

  return top;
}
