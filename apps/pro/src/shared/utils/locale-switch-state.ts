import { LOCALE_SWITCH_SETTLE_MILLISECONDS, LOCALE_SWITCH_TIMEOUT_MILLISECONDS } from '@/shared/animations';

/*
 * Estado de módulo (não React context) de propósito: trocar o segmento dinâmico `[locale]`
 * remonta layout e árvore inteira, então qualquer provider/ref/state é destruído no meio da
 * troca. Só o módulo sobrevive ao remount. Roda apenas no cliente (chamado de event handler
 * e de layout effects); no servidor a flag fica sempre `false`.
 */
let isSwitching = false;
let resetTimeout: ReturnType<typeof setTimeout> | undefined;

function scheduleReset(delayMilliseconds: number): void {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    isSwitching = false;
  }, delayMilliseconds);
}

/** Marca o início da troca de idioma; expira sozinha se o novo locale nunca chegar. */
export function beginLocaleSwitch(): void {
  isSwitching = true;
  scheduleReset(LOCALE_SWITCH_TIMEOUT_MILLISECONDS);
}

/** Indica se textos que montam ou mudam agora devem rodar a decifragem. */
export function isLocaleSwitching(): boolean {
  return isSwitching;
}

/**
 * Chamado pelo primeiro `ScrambleText` que reage à troca: o novo idioma já chegou, então a
 * flag só precisa durar até os demais textos do mesmo commit lerem-na.
 */
export function settleLocaleSwitch(): void {
  if (isSwitching) scheduleReset(LOCALE_SWITCH_SETTLE_MILLISECONDS);
}
