import { useEffect, useState, type RefObject } from 'react';

type ScrollEdges = { showTop: boolean; showBottom: boolean };

const NO_EDGES: ScrollEdges = { showTop: false, showBottom: false };

/**
 * Tracks whether a scroll container has clipped content above / below the current
 * scroll position — used to fade the top/bottom overlay gradients in and out.
 * Both flags are `false` while `enabled` is `false` or the element doesn't overflow.
 *
 * `contentKey` goes into the effect deps so a content swap that changes the
 * scrollable height (without resizing the element's own box, which the
 * `ResizeObserver` already covers) re-runs the measurement.
 *
 * @example
 * const { showTop, showBottom } = useScrollEdges(scrollerRef, isExpanded, currentItem.id);
 */
export function useScrollEdges(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  contentKey?: unknown,
): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>(NO_EDGES);

  useEffect(() => {
    if (!enabled) {
      setEdges(NO_EDGES);
      return;
    }
    let frame = 0;
    let cleanup = () => {};
    const attach = () => {
      const element = ref.current;
      if (!element) {
        frame = window.requestAnimationFrame(attach);
        return;
      }
      const update = () => {
        const hasOverflow = element.scrollHeight > element.clientHeight + 1;
        const atStart = element.scrollTop <= 1;
        const atEnd = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
        const showTop = hasOverflow && !atStart;
        const showBottom = hasOverflow && !atEnd;
        // Keep the same object when nothing changed so a scroll tick doesn't re-render.
        setEdges((prev) =>
          prev.showTop === showTop && prev.showBottom === showBottom ? prev : { showTop, showBottom },
        );
      };
      update();
      element.addEventListener('scroll', update, { passive: true });
      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(element);
      cleanup = () => {
        element.removeEventListener('scroll', update);
        resizeObserver.disconnect();
      };
    };
    frame = window.requestAnimationFrame(attach);
    return () => {
      window.cancelAnimationFrame(frame);
      cleanup();
    };
  }, [ref, enabled, contentKey]);

  return edges;
}
