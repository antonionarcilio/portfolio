/** Diferença vertical (px) a partir da qual dois caracteres estão em linhas diferentes. */
const LINE_TOP_TOLERANCE_PIXELS = 1;

function readCharacterTop(range: Range, textNode: Text, index: number): number | undefined {
  range.setStart(textNode, index);
  range.setEnd(textNode, index + 1);
  return range.getClientRects()[0]?.top;
}

/**
 * Índices (UTF-16) do primeiro caractere de cada linha renderizada de `textElement`, exceto a
 * primeira. Espaços que ficam no fim da linha não geram retângulo e são ignorados.
 *
 * Serve para o overlay do `ScrambleText` repetir exatamente as quebras do texto real: letras
 * sorteadas são mais largas que as reais e, deixadas quebrar sozinhas, ganham linhas extras
 * que vazam para fora da caixa reservada.
 *
 * @example
 * measureLineBreakIndexes(headingSpan); // [14] — o texto quebra antes do caractere 14
 */
export function measureLineBreakIndexes(textElement: HTMLElement): number[] {
  const textNode = textElement.firstChild;
  if (textNode?.nodeType !== Node.TEXT_NODE) return [];
  const range = document.createRange();
  const breakIndexes: number[] = [];
  let currentLineTop: number | undefined;

  for (let index = 0; index < (textNode.textContent?.length ?? 0); index++) {
    const top = readCharacterTop(range, textNode as Text, index);
    if (top === undefined) continue;
    if (currentLineTop !== undefined && top > currentLineTop + LINE_TOP_TOLERANCE_PIXELS) breakIndexes.push(index);
    if (currentLineTop === undefined || top > currentLineTop + LINE_TOP_TOLERANCE_PIXELS) currentLineTop = top;
  }
  return breakIndexes;
}
