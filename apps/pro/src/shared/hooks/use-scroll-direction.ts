'use client';

import { useEffect, useRef, useState } from 'react';

type ScrollDirectionOptions = {
  /** Distância mínima (px) rolada para cima antes de revelar o elemento novamente. */
  revealAfter: number;
};

/**
 * Observa a direção do scroll da janela: esconde ao rolar para baixo e revela ao rolar
 * para cima, mas só depois de acumular `revealAfter` px no sentido contrário. O limiar
 * evita o tremor de "aparece/esconde" quando a rolagem muda de direção.
 *
 * O estado atual vive em ref para o listener não depender de um valor capturado no
 * fechamento — sem isso, `upwardDistance` vazaria entre gestos de rolagem.
 *
 * @example const hidden = useScrollDirection({ revealAfter: 80 });
 */
export function useScrollDirection({ revealAfter }: ScrollDirectionOptions): boolean {
  const [isHidden, setIsHidden] = useState(false);
  const hiddenRef = useRef(false);

  useEffect(() => {
    let lastScrollPosition = window.scrollY;
    let upwardDistance = 0;

    const setHidden = (next: boolean) => {
      if (hiddenRef.current === next) return;
      hiddenRef.current = next;
      setIsHidden(next);
    };

    const onScroll = () => {
      const currentScrollPosition = window.scrollY;
      const delta = currentScrollPosition - lastScrollPosition;
      lastScrollPosition = currentScrollPosition;

      // No topo da página o header nunca fica escondido.
      if (currentScrollPosition <= 0) {
        upwardDistance = 0;
        setHidden(false);
        return;
      }

      if (delta > 0) {
        upwardDistance = 0;
        setHidden(true);
        return;
      }

      if (delta < 0) {
        upwardDistance += -delta;
        if (upwardDistance < revealAfter) return;
        upwardDistance = 0;
        setHidden(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [revealAfter]);

  return isHidden;
}
