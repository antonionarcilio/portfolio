/**
 * Sorteia até `count` itens distintos (Fisher–Yates parcial) sem alterar a lista original.
 * O gerador entra por parâmetro para o sorteio ser testável.
 * @example pickRandomItems(['a', 'b', 'c'], 2) // ex.: ['c', 'a']
 */
export function pickRandomItems<Item>(
  items: readonly Item[],
  count: number,
  random: () => number = Math.random,
): Item[] {
  const pool = [...items];
  const pickedCount = Math.min(count, pool.length);
  for (let index = 0; index < pickedCount; index++) {
    const swapIndex = index + Math.floor(random() * (pool.length - index));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, pickedCount);
}
