'use client';

import type { OverlayScrollbars, PartialOptions } from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

/** Se há conteúdo escondido acima/abaixo da área visível — sem rolagem, os dois são `false`. */
export type ScrollEdges = { hasContentAbove: boolean; hasContentBelow: boolean };

/** Folga de 1px: o `scrollTop` fracionário (zoom, telas de alta densidade) não conta como "falta conteúdo". */
const EDGE_TOLERANCE_PIXELS = 1;

function readScrollEdges(instance: OverlayScrollbars): ScrollEdges {
  const { scrollTop, scrollHeight, clientHeight } = instance.elements().viewport;
  return {
    hasContentAbove: scrollTop > EDGE_TOLERANCE_PIXELS,
    hasContentBelow: scrollHeight - scrollTop - clientHeight > EDGE_TOLERANCE_PIXELS,
  };
}

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
  /**
   * Avisa se há conteúdo acima/abaixo ao montar, ao rolar e quando o conteúdo muda de tamanho — ex.: o
   * esmaecimento no fim da área de texto, que só aparece enquanto há texto abaixo.
   */
  onScrollEdgesChange?: (edges: ScrollEdges) => void;
};

/**
 * Área com rolagem vertical e scrollbar sobreposta (overlayscrollbars). Única porta de entrada da lib no
 * app: a rolagem continua nativa (teclado, toque e leitor de tela funcionam), só o desenho da barra muda.
 * @example <OverlayScrollArea className="min-h-0 flex-1" viewportRef={historyRef}>{messages}</OverlayScrollArea>
 */
export function OverlayScrollArea({ children, className, viewportRef, onScrollEdgesChange }: OverlayScrollAreaProps) {
  const reportEdges = (instance: OverlayScrollbars) => onScrollEdgesChange?.(readScrollEdges(instance));
  return (
    <OverlayScrollbarsComponent
      element="div"
      className={className}
      options={SCROLL_AREA_OPTIONS}
      events={{
        initialized: (instance) => {
          if (viewportRef) viewportRef.current = instance.elements().viewport;
          reportEdges(instance);
        },
        updated: reportEdges,
        scroll: reportEdges,
        destroyed: () => {
          if (viewportRef) viewportRef.current = null;
        },
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
