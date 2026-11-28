'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { ICON_CYCLE_MINIMUM_MILLISECONDS } from '@/shared/animations';

/** Layout effect no cliente: o ciclo começa antes da primeira pintura (sem 1 frame do ícone já completo). */
const useStartEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type CycleLoopState = {
  playCycle: () => Promise<unknown>;
  shouldPlay: boolean;
  isLooping: boolean;
  /** Ativação que chegou com um ciclo ainda em andamento: toca de novo ao terminar. */
  hasPendingReplay: boolean;
  isMounted: boolean;
  /** Sobe a cada desmontagem; uma execução de outra geração foi abandonada e não mexe mais em nada. */
  generation: number;
  isRunning: boolean;
};

/**
 * Toca `playCycle` quando `shouldPlay` vira `true`. Com `isLooping` (modo `auto`) repete enquanto `shouldPlay`
 * durar; sem ele (hover, foco, controlado, montagem) toca UM ciclo por ativação e para, mesmo com o mouse ainda
 * em cima. Se `shouldPlay` cai no meio do ciclo, ele termina (a animação não é cortada). Uma nova ativação durante
 * um ciclo toca de novo ao fim. Um ciclo abaixo de `ICON_CYCLE_MINIMUM_MILLISECONDS` encerra o loop, para nunca
 * girar em vazio se o Framer Motion estiver pausado.
 *
 * Desmontar abandona a execução em curso: o `useAnimate` para as animações do escopo ao desmontar e uma
 * animação parada nunca resolve a promessa — sem isso o loop ficaria preso (o StrictMode do dev monta,
 * desmonta e monta de novo, e a segunda montagem nunca tocaria).
 * @example useLoopingCycle(() => definition.playCycle(animate), isTriggered, trigger === 'auto');
 */
export function useLoopingCycle(playCycle: () => Promise<unknown>, shouldPlay: boolean, isLooping: boolean): void {
  const stateRef = useRef<CycleLoopState>({
    playCycle,
    shouldPlay,
    isLooping,
    hasPendingReplay: false,
    isMounted: false,
    generation: 0,
    isRunning: false,
  });
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    Object.assign(stateRef.current, { playCycle, shouldPlay, isLooping });
  }, [playCycle, shouldPlay, isLooping]);

  useEffect(() => {
    const state = stateRef.current;
    state.isMounted = true;
    return () => {
      state.isMounted = false;
      state.generation += 1;
      state.isRunning = false;
      state.hasPendingReplay = false;
    };
  }, []);

  useStartEffect(() => {
    const wasPlaying = wasPlayingRef.current;
    wasPlayingRef.current = shouldPlay;
    if (!shouldPlay) return;
    const state = stateRef.current;
    if (state.isRunning) {
      // Só uma NOVA ativação (false → true) pede replay; o StrictMode re-executa o efeito com o mesmo valor.
      if (!wasPlaying) state.hasPendingReplay = true;
      return;
    }
    void runCycles(state);
  }, [shouldPlay]);
}

function shouldRunAnotherCycle(state: CycleLoopState): boolean {
  if (state.isLooping && state.shouldPlay) return true;
  const hasReplay = state.hasPendingReplay;
  state.hasPendingReplay = false;
  return hasReplay;
}

async function runCycles(state: CycleLoopState): Promise<void> {
  const generation = state.generation;
  state.isRunning = true;
  try {
    do {
      const startedAt = performance.now();
      await state.playCycle().catch(() => undefined);
      if (state.generation !== generation) return;
      if (performance.now() - startedAt < ICON_CYCLE_MINIMUM_MILLISECONDS) return;
    } while (shouldRunAnotherCycle(state));
  } finally {
    if (state.generation === generation) state.isRunning = false;
  }
}
