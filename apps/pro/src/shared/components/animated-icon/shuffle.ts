/**
 * Cópia embaralhada (Fisher-Yates); não altera a lista recebida. Chamada a cada rodada, sorteia uma ordem nova.
 * @example const order = shuffled(['a', 'b', 'c']);
 */
export function shuffled<Item>(items: readonly Item[]): Item[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex] as Item, copy[index] as Item];
  }
  return copy;
}
