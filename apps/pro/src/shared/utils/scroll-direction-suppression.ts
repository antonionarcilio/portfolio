/** Tempo para o layout assentar após uma opção de acessibilidade e o scroll anchoring terminar de ajustar a posição. */
const LAYOUT_SETTLE_MILLISECONDS = 600;

let suppressedUntilTimestamp = 0;

/**
 * Pede para `useScrollDirection` ignorar os scrolls dos próximos instantes. Fonte monoespaçada,
 * espaçamento e escala mudam a altura da página e o navegador reposiciona o scroll sozinho; sem
 * isso o header lê o reposicionamento como se a pessoa tivesse rolado e some. Estado de módulo
 * (não React) porque quem muda o layout e quem ouve o scroll estão em árvores diferentes.
 * @example suppressScrollDirectionForLayoutChange(); // logo antes de aplicar as classes no <html>
 */
export function suppressScrollDirectionForLayoutChange(): void {
  suppressedUntilTimestamp = performance.now() + LAYOUT_SETTLE_MILLISECONDS;
}

export function isScrollDirectionSuppressed(): boolean {
  return performance.now() < suppressedUntilTimestamp;
}
