import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type ScrollEdges = { hasHiddenStart: boolean; hasHiddenEnd: boolean };

const NO_HIDDEN_EDGES: ScrollEdges = { hasHiddenStart: false, hasHiddenEnd: false };

/** Folga para não acusar conteúdo escondido por causa de arredondamento de subpixel. */
const SUBPIXEL_TOLERANCE_PIXELS = 1;

function measureEdges(element: HTMLElement): ScrollEdges {
  const maximumScrollLeft = element.scrollWidth - element.clientWidth;
  return {
    hasHiddenStart: element.scrollLeft > SUBPIXEL_TOLERANCE_PIXELS,
    hasHiddenEnd: element.scrollLeft < maximumScrollLeft - SUBPIXEL_TOLERANCE_PIXELS,
  };
}

/**
 * Diz se um contêiner de rolagem horizontal tem conteúdo escondido no início e/ou no fim —
 * é o que liga o esmaecimento das bordas (ver `OptionScroller`). Remede ao rolar e quando o
 * tamanho do contêiner ou do conteúdo muda.
 * @example const { scrollRef, hasHiddenStart, hasHiddenEnd, handleScroll } = useScrollEdges();
 */
export function useScrollEdges(): {
  scrollRef: RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
} & ScrollEdges {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<ScrollEdges>(NO_HIDDEN_EDGES);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setEdges(measureEdges(scrollRef.current));
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    handleScroll();
    const observer = new ResizeObserver(handleScroll);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [handleScroll]);

  return { scrollRef, handleScroll, ...edges };
}
