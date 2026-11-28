'use client';
import { useAnimate, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type RefObject } from 'react';

import { useA11y } from '@/shared/contexts/a11y-context';
import { ANIMATED_ICONS, type AnimatedIconName } from './animated-icon-registry';
import type { AnimatedIconDefinition, AnimatedIconTrigger, IconAnimate } from './types';
import { useHostActivity } from './use-host-activity';
import { useLoopingCycle } from './use-looping-cycle';
import { useStateAnimation } from './use-state-animation';

type AnimatedIconProps = {
  name: AnimatedIconName;
  sizePixels?: number;
  /** Quando animar; padrão `auto`. Ver `AnimatedIconTrigger`. */
  trigger?: AnimatedIconTrigger;
  /** Só vale em `trigger="controlled"`. */
  isPlaying?: boolean;
  /**
   * Toca um ciclo assim que o ícone monta, além do `trigger` (ex.: o ícone que volta no lugar do de fechar).
   * Não impede o hover/foco de tocar de novo depois.
   */
  playOnMount?: boolean;
  /** Classes do invólucro (ex.: opacidade do tom do link). */
  className?: string;
};

/**
 * `true` só na primeira renderização (quando `isEnabled`) e `false` logo depois: o ciclo disparado por ele termina
 * sem ser cortado, e o hover/foco seguinte volta a ser uma nova ativação (false → true).
 */
function useMountPulse(isEnabled: boolean): boolean {
  const [isPulsing, setIsPulsing] = useState(isEnabled);
  useEffect(() => {
    if (isPulsing) setIsPulsing(false);
  }, [isPulsing]);
  return isPulsing;
}

const NO_CYCLE = () => Promise.resolve();

function pickCycle(
  definition: AnimatedIconDefinition,
  animate: IconAnimate,
  root: RefObject<SVGSVGElement | null>,
): () => Promise<unknown> {
  return definition.kind === 'cycle' ? () => definition.playCycle(animate, root.current) : NO_CYCLE;
}

/**
 * Ícone decorativo com animação própria, definido uma vez no catálogo (`ANIMATED_ICONS`).
 * Ícones `cycle` repetem só em `auto`; nos demais modos tocam UM ciclo por ativação (com fim, mesmo com o mouse parado em cima) e, ao sair, terminam o ciclo em andamento; ícones
 * `state` vão à pose ativa enquanto disparados e voltam ao sair. Fica estático com "pausar animações"
 * ativo ou com `prefers-reduced-motion`.
 * @example <AnimatedIcon name="tea-cup" sizePixels={20} trigger="parent" />
 * @example <AnimatedIcon name="arrow-up-right" sizePixels={16} trigger="parent" />
 */
export function AnimatedIcon({
  name,
  sizePixels = 24,
  trigger = 'auto',
  isPlaying = false,
  playOnMount = false,
  className,
}: AnimatedIconProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const definition: AnimatedIconDefinition = ANIMATED_ICONS[name];
  const { features } = useA11y();
  const shouldReduceMotion = useReducedMotion();
  const ignoresPause = definition.kind === 'cycle' && definition.playsWhenAnimationsPaused === true;
  const isMotionAllowed = !shouldReduceMotion && (ignoresPause || !features.pauseAnimations);
  const isHoverTrigger = trigger === 'hover' || trigger === 'parent';
  const isHostActive = useHostActivity(wrapperRef, trigger === 'parent' ? 'parent' : 'self', isHoverTrigger);

  const isMountPulse = useMountPulse(playOnMount);
  const isTriggered =
    trigger === 'auto' ||
    trigger === 'mount' ||
    isMountPulse ||
    (trigger === 'controlled' && isPlaying) ||
    (isHoverTrigger && isHostActive);
  const isAnimating = isMotionAllowed && isTriggered;
  useLoopingCycle(
    pickCycle(definition, animate, scope),
    isAnimating && definition.kind === 'cycle',
    trigger === 'auto',
  );
  useStateAnimation(definition, scope, isAnimating);

  return (
    <span ref={wrapperRef} className={`inline-flex shrink-0${className ? ` ${className}` : ''}`}>
      <definition.Graphic ref={scope} sizePixels={sizePixels} />
    </span>
  );
}
