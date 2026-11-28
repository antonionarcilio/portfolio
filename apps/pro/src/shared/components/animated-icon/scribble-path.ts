/**
 * Pontos aleatórios dentro de ±`rangeUnits`, começando e terminando em 0: usados como keyframes, fazem o ícone
 * passear ao acaso e voltar ao lugar. Chamar uma vez por eixo e por ciclo (cada ciclo sorteia um trajeto novo).
 * @example animate('[data-pen]', { x: randomScribblePath(2, 5), y: randomScribblePath(2, 5) }, options);
 */
export function randomScribblePath(rangeUnits: number, pointCount: number): number[] {
  const points = Array.from({ length: pointCount }, () => (Math.random() * 2 - 1) * rangeUnits);
  return [0, ...points, 0];
}
