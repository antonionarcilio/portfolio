import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
  type WheelEvent,
} from 'react';

type SnapScrollOptions = {
  rowSelector?: string;
  threshold?: number;
};

type SnapScrollHandlers = {
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchCancel: () => void;
  onWheel: (event: WheelEvent<HTMLDivElement>) => void;
};

export function useMinimalistSnapScroll({
  rowSelector = '[data-project-card]',
  threshold = 20,
}: SnapScrollOptions = {}): SnapScrollHandlers & {
  viewportRef: (node: HTMLDivElement | null) => void;
  activeRow: number;
  rowCount: number;
} {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<number[]>([]);
  const touchStartY = useRef<number | null>(null);
  const touchConsumed = useRef(false);
  const [activeRow, setActiveRow] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const setViewport = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
  }, []);

  const measureRows = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const positions = Array.from(viewport.querySelectorAll<HTMLElement>(rowSelector))
      .map((card) => card.offsetTop)
      .sort((a, b) => a - b)
      .filter((position, index, values) => index === 0 || position - values[index - 1] > 2);

    rowsRef.current = positions;
    setRowCount(positions.length);
    setActiveRow((current) => Math.min(current, Math.max(positions.length - 1, 0)));
  }, [rowSelector]);

  const updateActiveRow = useCallback(() => {
    const viewport = viewportRef.current;
    const rows = rowsRef.current;
    if (!viewport || !rows.length) return;

    const nearest = rows.reduce(
      (best, position, index) =>
        Math.abs(position - viewport.scrollTop) < Math.abs(rows[best] - viewport.scrollTop) ? index : best,
      0,
    );
    setActiveRow(nearest);
  }, []);

  const moveToRow = useCallback((index: number, behavior: ScrollBehavior = 'smooth'): boolean => {
    const viewport = viewportRef.current;
    const rows = rowsRef.current;
    if (!viewport || index < 0 || index >= rows.length) return false;

    viewport.scrollTo({ top: rows[index], behavior });
    setActiveRow(index);
    return true;
  }, []);

  const consumeDirection = useCallback(
    (direction: number, event: { preventDefault: () => void; stopPropagation: () => void }): boolean => {
      const current = rowsRef.current.length ? activeRow : 0;
      const target = current + direction;
      if (!moveToRow(target)) return false;

      event.preventDefault();
      event.stopPropagation();
      return true;
    },
    [activeRow, moveToRow],
  );

  const onWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaY) < threshold) return;
      consumeDirection(event.deltaY > 0 ? 1 : -1, event);
    },
    [consumeDirection, threshold],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const direction = ['ArrowDown', 'PageDown'].includes(event.key)
        ? 1
        : ['ArrowUp', 'PageUp'].includes(event.key)
          ? -1
          : 0;
      if (direction) consumeDirection(direction, event);
    },
    [consumeDirection],
  );

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
    touchConsumed.current = false;
  }, []);

  const onTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - (event.touches[0]?.clientY ?? touchStartY.current);
      if (Math.abs(delta) < threshold || touchConsumed.current) return;

      const direction = delta > 0 ? 1 : -1;
      const target = activeRow + direction;
      if (target >= 0 && target < rowsRef.current.length) {
        event.preventDefault();
        event.stopPropagation();
        touchConsumed.current = true;
      }
    },
    [activeRow, threshold],
  );

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (touchConsumed.current && touchStartY.current !== null) {
        const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
        consumeDirection(touchStartY.current - endY > 0 ? 1 : -1, event);
      }
      touchStartY.current = null;
      touchConsumed.current = false;
    },
    [consumeDirection],
  );

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    measureRows();
    viewport.addEventListener('scroll', updateActiveRow, { passive: true });
    const resizeObserver = new ResizeObserver(measureRows);
    resizeObserver.observe(viewport);
    Array.from(viewport.querySelectorAll<HTMLElement>(rowSelector)).forEach((card) => resizeObserver.observe(card));
    const mutationObserver = new MutationObserver(measureRows);
    mutationObserver.observe(viewport, { childList: true, subtree: true });

    return () => {
      viewport.removeEventListener('scroll', updateActiveRow);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [measureRows, rowSelector, updateActiveRow]);

  return {
    viewportRef: setViewport,
    activeRow,
    rowCount,
    onKeyDown,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: () => {
      touchStartY.current = null;
      touchConsumed.current = false;
    },
    onWheel,
  };
}
