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

/** Quanto a roda precisa "empurrar" contra a ponta do seletor antes de a página voltar a rolar. */
const WHEEL_RELEASE_THRESHOLD_PIXELS = 800;

/** Pausa na roda que zera o empurrão acumulado: um novo gesto precisa vencer a resistência de novo. */
const WHEEL_IDLE_RESET_MILLISECONDS = 400;

/**
 * Cria o tratador de roda que converte a rolagem vertical em horizontal (o que Shift + roda já
 * faz). Ao chegar numa ponta, a página fica retida até a roda empurrar `WHEEL_RELEASE_THRESHOLD_PIXELS`
 * além dela — sem isso a página sairia rolando no mesmo gesto que acabou de esgotar o seletor.
 * O empurrão acumulado zera numa pausa ou ao inverter o sentido.
 */
function createWheelHandler(element: HTMLElement): (event: WheelEvent) => void {
  let pushedPixels = 0;
  let pushedDirection = 0;
  let lastPushTimestamp = 0;

  return (event) => {
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
    const maximumScrollLeft = element.scrollWidth - element.clientWidth;
    if (maximumScrollLeft <= 0) return;

    const nextScrollLeft = element.scrollLeft + event.deltaY;
    const isPastStart = nextScrollLeft < 0 && element.scrollLeft <= SUBPIXEL_TOLERANCE_PIXELS;
    // `scrollLeft` é fracionário em telas com zoom/escala: sem a folga, o fim nunca é "alcançado" (ex.: 399,5 de 400) e a página ficaria presa só para baixo.
    const isPastEnd =
      nextScrollLeft > maximumScrollLeft && element.scrollLeft >= maximumScrollLeft - SUBPIXEL_TOLERANCE_PIXELS;
    if (!isPastStart && !isPastEnd) {
      pushedPixels = 0;
      element.scrollLeft = nextScrollLeft;
      event.preventDefault();
      return;
    }

    const direction = Math.sign(event.deltaY);
    const isNewGesture =
      direction !== pushedDirection || event.timeStamp - lastPushTimestamp > WHEEL_IDLE_RESET_MILLISECONDS;
    if (isNewGesture) pushedPixels = 0;
    pushedDirection = direction;
    lastPushTimestamp = event.timeStamp;
    pushedPixels += Math.abs(event.deltaY);
    if (pushedPixels < WHEEL_RELEASE_THRESHOLD_PIXELS) event.preventDefault();
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
    // Nativo e não passivo: o `onWheel` do React é passivo e não poderia cancelar a rolagem da página.
    const handleWheel = createWheelHandler(element);
    element.addEventListener('wheel', handleWheel, { passive: false });
    const observer = new ResizeObserver(handleScroll);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    return () => {
      observer.disconnect();
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleScroll]);

  return { scrollRef, handleScroll, ...edges };
}
