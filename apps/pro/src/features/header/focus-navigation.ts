import type { KeyboardEvent } from 'react';

const ENABLED_BUTTON_SELECTOR = 'button:not(:disabled)';

type FocusStep = 'next' | 'previous' | 'first' | 'last';

/** Lê a tecla de navegação; `previousKey`/`nextKey` mudam com o eixo (vertical ou horizontal). */
function readFocusStep(key: string, previousKey: string, nextKey: string): FocusStep | null {
  if (key === previousKey) return 'previous';
  if (key === nextKey) return 'next';
  if (key === 'Home') return 'first';
  if (key === 'End') return 'last';
  return null;
}

function resolveTargetIndex(step: FocusStep, currentIndex: number, count: number): number {
  if (step === 'first') return 0;
  if (step === 'last') return count - 1;
  const offset = step === 'next' ? 1 : -1;
  return (currentIndex + offset + count) % count;
}

/**
 * Move o foco entre os botões habilitados de `container` com as setas do eixo dado (e Home/End),
 * circulando nas pontas. Devolve `true` se a tecla foi tratada, para o chamador cancelar o scroll.
 * @example onKeyDown={(event) => moveFocusWithinContainer(event, 'vertical')}
 */
export function moveFocusWithinContainer(event: KeyboardEvent<HTMLElement>, axis: 'vertical' | 'horizontal'): boolean {
  const [previousKey, nextKey] = axis === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
  const step = readFocusStep(event.key, previousKey, nextKey);
  if (!step) return false;

  const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ENABLED_BUTTON_SELECTOR));
  if (buttons.length === 0) return false;

  const currentIndex = buttons.indexOf(document.activeElement as HTMLElement);
  buttons[resolveTargetIndex(step, currentIndex, buttons.length)].focus();
  event.preventDefault();
  return true;
}
