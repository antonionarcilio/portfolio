'use client';

import type { PartialOptions } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

/**
 * Tema `os-theme-portfolio` (em `shared/styles/overlay-scrollbar.css`): a barra só aparece enquanto o
 * ponteiro se move sobre a área ou durante a rolagem, e some 600ms depois — não disputa espaço com o conteúdo.
 */
const SCROLL_AREA_OPTIONS: PartialOptions = {
  overflow: { x: 'hidden', y: 'scroll' },
  scrollbars: { theme: 'os-theme-portfolio', autoHide: 'move', autoHideDelay: 600 },
};

type OverlayScrollAreaProps = {
  children: React.ReactNode;
  /** Classes do host: dê a ele uma altura definida (ex.: `min-h-0 flex-1` numa coluna flex). */
  className?: string;
  /** Recebe o elemento que de fato rola, para quem precisa ler/ajustar `scrollTop`. */
  viewportRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Área com rolagem vertical e scrollbar sobreposta (overlayscrollbars). Única porta de entrada da lib no
 * app: a rolagem continua nativa (teclado, toque e leitor de tela funcionam), só o desenho da barra muda.
 * @example <OverlayScrollArea className="min-h-0 flex-1" viewportRef={historyRef}>{messages}</OverlayScrollArea>
 */
export function OverlayScrollArea({ children, className, viewportRef }: OverlayScrollAreaProps) {
  return (
    <OverlayScrollbarsComponent
      element="div"
      className={className}
      options={SCROLL_AREA_OPTIONS}
      events={{
        initialized: (instance) => {
          if (viewportRef) viewportRef.current = instance.elements().viewport;
        },
        destroyed: () => {
          if (viewportRef) viewportRef.current = null;
        },
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
