import type { useAnimate } from 'framer-motion';
import type { ComponentType, Ref } from 'react';

/**
 * Como o ícone decide quando animar.
 * - `auto`: loop contínuo.
 * - `hover`: anima enquanto o mouse está sobre o próprio ícone.
 * - `parent`: anima enquanto o mouse (ou o foco do teclado) está sobre o elemento hospedeiro — o ancestral
 *   marcado com `data-animated-icon-host` ou, sem marcação, o pai direto.
 * - `controlled`: anima enquanto `isPlaying` for `true`.
 * - `mount`: toca UM ciclo quando o ícone aparece (ex.: o ícone que troca de lugar com outro) e não repete.
 */
export type AnimatedIconTrigger = 'auto' | 'hover' | 'parent' | 'controlled' | 'mount';

/** Função `animate` escopada ao <svg> do ícone (`useAnimate`). */
export type IconAnimate = ReturnType<typeof useAnimate>[1];

export type IconGraphicProps = {
  sizePixels: number;
  ref: Ref<SVGSVGElement>;
};

/**
 * Um ícone animado = o desenho em SVG inline + COMO ele anima:
 * - `cycle`: `playCycle` toca UM ciclo que termina na pose de repouso (ex.: fumaça); o componente o repete.
 * - `state`: `applyState` leva o ícone à pose ativa ou de volta ao repouso e a mantém (ex.: seta que gira no hover).
 */
export type AnimatedIconDefinition =
  | {
      kind: 'cycle';
      Graphic: ComponentType<IconGraphicProps>;
      playCycle: (animate: IconAnimate, root: SVGSVGElement | null) => Promise<unknown>;
      /**
       * Toca mesmo com "pausar animações" ligado (o `prefers-reduced-motion` do sistema continua valendo). Só para o
       * ícone do próprio controle que mostra esse estado (meditação), que usa a Web Animations API, fora do Framer.
       */
      playsWhenAnimationsPaused?: boolean;
    }
  | {
      kind: 'state';
      Graphic: ComponentType<IconGraphicProps>;
      applyState: (element: SVGSVGElement, isActive: boolean) => void;
    };
