'use client';
import { useLayoutEffect, useState } from 'react';

/**
 * Largura natural (`offsetWidth`) do elemento ligado via `setElement`, atualizada por
 * ResizeObserver. Troca de elemento = nova medição; enquanto não há elemento, mantém a última
 * largura, para o container não "piscar" entre dois conteúdos.
 * @example const { setElement, width } = useElementWidth(); <div ref={setElement} />
 */
export function useElementWidth() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!element) return;
    const measure = () => setWidth(element.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return { setElement, width };
}
