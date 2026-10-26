'use client';
import { animate, useReducedMotion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';

import { SCRAMBLE_DURATION_SECONDS, SCRAMBLE_EASING, SCRAMBLE_FRAMES_PER_SECOND } from '@/shared/animations';
import { isLocaleSwitching, settleLocaleSwitch } from '@/shared/utils/locale-switch-state';
import { buildScrambleFrame, pickScrambleCharacter } from '@/shared/utils/scramble-frame';

const FRAME_INTERVAL_MILLISECONDS = 1000 / SCRAMBLE_FRAMES_PER_SECOND;

/**
 * Roda a decifragem de `targetText` sobre `overlay` e devolve a função que a interrompe.
 * Enquanto roda, `wrapper` recebe `data-scrambling` — é o que torna o texto real transparente.
 */
function runScramble(wrapper: HTMLElement, overlay: HTMLElement, targetText: string): () => void {
  let lastFrameTimestamp = Number.NEGATIVE_INFINITY;

  const finish = () => {
    delete wrapper.dataset.scrambling;
    overlay.textContent = '';
  };

  const render = (progress: number) => {
    const now = performance.now();
    if (progress < 1 && now - lastFrameTimestamp < FRAME_INTERVAL_MILLISECONDS) return;
    lastFrameTimestamp = now;
    overlay.textContent = buildScrambleFrame(targetText, progress, pickScrambleCharacter);
  };

  wrapper.dataset.scrambling = 'true';
  render(0);
  const controls = animate(0, 1, {
    duration: SCRAMBLE_DURATION_SECONDS,
    ease: [...SCRAMBLE_EASING],
    onUpdate: render,
    onComplete: finish,
  });

  return () => {
    controls.stop();
    finish();
  };
}

/**
 * Texto que se "decifra" ao ser trocado durante uma mudança de idioma.
 *
 * Sem layout shift: o texto real continua no fluxo (só fica transparente durante o efeito) e
 * reserva a caixa final; os caracteres sorteados ficam em um overlay `absolute`. O texto real
 * também é o que leitores de tela leem — o overlay é `aria-hidden`.
 *
 * @example
 * <h1 className="text-display-lg"><ScrambleText>{t('heroHeading')}</ScrambleText></h1>
 */
export function ScrambleText({ children: text, className }: { children: string; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const previousTextRef = useRef<string | null>(null);

  // Layout effect (não useEffect) para o novo texto nunca ser pintado antes do embaralhamento.
  // Anima na montagem também: trocar o segmento `[locale]` remonta a árvore, então o texto novo
  // normalmente chega como um elemento novo, não como um `children` alterado.
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !overlay) return;
    const previousText = previousTextRef.current;
    if (previousText === text) return;
    previousTextRef.current = text;
    const shouldScramble = !shouldReduceMotion && isLocaleSwitching();
    const stopScramble = shouldScramble ? runScramble(wrapper, overlay, text) : undefined;
    if (shouldScramble) settleLocaleSwitch();
    // Restaurar o texto anterior no cleanup mantém o efeito correto no double-invoke do StrictMode.
    return () => {
      previousTextRef.current = previousText;
      stopScramble?.();
    };
  }, [text, shouldReduceMotion]);

  return (
    <span ref={wrapperRef} className={`group relative block ${className ?? ''}`}>
      <span className="group-data-[scrambling=true]:text-transparent">{text}</span>
      <span ref={overlayRef} aria-hidden className="pointer-events-none absolute inset-0 select-none" />
    </span>
  );
}
