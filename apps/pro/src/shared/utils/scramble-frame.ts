const SCRAMBLE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SCRAMBLABLE_CHARACTER = /[\p{L}\p{N}]/u;

/** Sorteia um caractere do alfabeto de embaralhamento. */
export function pickScrambleCharacter(): string {
  return SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)];
}

/**
 * Insere uma quebra de linha antes de cada índice de `breakIndexes` (ordem crescente).
 *
 * @example
 * insertLineBreaks('Imagine as possibilidades', [11]); // 'Imagine as \npossibilidades'
 */
export function insertLineBreaks(frame: string, breakIndexes: number[]): string {
  return breakIndexes.reduceRight((text, index) => `${text.slice(0, index)}\n${text.slice(index)}`, frame);
}

/**
 * Monta um quadro do efeito de decifragem: os primeiros `progress * length` caracteres já
 * estão no texto final; os demais viram caracteres sorteados. Espaços e pontuação nunca são
 * trocados. As quebras de linha NÃO vêm daqui: letras sorteadas têm outra largura, então quem
 * renderiza o quadro deve impor as quebras do texto real com `insertLineBreaks`.
 *
 * @example
 * buildScrambleFrame('Olá, mundo', 0.3, pickScrambleCharacter); // 'Olá' + sorteio + ', ' preservado
 */
export function buildScrambleFrame(target: string, progress: number, pickCharacter: () => string): string {
  const resolvedCount = Math.floor(progress * target.length);
  return Array.from(target, (character, index) => {
    if (index < resolvedCount || !SCRAMBLABLE_CHARACTER.test(character)) return character;
    return pickCharacter();
  }).join('');
}
